import pandas as pd
from datetime import datetime

def dm_candidate_detector():
    
    # Abrir archivos
    gms=pd.read_csv("gms_not_cdm.csv")
    dm=pd.read_csv("CSV/dm.csv",sep=";")
    
    # Generando nombre completo en dm
    
    dm["name"]=dm["lastname"]+", "+dm["firstname"]
    
    # Detectando diabéticos en GMS not CDM
    
    gms['dm'] = gms[['name','dob']].apply(tuple, axis=1).isin(
    dm[['name','dob']].apply(tuple, axis=1)
    ).astype(int)
    
    # Guardando nuevo gms_not_cdm
    
    gms.to_csv("gms_not_cdm.csv",index=False)
    
    
if __name__=="__main__":    
    dm_candidate_detector()
    
    