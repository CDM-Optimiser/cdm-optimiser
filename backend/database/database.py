from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, Boolean, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.database.encryption import EncryptedString

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/app.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    dob = Column(String)
    gender = Column(EncryptedString)
    address = Column(EncryptedString)
    home_phone = Column(EncryptedString)
    mobile_phone = Column(EncryptedString)
    email = Column(EncryptedString)
    gms = Column(String)
    regdate = Column(EncryptedString)
    type = Column(EncryptedString)
    hcp = Column(EncryptedString)
    expdate = Column(EncryptedString)
    asthma = Column(Integer)
    dm = Column(Integer)
    cvd = Column(Integer)
    copd = Column(Integer)
    cdm_condition_count = Column(Integer)
    potential_income = Column(Integer)
    accepted = Column(Boolean, nullable=True)
    refused = Column(Boolean, nullable=True)
