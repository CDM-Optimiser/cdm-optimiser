import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import { BACKEND_URL } from '../../env.ts';
import { getErrorMessage } from '../../utils/getErrorMessage.ts';
import type { Patient } from '../../utils/types/patient.ts';

type Status = 'all' | 'accepted' | 'refused' | 'pending';

type PatientsContextType = {
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
    status?: Status
  ) => Promise<void>;
};

const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined
);

export const PatientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedPatients, setAcceptedPatients] = useState(0);
  const [refusedPatients, setRefusedPatients] = useState(0);
  const [pendingPatients, setPendingPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(
    async (
      limit?: number,
      offset?: number,
      search = '',
      status: Status = 'all'
    ) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (limit != null) params.append('limit', limit.toString());
        if (offset != null) params.append('offset', offset.toString());
        if (search) params.append('search', search);
        params.append('status', status);

        const url = `${BACKEND_URL}/api/patients?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const patientsData = await response.json();
        const parsedPatients = patientsData.data.map((p: Patient) => ({
          ...p,
          asthma: Boolean(p.asthma),
          dm: Boolean(p.dm),
          cvd: Boolean(p.cvd),
          copd: Boolean(p.copd),
          accepted: p.accepted != null ? Boolean(p.accepted) : undefined,
          refused: p.refused != null ? Boolean(p.refused) : undefined,
        }));

        setPatients(parsedPatients);
        setTotalPatients(patientsData.total);
        setAcceptedPatients(patientsData.counts.accepted);
        setRefusedPatients(patientsData.counts.refused);
        setPendingPatients(patientsData.counts.pending);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    setTotalPatients(patients.length);
    setAcceptedPatients(patients.filter((p) => p.accepted === true).length);
    setRefusedPatients(patients.filter((p) => p.refused === true).length);
    setPendingPatients(
      patients.filter((p) => !(p.accepted === true) && !(p.refused === true))
        .length
    );
  }, [
    patients,
    setTotalPatients,
    setAcceptedPatients,
    setRefusedPatients,
    setPendingPatients,
  ]);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        totalPatients,
        acceptedPatients,
        refusedPatients,
        pendingPatients,
        loading,
        error,
        setPatients,
        loadPatients,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatientsContext = () => {
  const ctx = useContext(PatientsContext);
  if (!ctx)
    throw new Error('usePatientsContext must be used within PatientsProvider');
  return ctx;
};
