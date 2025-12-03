import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase.ts';
import type { Patient } from '../utils/types/patient.ts';
import type { Status } from '../utils/types/statusType.ts';
import { getErrorMessage } from '../utils/getErrorMessage.ts';
import { PatientsContext } from '../utils/patientsContext.ts';
import { useAuth } from '../utils/authProvider.tsx';

export const PatientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [acceptedPatients, setAcceptedPatients] = useState(0);
  const [refusedPatients, setRefusedPatients] = useState(0);
  const [pendingPatients, setPendingPatients] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

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
        .select('id', { count: 'exact' });
      const acceptedQuery = supabase
        .from('patient')
        .select('id', { count: 'exact' })
        .eq('accepted', 1);
      const refusedQuery = supabase
        .from('patient')
        .select('id', { count: 'exact' })
        .eq('refused', 1);

      const countQueriesPromise = Promise.all([
        totalQuery,
        acceptedQuery,
        refusedQuery,
      ]);

      try {
        const [
          { count: totalCount, error: totalError },
          { count: acceptedCount, error: acceptedError },
          { count: refusedCount, error: refusedError },
        ] = await countQueriesPromise;

        if (totalError || acceptedError || refusedError) {
          throw new Error(
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
        let query = supabase.from('patient').select('*', { count: 'exact' });

        if (status === 'accepted') query = query.eq('accepted', 1);
        else if (status === 'refused') query = query.eq('refused', 1);
        else if (status === 'pending')
          query = query.eq('accepted', 0).eq('refused', 0);
        if (search) query = query.ilike('name', `%${search}%`);

        query = query.order('id', { ascending: true });

        if (limit != null && offset != null)
          query = query.range(offset, offset + limit - 1);

        const { data, error } = await query;

        if (error) {
          setError(getErrorMessage(error));
          setPatients([]);
          return;
        }

        setPatients(data ?? []);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        await delayPromise;

        setInitialLoading(false);
        setFetching(false);
      }
    },
    [user]
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
        async () => {
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
  }, [user, loadPatients]);

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
