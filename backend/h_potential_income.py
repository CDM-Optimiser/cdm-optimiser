import pandas as pd

def potential_income_calculator():
    
    df=pd.read_csv("gms_not_cdm_with_criteria.csv")
    
    # Crear columna de potential income con valor correspondiente
    
    df.loc[df["cdm_condition_count"]==1, "potential_income"]=210+60
    df.loc[df["cdm_condition_count"]==2, "potential_income"]=250+60
    df.loc[df["cdm_condition_count"]==3, "potential_income"]=300+60
    df.loc[df["cdm_condition_count"]==4, "potential_income"]=300+60
        
    # Guardar csv
    df.to_csv("gms_not_cdm_with_criteria.csv")
    
potential_income_calculator()