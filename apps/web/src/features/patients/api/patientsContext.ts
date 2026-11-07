import {createContext} from 'react';
import type {Patient, StatusFilter} from '../model/patient.ts';

export type PatientsContextType = {
  patients: Patient[];
  totalPatients: number;
  acceptedPatients: number;
  refusedPatients: number;
  pendingPatients: number;
  loading: boolean;
  error: string | null;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  loadPatients: (
    limit?: number,
    offset?: number,
    search?: string,
    status?: StatusFilter,
    isBackgroundRefresh?: boolean
  ) => Promise<void>;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined
);
