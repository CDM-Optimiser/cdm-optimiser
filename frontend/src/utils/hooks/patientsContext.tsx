import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import {getErrorMessage} from '../../utils/getErrorMessage.ts';
import type {Patient} from '../../utils/types/patient.ts';

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

export const PatientsProvider = ({children}: {children: React.ReactNode}) => {
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

        const res = await fetch(
          `http://localhost:8000/api/patients?${params.toString()}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const parsedPatients = data.data.map((p: Patient) => ({
          ...p,
          asthma: Boolean(p.asthma),
          dm: Boolean(p.dm),
          cvd: Boolean(p.cvd),
          copd: Boolean(p.copd),
          accepted: p.accepted != null ? Boolean(p.accepted) : undefined,
          refused: p.refused != null ? Boolean(p.refused) : undefined,
        }));

        setPatients(parsedPatients);
        setTotalPatients(data.total);
        setAcceptedPatients(data.counts.accepted);
        setRefusedPatients(data.counts.refused);
        setPendingPatients(data.counts.pending);
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
