import {createContext, useContext} from 'react';
import {usePatients} from '../../api/usePatients.ts';

type PatientsContextType = ReturnType<typeof usePatients>;

const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined
);

export const PatientsProvider = ({children}: {children: React.ReactNode}) => {
  const patientsData = usePatients(1000, 0, '', 'all');

  return (
    <PatientsContext.Provider value={patientsData}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatientsContext = () => {
  const context = useContext(PatientsContext);

  if (!context)
    throw new Error('usePatientsContext must be used within PatientsProvider');

  return context;
};
