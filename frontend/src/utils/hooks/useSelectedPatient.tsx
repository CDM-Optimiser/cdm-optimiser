import {useState} from 'react';
import type {Patient} from '../types/patient.ts';

export function useSelectedPatient(patients: Patient[]) {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const handleRowClick = (gmsNumber: string) => {
    const index = patients.findIndex(
      (patient: Patient) => patient.gms === gmsNumber
    );
    setSelectedPatient(index >= 0 ? index : null);
  };

  return {
    selectedPatient,
    setSelectedPatient,
    handleRowClick,
  };
}
