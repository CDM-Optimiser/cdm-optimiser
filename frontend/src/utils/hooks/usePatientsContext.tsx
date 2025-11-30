import {useContext} from 'react';
import {PatientsContext} from '../patientsContext.ts';

export const usePatientsContext = () => {
  const context = useContext(PatientsContext);

  if (!context)
    throw new Error('usePatientsContext must be used within PatientsProvider');

  return context;
};
