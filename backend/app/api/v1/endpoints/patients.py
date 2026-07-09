from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.patient import PatientCreate, PatientResponse
from app.services import patient as patient_service

router = APIRouter()

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient_endpoint(patient_in: PatientCreate, db: AsyncSession = Depends(get_db)):
    """Sisteme yeni bir hasta kaydeder. TC Kimlik No benzersizliği kontrol edilir."""
    return await patient_service.create_patient(db, patient_in)

@router.get("/", response_model=list[PatientResponse])
async def read_patients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """O(log n) veritabanı indekslerini kullanarak hastaları sayfalayıp getirir."""
    return await patient_service.get_patients_paginated(db, skip=skip, limit=limit)
