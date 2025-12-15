'use client';

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
import { ReactNode } from 'react';

export function PrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // If no app ID is provided, render children without Privy (for development/testing)
  if (!appId || appId === 'your-privy-app-id-here') {
    console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy features will be disabled. Please configure it in .env.local for full functionality.');
    return <>{children}</>;
  }

  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        loginMethods: ['wallet'], // Only wallet login for DeFi app
        appearance: {
          theme: 'dark',
          accentColor: '#00FFFF',
          logo: '/logo.png',
        },
        // Configure supported wallet providers
        supportedChains: [
          {
            id: 2, // Aptos Testnet
            name: 'Aptos Testnet',
            network: 'testnet',
            nativeCurrency: {
              name: 'APT',
              symbol: 'APT',
              decimals: 8,
            },
            rpcUrls: {
              default: {
                http: ['https://fullnode.testnet.aptoslabs.com/v1'],
              },
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProviderBase>
  );
}

