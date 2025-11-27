import {useState} from 'react';
import type {Patient} from '../utils/types/patient.ts';
import {getErrorMessage} from '../utils/getErrorMessage.ts';

export function useUpdatePatient() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (patient: Patient) => {
    try {
      setUpdating(true);

      const response = await fetch(
        `http://localhost:8000/api/patient/${patient.gms}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            accepted: patient.accepted ?? null,
            refused: patient.refused ?? null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update patient: ${response.status}`);
      }

      const updated = await response.json();

      return updated;
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  return {
    updatePatient,
    updating,
    error,
  };
}
