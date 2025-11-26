import {useEffect, useState} from 'react';
import type {Patient} from '../utils/types/patient.ts';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch('http://localhost:8000/api/patients');

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        const parsedPatients = data.map((patient: Patient) => ({
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
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    setPatients,
  };
}
