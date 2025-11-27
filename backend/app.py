from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from backend.database.database import Base, engine, SessionLocal, Patient
from backend.database import importer
import os
from pathlib import Path
from typing import Optional

load_dotenv()

MAX_PATIENTS = int(os.getenv("MAX_PATIENTS", 1000))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

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


@app.on_event("startup")
def ensure_db_and_seed():
    # Ensure schema exists
    Base.metadata.create_all(bind=engine)

    # If using sqlite, ensure db file is in writable runtime path
    db_url = os.getenv("DATABASE_URL", "sqlite:///backend/app.db")
    if db_url.startswith("sqlite:///"):
        db_path = Path(db_url.replace("sqlite:///", "")).resolve()
        # If running packaged, copy sample DB or run importer if db missing/empty
        if not db_path.exists():
            # If a sample DB is in package, copy it
            sample = Path("backend/app.sample.db")
            if sample.exists():
                db_path.parent.mkdir(parents=True, exist_ok=True)
                sample.copy(db_path)
            else:
                # Import CSV to create DB
                importer.import_csv_to_sqlite()

    # If DB existed but is empty, seed data
    with SessionLocal() as session:
        if session.query(Patient).count() == 0:
            importer.import_csv_to_sqlite()


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
        safe_limit = min(limit, MAX_PATIENTS)
        patients = query.offset(offset).limit(safe_limit).all()
    else:
        patients = query.limit(MAX_PATIENTS).all()

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


@app.put("/api/patient/{patient_id}")
def update_patient(patient_id: int, data: dict, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

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
