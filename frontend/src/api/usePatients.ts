import {useEffect, useState} from 'react';
import type {Patient} from '../utils/types/patient.ts';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function usePatients(
  limit: number,
  offset: number,
  searchText: string,
  currentPage: number
) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (searchText) params.append('search', searchText);
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const queryParams = params.toString();

        const url = `http://localhost:8000/api/patients?${queryParams}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const patientsData = await response.json();

        const parsedPatients = patientsData.data.map((patient: Patient) => ({
          ...patient,
          asthma: Boolean(patient.asthma),
          dm: Boolean(patient.dm),
          cvd: Boolean(patient.cvd),
          copd: Boolean(patient.copd),
          accepted:
            patient.accepted !== undefined
              ? Boolean(patient.accepted)
              : undefined,
          refused:
            patient.refused !== undefined
              ? Boolean(patient.refused)
              : undefined,
        }));

        setPatients(parsedPatients);
        setTotalPatients(patientsData.total);
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, [limit, offset, searchText, currentPage]);

  return {
    patients,
    totalPatients,
    loading,
    error,
    setPatients,
  };
}
