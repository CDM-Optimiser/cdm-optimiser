import {useState} from 'react';
import type {Patient} from '../types/patient.ts';

export function useSelectedPatient() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return {
    selectedPatient,
    setSelectedPatient,
    handleRowClick,
  };
}
