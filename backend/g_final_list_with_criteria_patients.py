import pandas as pd

def final_list_generator():
    df=pd.read_csv("gms_not_cdm.csv")

    df1=df[df["cdm_condition_count"]>0]

    interesting_columns=["name","dob","address","gms","mobile_phone","asthma","dm","cvd","copd","cdm_condition_count"]

    final_list=df1.copy(interesting_columns)

    final_list= final_list.loc[:, ~final_list.columns.str.contains("^Unnamed")]

    final_list.to_csv("gms_not_cdm_with_criteria.csv", index=False)
    
if __name__=="__main__":    
    final_list_generator()
