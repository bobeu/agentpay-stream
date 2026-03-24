'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Aptos } from '@aptos-labs/ts-sdk';
import { aptosClient, CONTRACT_ADDRESS, getCurrentMovementNetwork } from '@/lib/aptosClient';

interface AptosContextType {
  aptosClient: Aptos;
  moduleAddress: string;
  networkInfo: ReturnType<typeof getCurrentMovementNetwork>;
}

const AptosContext = createContext<AptosContextType | undefined>(undefined);

export const AptosProvider = ({ children }: { children: ReactNode }) => {
  const networkInfo = getCurrentMovementNetwork();

  return (
    <AptosContext.Provider 
      value={{ 
        aptosClient, 
        moduleAddress: CONTRACT_ADDRESS, 
        networkInfo 
      }}
    >
      {children}
    </AptosContext.Provider>
  );
};

export const useAptosContext = () => {
  const context = useContext(AptosContext);
  if (!context) {
    throw new Error('useAptosContext must be used within an AptosProvider');
  }
  return context;
};