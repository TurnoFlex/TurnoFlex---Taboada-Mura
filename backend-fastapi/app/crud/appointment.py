from datetime import datetime, timedelta
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.appointment import Appointment, AppointmentStatus
from app.models.service import Service

async def check_overlap(
    db: AsyncSession, 
    service_id: int, 
    start_time: datetime, 
    end_time: datetime
) -> bool:
    query = select(Appointment).where(
        and_(
            Appointment.service_id == service_id,
            Appointment.status != AppointmentStatus.CANCELADO,
            Appointment.date_time < end_time,
            Appointment.end_time > start_time
        )
    )
    result = await db.execute(query)
    return result.scalars().first() is not None

async def create_appointment_db(
    db: AsyncSession, 
    user_id: int, 
    service: Service, 
    start_time: datetime
) -> Appointment:
    end_time = start_time + timedelta(minutes=service.duration_minutes)
    
    new_appointment = Appointment(
        user_id=user_id,
        service_id=service.id,
        date_time=start_time,
        end_time=end_time,
        status=AppointmentStatus.PENDIENTE
    )
    db.add(new_appointment)
    await db.commit()
    await db.refresh(new_appointment)
    return new_appointment
