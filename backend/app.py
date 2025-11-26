from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from backend.database.database import SessionLocal, Patient

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
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    search: str = Query("", alias="search"),
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

    total = query.count()
    patients = query.offset(offset).limit(limit).all()

    return {
        "data": [
            {
                key: value
                for key, value in patient.__dict__.items()
                if key != "_sa_instance_state"
            }
            for patient in patients
        ],
        "total": total,
        "limit": limit,
        "offset": offset,
        "results": len(patients),
    }


@app.put("/api/patient/{patient_id}")
def update_patient(patient_id: int, data: dict, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(404, "Patient not found")

    for key, value in data.items():
        if hasattr(patient, key):
            setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient
