import {beforeEach, describe, expect, test, vi} from 'vitest';
import {patientRow} from '../../../test/fixtures/patients.ts';
import {
  fetchPatientCounts,
  fetchPatientsPage,
  toPatient,
  updatePatientStatus,
} from './patients-api.ts';

const mocks = vi.hoisted(() => ({rpc: vi.fn(), abortSignal: vi.fn()}));

vi.mock('../../../lib/supabase.ts', () => ({supabase: {rpc: mocks.rpc}}));

/** A stand-in for Supabase's query builder: awaitable, with abortSignal(). */
function respond(result: {data?: unknown; error?: {message: string} | null}) {
  const builder = {
    abortSignal: (signal: AbortSignal) => {
      mocks.abortSignal(signal);
      return builder;
    },
    then: (resolve: (value: unknown) => void) =>
      resolve({data: result.data ?? null, error: result.error ?? null}),
  };

  mocks.rpc.mockReturnValue(builder);
}

describe('patients API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchPatientsPage asks for one page with the search and status', async () => {
    respond({data: {total: 42, patients: [patientRow(11), patientRow(12)]}});
    const signal = new AbortController().signal;

    const page = await fetchPatientsPage(
      {search: ' patient 1 ', status: 'pending', page: 2, pageSize: 10},
      signal
    );

    expect(mocks.rpc).toHaveBeenCalledWith('list_patients', {
      p_search: 'patient 1',
      p_status: 'pending',
      p_limit: 10,
      p_offset: 10,
    });
    expect(mocks.abortSignal).toHaveBeenCalledWith(signal);
    expect(page.total).toBe(42);
    expect(page.patients.map((p) => p.name)).toEqual([
      'Test Patient 0011',
      'Test Patient 0012',
    ]);
  });

  test('fetchPatientsPage sends no search when the box is empty', async () => {
    respond({data: {total: 0, patients: []}});

    await fetchPatientsPage({
      search: '  ',
      status: 'all',
      page: 1,
      pageSize: 5,
    });

    expect(mocks.rpc).toHaveBeenCalledWith(
      'list_patients',
      expect.objectContaining({p_search: null, p_offset: 0})
    );
  });

  test('fetchPatientCounts makes a single call', async () => {
    const counts = {total: 3, accepted: 1, refused: 1, pending: 1};
    respond({data: counts});

    expect(await fetchPatientCounts()).toEqual(counts);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledWith('get_patient_counts');
  });

  test('updatePatientStatus sends the id and status, and returns the patient', async () => {
    respond({data: patientRow(7, {accepted: 1})});

    const updated = await updatePatientStatus({id: 7, status: 'accepted'});

    expect(mocks.rpc).toHaveBeenCalledWith('update_patient_status', {
      p_id: 7,
      p_status: 'accepted',
    });
    expect(updated.status).toBe('accepted');
  });

  test('errors keep the Supabase error as their cause', async () => {
    const supabaseError = {message: 'Patient not found.', code: 'P0002'};
    respond({error: supabaseError});

    const error = await updatePatientStatus({id: 1, status: 'refused'}).catch(
      (caught: unknown) => caught
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Patient not found.');
    expect((error as Error).cause).toBe(supabaseError);
  });

  test.each([
    [{accepted: 1, refused: 0}, 'accepted'],
    [{accepted: 0, refused: 1}, 'refused'],
    [{accepted: 0, refused: 0}, 'pending'],
  ] as const)('toPatient maps %o to %s', (flags, status) => {
    expect(toPatient(patientRow(1, flags)).status).toBe(status);
  });

  test('toPatient turns 0/1 condition flags into booleans', () => {
    const patient = toPatient(patientRow(1, {asthma: 1, dm: 0, cvd: null}));

    expect(patient).toMatchObject({asthma: true, dm: false, cvd: false});
    expect(patient).not.toHaveProperty('accepted');
    expect(patient).not.toHaveProperty('updated_at');
  });
});
