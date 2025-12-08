'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { Account } from '@aptos-labs/ts-sdk';
import { aptosClient } from '@/lib/aptosClient';

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [aptosAccount, setAptosAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Aptos account from Privy wallet when authenticated
    if (authenticated && user?.wallet) {
      // Note: Privy wallet integration with Aptos requires additional setup
      // This is a placeholder for the wallet connection logic
      console.log('User authenticated:', user);
    }
  }, [authenticated, user]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          AgentPay Stream
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Decentralized micro-streaming payments on Movement L1
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!authenticated ? (
            <div className="text-center">
              <p className="mb-4 text-gray-700">
                Connect your wallet to start streaming payments
              </p>
              <button
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Connected as:</p>
                  <p className="font-mono text-sm">
                    {user?.wallet?.address || user?.id || 'Unknown'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Disconnect
                </button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h2 className="text-2xl font-semibold mb-4">Stream Management</h2>
                <p className="text-gray-600 mb-4">
                  Contract functionality will be available after deployment.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">
                    Contract Address: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not deployed'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
