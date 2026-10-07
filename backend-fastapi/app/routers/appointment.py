from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentResponse, AppointmentStatusUpdate
from app.security import get_current_user, require_role, UserTokenData
from app.crud.appointment import check_overlap, create_appointment_db
from app.models.appointment import Appointment
from app.models.service import Service

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    payload: AppointmentCreate,
    current_user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = await db.get(Service, payload.service_id)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado.")

    end_time = payload.date_time + timedelta(minutes=service.duration_minutes)

    is_occupied = await check_overlap(db, payload.service_id, payload.date_time, end_time)
    if is_occupied:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El horario seleccionado ya se encuentra ocupado."
        )

    return await create_appointment_db(db, current_user.id, service, payload.date_time)

@router.get("/my-appointments", response_model=List[AppointmentResponse])
async def get_my_appointments(
    current_user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Appointment).where(Appointment.user_id == current_user.id)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("", response_model=List[AppointmentResponse], dependencies=[Depends(require_role("ADMIN"))])
async def get_all_appointments(db: AsyncSession = Depends(get_db)):
    query = select(Appointment)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/{appointment_id}/status", response_model=AppointmentResponse, dependencies=[Depends(require_role("ADMIN"))])
async def update_appointment_status(
    appointment_id: int,
    payload: AppointmentStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    appointment = await db.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado.")

    appointment.status = payload.status
    await db.commit()
    await db.refresh(appointment)
    return appointment
