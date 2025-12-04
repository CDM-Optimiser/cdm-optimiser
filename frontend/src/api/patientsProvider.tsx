import {useCallback, useEffect, useState} from 'react';
import {supabase} from '../utils/supabase.ts';
import type {Patient} from '../utils/types/patient.ts';
import type {Status} from '../utils/types/statusType.ts';
import {getErrorMessage} from '../utils/getErrorMessage.ts';
import {PatientsContext} from '../utils/patientsContext.ts';
import {useAuth} from '../utils/authProvider.tsx';

export const PatientsProvider = ({children}: {children: React.ReactNode}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedPatients, setAcceptedPatients] = useState(0);
  const [refusedPatients, setRefusedPatients] = useState(0);
  const [pendingPatients, setPendingPatients] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {user} = useAuth();

  const MIN_LOAD_TIME_MS = 500;

  const loadPatients = useCallback(
    async (
      limit?: number,
      offset?: number,
      search?: string,
      status: Status = 'all',
      isBackgroundRefresh: boolean = false
    ) => {
      if (!user) return;

      if (!isBackgroundRefresh && initialLoading) {
        setInitialLoading(true);
      } else if (
        !isBackgroundRefresh &&
        (limit !== undefined ||
          offset !== undefined ||
          search !== undefined ||
          status !== 'all')
      ) {
        setFetching(true);
      }

      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, MIN_LOAD_TIME_MS)
      );

      const totalQuery = supabase
        .from('patient')
        .select('id', {count: 'exact'});
      const acceptedQuery = supabase
        .from('patient')
        .select('id', {count: 'exact'})
        .eq('accepted', 1);
      const refusedQuery = supabase
        .from('patient')
        .select('id', {count: 'exact'})
        .eq('refused', 1);

      const countQueriesPromise = Promise.all([
        totalQuery,
        acceptedQuery,
        refusedQuery,
      ]);

      try {
        const [
          {count: totalCount, error: totalError},
          {count: acceptedCount, error: acceptedError},
          {count: refusedCount, error: refusedError},
        ] = await countQueriesPromise;

        if (totalError || acceptedError || refusedError) {
          setError(
            getErrorMessage(totalError || acceptedError || refusedError)
          );
        }

        const safeTotalCount = totalCount ?? 0;
        const safeAcceptedCount = acceptedCount ?? 0;
        const safeRefusedCount = refusedCount ?? 0;

        const calculatedPending = Math.max(
          0,
          safeTotalCount - safeAcceptedCount - safeRefusedCount
        );

        setTotalPatients(safeTotalCount);
        setAcceptedPatients(safeAcceptedCount);
        setRefusedPatients(safeRefusedCount);
        setPendingPatients(calculatedPending);
      } catch (error) {
        setError(getErrorMessage(error));
      }

      try {
        let rpc = supabase
          .rpc('search_patients', {
            search_term: search || '',
            p_status: status,
          })
          .select('*, total_count')
          .order('id', {ascending: true});

        if (limit != null && offset != null)
          rpc = rpc.range(offset, offset + limit - 1);

        const {data, error} = await rpc;

        if (error) {
          setError(getErrorMessage(error));
          setPatients([]);
          setTotalPatients(0);

          return;
        }

        const fetchedPatients = data ?? [];

        const totalFilteredCount =
          fetchedPatients.length > 0
            ? (fetchedPatients[0] as {total_count: number}).total_count
            : 0;

        const cleanedPatients = fetchedPatients.map((patient: Patient) => {
          const {total_count, ...rest} = patient as Patient & {
            total_count: number;
          };
          return rest as Patient;
        });

        setPatients(cleanedPatients);
        setTotalPatients(totalFilteredCount);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        await delayPromise;

        setInitialLoading(false);
        setFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!user) return;

    const patientChannel = supabase
      .channel('patient-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient',
        },
        async (payload) => {
          console.log('patient channel payload:', payload);
          await loadPatients(undefined, undefined, undefined, 'all', true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(patientChannel);
    };
  }, [user, loadPatients]);

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [loadPatients]);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        totalPatients,
        acceptedPatients,
        refusedPatients,
        pendingPatients,
        loading: initialLoading || fetching,
        error,
        setPatients,
        loadPatients,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};
