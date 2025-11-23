import pandas as pd
from datetime import datetime

def copd_candidate_detector():
    
    # Abrir archivos
    gms=pd.read_csv("gms_not_cdm.csv")
    copd=pd.read_csv("CSV/copd.csv",sep=";")
    
    # Transformar gms dob to age
    
    gms['formated_dob'] = pd.to_datetime(gms['dob'], format='%d/%m/%Y', errors='coerce')

    today = pd.Timestamp.today() # Fecha de hoy

    # Calcular edad exacta
    gms['age'] = today.year - gms['formated_dob'].dt.year
    # Restar 1 si aún no ha cumplido años este año
    gms['age'] -= ((today.month < gms['formated_dob'].dt.month) | ((today.month == gms['formated_dob'].dt.month) & (today.day < gms['formated_dob'].dt.day)))
    
    
    # Transformar gms lastname, firstname a firstname lastname
    
    def reformat_name(name):
        last, first = name.split(',', 1)  # split only at the first comma
        return first.strip() + ' ' + last.strip()

    gms['fullname'] = gms['name'].apply(reformat_name)
    
    # Detectando copd en gms y flaggeando
    
    gms['copd'] = gms[['fullname','age']].apply(tuple, axis=1).isin(
    copd[['patient','age']].apply(tuple, axis=1)
    ).astype(int)
    
    
    # Borrando columna fullname de gms antes de guardar
    
    gms.drop(columns=["fullname"],inplace=True)
    
    gms.drop(columns=["age"],inplace=True)
    
    gms.drop(columns=["formated_dob"],inplace=True)
    
    # Guardando nuevo gms_not_cdm
    
    gms.to_csv("gms_not_cdm.csv",index=False)
    
    
    
    
copd_candidate_detector()
    