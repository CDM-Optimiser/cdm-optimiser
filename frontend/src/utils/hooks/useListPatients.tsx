import {useEffect, useState} from 'react';
import type {Patient} from '../types/patient.ts';

export function useListPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch('./data/samplepatients.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const [headerLine, ...lines] = csvText.trim().split('\n');
        const headers = headerLine.split(',');

        const data = lines.map((line) => {
          const values = line.split(',');
          const obj: any = {};

          headers.forEach((header, i) => {
            obj[header] = values[i];
          });
          return obj as Patient;
        });

        setPatients(data);
      });
  }, []);

  return {
    patients,
    setPatients,
  };
}
