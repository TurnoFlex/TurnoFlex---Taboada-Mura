from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse, TokenData
from app.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 1. Verificar si el email ya existe
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya se encuentra registrado"
        )

    # 2. Hashear contraseña y crear registro
    hashed_pwd = hash_password(user_in.password)
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_pwd,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Generar JWT y devolver estructura JSON estandarizada
    token = create_access_token({"id": new_user.id, "email": new_user.email, "role": new_user.role})
    
    return TokenResponse(
        success=True,
        data=TokenData(
            token=token,
            user=UserResponse.model_validate(new_user)
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # 1. Buscar usuario por email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )

    # 2. Generar JWT
    token = create_access_token({"id": user.id, "email": user.email, "role": user.role})

    return TokenResponse(
        success=True,
        data=TokenData(
            token=token,
            user=UserResponse.model_validate(user)
        )
    )