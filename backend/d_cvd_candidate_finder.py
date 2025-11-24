import pandas as pd
from datetime import datetime

def cvd_candidate_detector():
    
    # Abrir archivos
    gms=pd.read_csv("gms_not_cdm.csv")
    cvd=pd.read_csv("CSV/cvd.csv",sep=";")
    
    # Detectando asmáticos en GMS not CDM
    
    gms['cvd'] = gms[['name','dob']].apply(tuple, axis=1).isin(
    cvd[['name','dob']].apply(tuple, axis=1)
    ).astype(int)
    
    # Guardando nuevo gms_not_cdm
    
    gms.to_csv("gms_not_cdm.csv",index=False)
    
if __name__=="__main__":    
    cvd_candidate_detector()
    