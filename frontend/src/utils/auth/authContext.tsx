import {createContext} from 'react';
import type {AuthContextType} from '../types/authContext.ts';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
