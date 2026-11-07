import { useState } from 'react';
import { supabase } from '../utils/api/supabase.ts';
import type { Patient } from '../utils/types/patient.ts';
import { getErrorMessage } from '../utils/functions/getErrorMessage.ts';

export function useUpdatePatient() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (patient: Patient) => {
    try {
      setUpdating(true);
      setError(null);

      const acceptedValue = patient.accepted ? 1 : 0;
      const refusedValue = patient.refused ? 1 : 0;

      const { data: updated, error: supabaseError } = await supabase
        .from('patient_decrypted')
        .update({
          accepted: acceptedValue,
          refused: refusedValue,
        })
        .eq('id', patient.id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

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
