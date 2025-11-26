import pandas as pd
from backend.database.database import Base, engine, SessionLocal, Patient


def import_csv_to_sqlite():
    print("Importing CSV into SQLite...")

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("backend/data/patients_300_final.csv")

    session = SessionLocal()

    for _, row in df.iterrows():
        patient = Patient(
            name=row["name"],
            dob=row["dob"],
            gender=row["gender"],
            address=row["address"],
            home_phone=row["home_phone"],
            mobile_phone=row["mobile_phone"],
            email=row["email"],
            gms=row["gms"],
            regdate=row["regdate"],
            type=row["type"],
            hcp=row["hcp"],
            expdate=row["expdate"],
            asthma=row["asthma"],
            dm=row["dm"],
            cvd=row["cvd"],
            copd=row["copd"],
            cdm_condition_count=row["cdm_condition_count"],
            potential_income=row["potential_income"],
            accepted=None if pd.isna(row["accepted"]) else bool(row["accepted"]),
            refused=None if pd.isna(row["refused"]) else bool(row["refused"]),
        )
        session.add(patient)

    session.commit()
    session.close()
    print("Import complete")


if __name__ == "__main__":
    import_csv_to_sqlite()
