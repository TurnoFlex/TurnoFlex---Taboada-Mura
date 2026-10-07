from fastapi import FastAPI
from app.routers import auth, services, appointment

app = FastAPI(
    title="TurnoFlex API - FastAPI",
    version="1.0.0",
    docs_url="/docs"
)

app.include_router(auth.router)
app.include_router(services.router)
app.include_router(appointment.router)
@app.get("/")
def root():
    return {"message": "Bienvenido a la API de TurnoFlex"}