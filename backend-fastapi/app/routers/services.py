from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.security import get_current_user, require_admin

router = APIRouter(
    prefix="/services",
    tags=["Services"]
)

@router.get("", response_model=List[ServiceResponse], status_code=status.HTTP_200_OK)
def list_services(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return db.query(Service).filter(Service.is_active == True).all()

@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(require_admin)
):
    new_service = Service(**service_in.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.put("/{service_id}", response_model=ServiceResponse, status_code=status.HTTP_200_OK)
def update_service(
    service_id: int,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(require_admin)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    
    for field, value in service_in.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
        
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}", status_code=status.HTTP_200_OK)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(require_admin)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    
    service.is_active = False
    db.commit()
    return {"message": "Servicio eliminado correctamente"}