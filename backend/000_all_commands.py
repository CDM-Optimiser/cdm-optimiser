import pandas as pd
import a_gms_not_cdm,b_asthma_candidate_finder,c_dm_candidate_finder,d_cvd_candidate_finder,c_dm_candidate_finder,d_cvd_candidate_finder,e_copd_candidate_finder,f_cdm_condition_counter,g_final_list_with_criteria_patients,h_potential_income,zzz_income_calculator

def main():
    a_gms_not_cdm.gms_not_cdm_generator()
    b_asthma_candidate_finder.asthma_candidate_detector()
    c_dm_candidate_finder.dm_candidate_detector()
    d_cvd_candidate_finder.cvd_candidate_detector()
    e_copd_candidate_finder.copd_candidate_detector()
    f_cdm_condition_counter.cdm_condition_counter()
    g_final_list_with_criteria_patients.final_list_generator()
    h_potential_income.potential_income_calculator()
    zzz_income_calculator.main()
    
if __name__=="__main__":
    main()