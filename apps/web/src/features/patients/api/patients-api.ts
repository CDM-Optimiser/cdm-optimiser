import {supabase} from '../../../lib/supabase.ts';
import type {Patient, PatientStatus, StatusFilter} from '../model/patient.ts';

// The only module that talks to Supabase about patients. The database
// functions it calls check the caller's practice; see the runbook.

export interface PatientsPageParams {
  /** A GMS number, or part of a name or date of birth. */
  search: string;
  status: StatusFilter;
  /** 1-based. */
  page: number;
  pageSize: number;
}

export interface PatientsPage {
  patients: Patient[];
  /** Every match, across all pages. */
  total: number;
}

export interface PatientCounts {
  total: number;
  accepted: number;
  refused: number;
  pending: number;
}

/** A patient as the database functions return it. */
export interface PatientRow {
  id: number;
  name: string;
  dob: string;
  gms: string;
  gender: string | null;
  address: string | null;
  home_phone: string | null;
  mobile_phone: string | null;
  email: string | null;
  regdate: string | null;
  type: string | null;
  hcp: string | null;
  expdate: string | null;
  asthma: number | null;
  dm: number | null;
  cvd: number | null;
  copd: number | null;
  cdm_condition_count: number | null;
  potential_income: number | null;
  accepted: number;
  refused: number;
  updated_at: string;
}

interface SupabaseError {
  message: string;
}

/** Turns a Supabase error into an Error, keeping the original as `cause`. */
function toError(error: SupabaseError): Error {
  return new Error(error.message, {cause: error});
}

export function toPatient(row: PatientRow): Patient {
  // The database stores flags as 0/1; the app uses booleans and one status.
  const status: PatientStatus =
    row.accepted === 1 ? 'accepted' : row.refused === 1 ? 'refused' : 'pending';

  return {
    id: row.id,
    name: row.name,
    dob: row.dob,
    gms: row.gms,
    gender: row.gender,
    address: row.address,
    home_phone: row.home_phone,
    mobile_phone: row.mobile_phone,
    email: row.email,
    regdate: row.regdate,
    type: row.type,
    hcp: row.hcp,
    expdate: row.expdate,
    asthma: row.asthma === 1,
    dm: row.dm === 1,
    cvd: row.cvd === 1,
    copd: row.copd === 1,
    cdm_condition_count: row.cdm_condition_count,
    potential_income: row.potential_income,
    status,
  };
}

// RPCs are sent as POST, so the search (which can be a patient's name) is in
// the request body, never in a URL that could end up in logs.

export async function fetchPatientsPage(
  {search, status, page, pageSize}: PatientsPageParams,
  signal?: AbortSignal
): Promise<PatientsPage> {
  let request = supabase.rpc('list_patients', {
    p_search: search.trim() || null,
    p_status: status,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize,
  });

  if (signal) request = request.abortSignal(signal);

  const {data, error} = await request;

  if (error) throw toError(error);

  const result = data as {total: number; patients: PatientRow[]};

  return {total: result.total, patients: result.patients.map(toPatient)};
}

export async function fetchPatientCounts(
  signal?: AbortSignal
): Promise<PatientCounts> {
  let request = supabase.rpc('get_patient_counts');

  if (signal) request = request.abortSignal(signal);

  const {data, error} = await request;

  if (error) throw toError(error);

  return data as PatientCounts;
}

export async function updatePatientStatus({
  id,
  status,
}: {
  id: number;
  status: PatientStatus;
}): Promise<Patient> {
  const {data, error} = await supabase.rpc('update_patient_status', {
    p_id: id,
    p_status: status,
  });

  if (error) throw toError(error);

  return toPatient(data as PatientRow);
}
