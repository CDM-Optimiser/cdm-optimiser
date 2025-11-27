import { createContext, useContext, useEffect, useState } from 'react';
import { getErrorMessage } from '../../utils/getErrorMessage.ts';
import type { Patient } from '../../utils/types/patient.ts';

type PatientsContextType = {
  patients: Patient[];
  totalPatients: number;
  acceptedPatients: number;
  refusedPatients: number;
  pendingPatients: number;
  loading: boolean;
  error: string | null;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  loadPatients: (limit?: number, offset?: number, search?: string, status?: 'all' | 'accepted' | 'refused' | 'pending') => void;
};

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedPatients, setAcceptedPatients] = useState(0);
  const [refusedPatients, setRefusedPatients] = useState(0);
  const [pendingPatients, setPendingPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async (
    limit: number = 10,
    offset: number = 0,
    search: string = '',
    status: 'all' | 'accepted' | 'refused' | 'pending' = 'all'
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('offset', Math.max(0, offset).toString());
      if (search) params.append('search', search);
      params.append('status', status);

      const response = await fetch(`http://localhost:8000/api/patients?${params.toString()}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const parsedPatients = data.data.map((patient: Patient) => ({
        ...patient,
        asthma: Boolean(patient.asthma),
        dm: Boolean(patient.dm),
        cvd: Boolean(patient.cvd),
        copd: Boolean(patient.copd),
        accepted: patient.accepted != null ? Boolean(patient.accepted) : undefined,
        refused: patient.refused != null ? Boolean(patient.refused) : undefined,
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
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <PatientsContext.Provider
      value={{ patients, totalPatients, acceptedPatients, refusedPatients, pendingPatients, loading, error, setPatients, loadPatients }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatientsContext = () => {
  const context = useContext(PatientsContext);
  if (!context) throw new Error('usePatientsContext must be used within PatientsProvider');
  return context;
};
