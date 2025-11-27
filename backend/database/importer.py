import sys
from pathlib import Path
import pandas as pd
from backend.database.database import Base, engine, SessionLocal, Patient
import logging
import os

logger = logging.getLogger(__name__)


def runtime_base() -> Path:
    return Path(getattr(sys, "_MEIPASS", Path(__file__).parent)).resolve()


def csv_runtime_path(filename: str = "patients_300_final.csv") -> Path:
    env_path = os.getenv("CDM_CSV_PATH")
    if env_path:
        return Path(env_path)
    return runtime_base() / "backend" / "data" / filename


def import_csv_to_sqlite(csv_filename: str = "patients_300_final.csv"):
    csv_path = csv_runtime_path(csv_filename)
    if not csv_path.exists():
        logger.warning("CSV not found, skipping DB import: %s", csv_path)
        return

    logger.info("Importing CSV from: %s", csv_path)
    df = pd.read_csv(str(csv_path))
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    
    for _, row in df.iterrows():
        patient = Patient(
            name=row.get("name"),
            dob=row.get("dob"),
            gender=row.get("gender"),
            address=row.get("address"),
            home_phone=row.get("home_phone"),
            mobile_phone=row.get("mobile_phone"),
            email=row.get("email"),
            gms=row.get("gms"),
            regdate=row.get("regdate"),
            type=row.get("type"),
            hcp=row.get("hcp"),
            expdate=row.get("expdate"),
            asthma=row.get("asthma"),
            dm=row.get("dm"),
            cvd=row.get("cvd"),
            copd=row.get("copd"),
            cdm_condition_count=row.get("cdm_condition_count"),
            potential_income=row.get("potential_income"),
            accepted=(
                None if pd.isna(row.get("accepted")) else bool(row.get("accepted"))
            ),
            refused=None if pd.isna(row.get("refused")) else bool(row.get("refused")),
        )
        session.add(patient)
    session.commit()
    session.close()
    logger.info("Import complete")


if __name__ == "__main__":
    import_csv_to_sqlite()
