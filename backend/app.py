from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
import os
from typing import Optional
from backend.database.database import SessionLocal, Patient

load_dotenv()

MAX_PATIENTS = int(os.getenv("MAX_PATIENTS", 1000))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./patients.db")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/patients")
def get_patients(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(None, ge=1),
    offset: int = Query(0, ge=0),
    search: str = Query("", alias="search"),
    status: str = Query("all", regex="^(all|accepted|refused|pending)$"),
):
    query = db.query(Patient)

    if search:
        search_pattern = f"%{search.lower()}%"
        query = query.filter(
            or_(
                func.lower(Patient.name).like(search_pattern),
                Patient.dob.like(search_pattern),
                func.lower(Patient.gms).like(search_pattern),
            )
        )

    if status == "accepted":
        query = query.filter(Patient.accepted == True, Patient.refused != True)
    elif status == "refused":
        query = query.filter(Patient.refused == True, Patient.accepted != True)
    elif status == "pending":
        query = query.filter(
            or_(Patient.accepted == None, Patient.accepted == False),
            or_(Patient.refused == None, Patient.refused == False),
        )

    total = query.count()
    if limit is not None:
        patients = query.offset(offset).limit(limit).all()
    else:
        patients = query.all()

    accepted_count = db.query(Patient).filter(Patient.accepted == True).count()
    refused_count = db.query(Patient).filter(Patient.refused == True).count()
    pending_count = (
        db.query(Patient)
        .filter(
            or_(Patient.accepted == None, Patient.accepted == False),
            or_(Patient.refused == None, Patient.refused == False),
        )
        .count()
    )

    return {
        "total": total,
        "counts": {
            "accepted": accepted_count,
            "refused": refused_count,
            "pending": pending_count,
        },
        "limit": limit,
        "offset": offset,
        "results": len(patients),
        "data": [
            {
                key: value
                for key, value in patient.__dict__.items()
                if key != "_sa_instance_state"
            }
            for patient in patients
        ],
    }


@app.put("/api/patient/{gms}")
def update_patient(gms: str, data: dict, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.gms == gms).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for key, value in data.items():
        if hasattr(patient, key):
            setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return {
        key: value
        for key, value in patient.__dict__.items()
        if key != "_sa_instance_state"
    }
