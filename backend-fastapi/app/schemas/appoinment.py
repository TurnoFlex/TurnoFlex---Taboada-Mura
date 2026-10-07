from datetime import datetime
from enum import Enum
from pydantic import BaseModel, field_validator

class AppointmentStatus(str, Enum):
    PENDIENTE = "PENDIENTE"
    CONFIRMADO = "CONFIRMADO"
    CANCELADO = "CANCELADO"
    COMPLETADO = "COMPLETADO"

class AppointmentCreate(BaseModel):
    service_id: int
    date_time: datetime

    @field_validator("date_time")
    @classmethod
    def validate_future_date(cls, value: datetime) -> datetime:
        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.now()
        if value <= now:
            raise ValueError("La fecha y hora del turno debe ser en el futuro.")
        return value

class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus

class ServiceResponse(BaseModel):
    id: int
    name: str
    duration_minutes: int
    price: float

    class Config:
        from_attributes = True

class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    service_id: int
    date_time: datetime
    end_time: datetime
    status: AppointmentStatus
    service: ServiceResponse | None = None

    class Config:
        from_attributes = True