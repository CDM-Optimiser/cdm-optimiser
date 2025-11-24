import pandas as pd
from datetime import datetime

def gms_not_cdm_generator():
    
    # Abriendo archivos
    gms=pd.read_csv("CSV/gms.csv",sep=";")
    cdm=pd.read_csv("CSV/cdm.csv",sep=";")
    
    # dividir GMS en numero y caducidad
    gms[["gms", "expdate"]] = gms["gms"].str.split("\n", n=1, expand=True)
    
    # limpiar comillas de gms y expdate
    gms["gms"] = gms["gms"].str.replace('"', "", regex=False)
    gms["expdate"] = gms["expdate"].str.replace('"', "", regex=False)
    
    # Generando lista con SOLO los GMS que no están ya en CDM
    gms_not_cdm=gms[~gms["gms"].isin(cdm["gms"])]
    
    # Exportando a CSV
    gms_not_cdm.to_csv("gms_not_cdm.csv",index=False)
    
    
if __name__=="__main__":    
    gms_not_cdm_generator()
    