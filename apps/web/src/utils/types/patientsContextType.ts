import type {Patient} from './patientType.ts';
import type {Status} from './statusType.ts';

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
    status?: Status,
    isBackgroundRefresh?: boolean
  ) => Promise<void>;
};
