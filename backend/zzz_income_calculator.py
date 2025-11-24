import pandas as pd

def main():
      gms=pd.read_csv("gms_not_cdm_with_criteria.csv")

      ocf=60
      cdm1=210
      cdm2=250
      cdm3=300

      asthma=(gms['asthma'] == 1).sum()
      dm=(gms['dm'] == 1).sum()
      copd=(gms['copd'] == 1).sum()
      cvd=(gms['cvd'] == 1).sum()

      condition1=(gms["cdm_condition_count"]==1).sum()
      condition2=(gms["cdm_condition_count"]==2).sum()
      condition3=(gms["cdm_condition_count"]==3).sum()
      condition4=(gms["cdm_condition_count"]==4).sum()

      money_ocf=ocf*(asthma+dm+copd+cvd)
      money_cdm=cdm1*condition1+cdm2*condition2+cdm3*(condition3+condition4)
      money_total=money_cdm+money_ocf

      print(f"- Asthma patients missed: {asthma}")
      print(f"- DM patients missed: {dm}")
      print(f"- COPD patients missed: {copd}")
      print(f"- CVD patients missed: {cvd}")
      print("")
      print(f"- Patients with 1 CDM condition: {condition1}")
      print(f"- Patients with 2 CDM condition: {condition2}")
      print(f"- Patients with 3 CDM condition: {condition3}")
      print(f"- Patients with 4 CDM condition: {condition4}")
      print("")
      print(f""""Money missed for the first year:
            - OCF: {money_ocf} €
            - CDM: {money_cdm} €
            - Total: {money_total} €""")
      
if __name__=="__main__":
      main()