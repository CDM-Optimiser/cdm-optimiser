import {useEffect, useState} from 'react';
import type {Patient} from '../utils/types/patient.ts';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function usePatients(limit: number, offset: number, searchText: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);

        const url =
          searchText.length > 0
            ? `http://localhost:8000/api/patients?limit=999999&offset=0`
            : `http://localhost:8000/api/patients?limit=${limit}&offset=${offset}`;

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
  }, [limit, offset, searchText]);

  return {
    patients,
    totalPatients,
    loading,
    error,
    setPatients,
  };
}
