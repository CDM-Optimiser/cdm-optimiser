import {useCallback, useEffect, useState} from 'react';
import {BACKEND_URL} from '../env.ts';
import type {Patient} from '../utils/types/patient.ts';
import type {Status} from '../utils/types/statusType.ts';
import {getErrorMessage} from '../utils/getErrorMessage.ts';
import {PatientsContext} from '../utils/patientsContext.ts';
import {fetchWithRetry} from '../utils/fetchWithRetry.ts';

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

        const url = `${BACKEND_URL}/api/patients?${params.toString()}`;

        const response = await fetchWithRetry(url);

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const patientsData = await response.json();
        const parsedPatients = patientsData.data.map((patient: Patient) => ({
          ...patient,
          asthma: Boolean(patient.asthma),
          dm: Boolean(patient.dm),
          cvd: Boolean(patient.cvd),
          copd: Boolean(patient.copd),
          accepted:
            patient.accepted != null ? Boolean(patient.accepted) : undefined,
          refused:
            patient.refused != null ? Boolean(patient.refused) : undefined,
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
    },
    []
  );

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    setTotalPatients(patients.length);
    setAcceptedPatients(
      patients.filter((patient) => patient.accepted === true).length
    );
    setRefusedPatients(
      patients.filter((patient) => patient.refused === true).length
    );
    setPendingPatients(
      patients.filter(
        (patient) => !(patient.accepted === true) && !(patient.refused === true)
      ).length
    );
  }, [patients]);

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
