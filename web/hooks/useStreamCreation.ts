/**
 * React hook for creating payment streams
 * Handles transaction submission and state management
 */

import { useState, useCallback } from 'react';
import { usePrivySafe } from './usePrivySafe';
import { Account, AccountAddress, U64 } from '@aptos-labs/ts-sdk';
import { createStream } from '@/lib/AgentPayStreamClient';
import { toAccountAddress, isValidAptosAddress } from '@/lib/privyToAptos';
import { CONTRACT_ADDRESS } from '@/lib/aptosClient';

export interface StreamCreationParams {
  recipientAddress: string;
  totalAmount: number; // in APT (will be converted to octas)
  flowRate: number; // tokens per second
}

export interface StreamCreationResult {
  success: boolean;
  transactionHash?: string;
  streamId?: string;
  error?: string;
}

const APT_TO_OCTAS = 100_000_000; // 1 APT = 10^8 octas

export function useStreamCreation() {
  const { authenticated, user } = usePrivySafe();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const createStreamTransaction = useCallback(
    async (params: StreamCreationParams): Promise<StreamCreationResult> => {
      // Validation
      if (!authenticated) {
        const errorMsg = 'Please connect your wallet first';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (!CONTRACT_ADDRESS) {
        const errorMsg = 'Contract not deployed. Please set NEXT_PUBLIC_CONTRACT_ADDRESS';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (!isValidAptosAddress(params.recipientAddress)) {
        const errorMsg = 'Invalid recipient address. Please enter a valid Aptos address.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (params.totalAmount <= 0) {
        const errorMsg = 'Total amount must be greater than 0';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (params.flowRate <= 0) {
        const errorMsg = 'Flow rate must be greater than 0';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);
      setTransactionHash(null);

      try {
        // Convert amount to octas (smallest unit)
        const amountInOctas = BigInt(Math.floor(params.totalAmount * APT_TO_OCTAS));
        
        // Calculate duration in seconds: duration = amount / flow_rate
        // flow_rate is in tokens/second, so we need to convert it to octas/second
        const flowRateInOctas = BigInt(Math.floor(params.flowRate * APT_TO_OCTAS));
        const durationSeconds = amountInOctas / flowRateInOctas;

        if (durationSeconds === 0n) {
          throw new Error('Flow rate is too high. Please reduce the flow rate.');
        }

        // Convert recipient address
        const recipient = toAccountAddress(params.recipientAddress);

        // Get Aptos account from wallet
        // For MVP, we'll use window.aptos if available (Petra wallet or other Aptos wallets)
        if (typeof window === 'undefined' || !(window as any).aptos) {
          throw new Error(
            'Aptos wallet not found. Please install Petra wallet (https://petra.app) or another Aptos-compatible wallet extension.'
          );
        }

        // Use Petra wallet or other Aptos wallet extension
        const wallet = (window as any).aptos;
        
        // Check if already connected, if not, connect
        let accountAddress: string;
        try {
          const accounts = await wallet.account();
          accountAddress = accounts.address;
        } catch {
          // Not connected, try to connect
          const connectResult = await wallet.connect();
          if (!connectResult || !connectResult.address) {
            throw new Error('Failed to connect Aptos wallet. Please try again.');
          }
          accountAddress = connectResult.address;
        }
        
        // Import aptosClient
        const { aptosClient } = await import('@/lib/aptosClient');
        
        // Build the transaction
        const transaction = await aptosClient.transaction.build.simple({
          sender: accountAddress,
          data: {
            function: `${CONTRACT_ADDRESS}::agent_pay_stream::create_stream`,
            functionArguments: [recipient.toString(), amountInOctas.toString(), durationSeconds.toString()],
          },
        });
        
        // Sign and submit using the wallet
        const response = await wallet.signAndSubmitTransaction(transaction);
        
        // Wait for transaction
        await aptosClient.waitForTransaction({ transactionHash: response.hash });
        
        setTransactionHash(response.hash);
        return {
          success: true,
          transactionHash: response.hash,
        };

      } catch (err: any) {
        const errorMsg = err.message || 'Failed to create stream. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [authenticated, user]
  );

  const reset = useCallback(() => {
    setError(null);
    setTransactionHash(null);
  }, []);

  return {
    createStreamTransaction,
    isLoading,
    error,
    transactionHash,
    reset,
    isAuthenticated: authenticated,
  };
}

