from sqlalchemy import create_engine, Boolean, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///backend/app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    dob = Column(String)
    gender = Column(String)
    address = Column(String)
    home_phone = Column(String)
    mobile_phone = Column(String)
    email = Column(String)
    gms = Column(String)
    regdate = Column(String)
    type = Column(String)
    hcp = Column(String)
    expdate = Column(String)
    asthma = Column(Integer)
    dm = Column(Integer)
    cvd = Column(Integer)
    copd = Column(Integer)
    cdm_condition_count = Column(Integer)
    potential_income = Column(Integer)
    accepted = Column(Boolean, nullable=True)
    refused = Column(Boolean, nullable=True)
