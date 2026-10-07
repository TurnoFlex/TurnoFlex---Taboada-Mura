from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, services

app = FastAPI(
    title="TurnoFlex - API FastAPI",
    description="Backend en FastAPI con autenticación JWT y paridad con Express",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta raíz de comprobación
@app.get("/")
def read_root():
    return {"message": "API FastAPI funcionando correctamente"}

# Incluir routers con el prefijo /api/v1
app.include_router(auth.router)
app.include_router(services.router, prefix="/api/v1")