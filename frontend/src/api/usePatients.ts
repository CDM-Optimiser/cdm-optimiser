import { useEffect, useState } from 'react';
import type { Patient } from '../utils/types/patient.ts';
import { getErrorMessage } from '../utils/getErrorMessage.ts';

export function usePatients(
  limit: number,
  offset: number,
  searchText: string,
  status: 'all' | 'accepted' | 'refused' | 'pending'
) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedPatients, setAcceptedPatients] = useState(0);
  const [refusedPatients, setRefusedPatients] = useState(0);
  const [pendingPatients, setPendingPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (searchText) params.append('search', searchText);
        params.append('limit', limit.toString());
        params.append('offset', Math.max(0, offset).toString());
        params.append('status', status);

        const url = `http://localhost:8000/api/patients?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const patientsData = await response.json();

        const parsedPatients = patientsData.data.map((patient: Patient) => ({
          ...patient,
          asthma: Boolean(patient.asthma),
          dm: Boolean(patient.dm),
          cvd: Boolean(patient.cvd),
          copd: Boolean(patient.copd),
          accepted:
            patient.accepted != null ? Boolean(patient.accepted) : undefined,
          refused: patient.refused != null ? Boolean(patient.refused) : undefined,
        }));

        setPatients(parsedPatients);
        setTotalPatients(patientsData.total);
        setAcceptedPatients(patientsData.counts.accepted);
        setRefusedPatients(patientsData.counts.refused);
        setPendingPatients(patientsData.counts.pending);
        setError(null);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadPatients();

  }, [limit, offset, searchText, status])

  return {
    patients,
    totalPatients,
    acceptedPatients,
    refusedPatients,
    pendingPatients,
    loading,
    error,
    setPatients
  };
}
