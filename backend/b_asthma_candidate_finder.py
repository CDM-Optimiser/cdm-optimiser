import pandas as pd
from datetime import datetime

def asthma_candidate_detector():
    
    # Abrir archivos
    gms=pd.read_csv("gms_not_cdm.csv")
    asthma=pd.read_csv("CSV/asthma.csv",sep=";")
    
    # Limpiando asthma
    
    asthma=asthma[asthma["patient"].notna() & asthma["patient"].str.strip()!=0]

    # Detectando asmáticos en GMS not CDM
    
    gms["asthma"] = gms["gms"].isin(asthma["gms"]).astype(int)
    
    # Guardando nuevo gms_not_cdm
    
    gms.to_csv("gms_not_cdm.csv",index=False)
    

if __name__=="__main__":      
    asthma_candidate_detector()
    
    