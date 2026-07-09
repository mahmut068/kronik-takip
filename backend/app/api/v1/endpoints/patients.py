from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.patient import PatientCreate, PatientResponse
from app.services import patient as patient_service
from app.worker.tasks import analyze_patient_risk_data

router = APIRouter()

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient_endpoint(patient_in: PatientCreate, db: AsyncSession = Depends(get_db)):
    """Sisteme yeni bir hasta kaydeder. TC Kimlik No benzersizliği kontrol edilir."""
    return await patient_service.create_patient(db, patient_in)

@router.get("/", response_model=list[PatientResponse])
async def read_patients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """O(log n) veritabanı indekslerini kullanarak hastaları sayfalayıp getirir."""
    return await patient_service.get_patients_paginated(db, skip=skip, limit=limit)

@router.post("/{patient_id}/analyze", status_code=status.HTTP_202_ACCEPTED)
async def trigger_patient_analysis(patient_id: str):
    """
    Kritik: Ağır AI hesaplama işlemlerini Main Thread'i bloklamadan
    arka plana (Celery) gönderir. Kullanıcı anında 202 Accepted yanıtını alır.
    """
    task = analyze_patient_risk_data.delay(patient_id)
    return {"message": "Analiz görevi arka planda başlatıldı.", "task_id": task.id}
