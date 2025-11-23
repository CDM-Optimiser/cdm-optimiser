import pandas as pd

def cdm_condition_counter():
    
    gms=pd.read_csv("gms_not_cdm.csv")
    
    gms["cdm_condition_count"] = (
        gms["asthma"] +
        gms["copd"] +
        gms["cvd"] +
        gms["dm"] )
    
    gms.to_csv("gms_not_cdm.csv",index=False)
    
cdm_condition_counter()