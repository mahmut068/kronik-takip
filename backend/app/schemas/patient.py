from pydantic import BaseModel, Field, constr
from typing import Optional
import uuid
from datetime import datetime

class PatientBase(BaseModel):
    tc_no: str = Field(..., min_length=11, max_length=11, pattern=r"^\d{11}$", description="T.C. Kimlik Numarası")
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=0, le=120)
    risk_score: Optional[float] = Field(0.0, ge=0.0, le=100.0)
    is_critical: Optional[bool] = False

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=120)
    risk_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    is_critical: Optional[bool] = None

class PatientResponse(PatientBase):
    id: uuid.UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}
