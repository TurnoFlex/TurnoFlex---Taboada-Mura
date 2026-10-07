import os
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# Configuración de variables
SECRET_KEY = os.getenv("SECRET_KEY", "tu_secret_key_super_segura")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
ph = PasswordHasher()


class UserTokenData(BaseModel):
    id: int
    email: str
    role: str


# --- CONTRASEÑAS (Argon2id) ---

def hash_password(password: str) -> str:
    """Genera un hash seguro utilizando Argon2id."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash Argon2id."""
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False


# --- TOKENS (JWT) ---

def create_access_token(subject: Union[str, dict, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Genera un token JWT de acceso."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    if isinstance(subject, dict):
        to_encode = subject.copy()
        to_encode.update({"exp": expire})
    else:
        to_encode = {"sub": str(subject), "exp": expire}

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- SEGURIDAD Y ROLES (RBAC) ---

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserTokenData:
    """Obtiene y valida el usuario actual mediante el token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id") or payload.get("sub")
        email = payload.get("email", "")
        role = payload.get("role", "CLIENTE")

        if user_id is None:
            raise credentials_exception

        return UserTokenData(id=int(user_id), email=email, role=role)
    except Exception:
        raise credentials_exception


def require_role(required_role: str):
    """Dependencia para verificar roles específicos."""
    async def role_checker(current_user: UserTokenData = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos suficientes para realizar esta acción."
            )
        return current_user
    return role_checker


async def require_admin(current_user: UserTokenData = Depends(get_current_user)) -> UserTokenData:
    """Dependencia directa para verificar rol ADMIN."""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador."
        )
    return current_user