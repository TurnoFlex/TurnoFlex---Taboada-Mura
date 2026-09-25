import os
from dotenv import load_dotenv

load_dotenv()

class Settings: 
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/turnoflex_db") 
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey_turnoflex_2026_compatibilidad_express") 
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256") 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120")) 
settings = Settings()