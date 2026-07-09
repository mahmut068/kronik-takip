from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.patient import Patient
from app.schemas.patient import PatientCreate

async def create_patient(db: AsyncSession, patient_in: PatientCreate) -> Patient:
    # TC Kimlik No benzersizlik kontrolü
    stmt = select(Patient).where(Patient.tc_no == patient_in.tc_no)
    result = await db.execute(stmt)
    existing_patient = result.scalars().first()
    
    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu T.C. Kimlik Numarası ile kayıtlı bir hasta zaten var."
        )
        
    db_patient = Patient(**patient_in.model_dump())
    db.add(db_patient)
    await db.commit()
    await db.refresh(db_patient)
    return db_patient

async def get_patients_paginated(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Patient]:
    # O(log N) indeksli getirme işlemi (Veritabanında sıralanmış indeks kullanır)
    stmt = select(Patient).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())
