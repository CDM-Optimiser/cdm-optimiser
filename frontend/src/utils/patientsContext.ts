import {createContext} from 'react';
import type {PatientsContextType} from './types/patientsContextType.ts';

export const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined
);
