/**
 * React hook for stream actions (withdraw and cancel)
 */

'use client';

import { useState, useCallback } from 'react';
import { usePrivySafe } from './usePrivySafe';
// import { AccountAddress } from '@aptos-labs/ts-sdk';
import { CONTRACT_ADDRESS } from '@/lib/aptosClient';
import { toAccountAddress } from '@/lib/privyToAptos';

export interface StreamActionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export function useStreamActions() {
  const { authenticated } = usePrivySafe();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  /**
   * Withdraw funds from a stream
   */
  const handleWithdraw = useCallback(
    async (senderAddress: string, streamId: string): Promise<StreamActionResult> => {
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

      if (typeof window === 'undefined' || !(window as any).aptos) {
        const errorMsg = 'Aptos wallet not found. Please install Petra wallet.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);
      setTransactionHash(null);

      try {
        const wallet = (window as any).aptos;
        
        // Check if connected
        let accountAddress: string;
        try {
          const account = await wallet.account();
          accountAddress = account.address;
        } catch {
          const connectResult = await wallet.connect();
          if (!connectResult || !connectResult.address) {
            throw new Error('Failed to connect Aptos wallet');
          }
          accountAddress = connectResult.address;
        }

        const { aptosClient } = await import('@/lib/aptosClient');
        const sender = toAccountAddress(senderAddress);

        // Build transaction
        const transaction = await aptosClient.transaction.build.simple({
          sender: accountAddress,
          data: {
            function: `${CONTRACT_ADDRESS}::agent_pay_stream::withdraw_from_stream`,
            functionArguments: [sender.toString(), streamId],
          },
        });

        // Sign and submit
        const response = await wallet.signAndSubmitTransaction(transaction);
        
        // Wait for transaction
        await aptosClient.waitForTransaction({ transactionHash: response.hash });

        setTransactionHash(response.hash);
        return {
          success: true,
          transactionHash: response.hash,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to withdraw from stream';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [authenticated]
  );

  /**
   * Cancel a stream
   */
  const handleCancel = useCallback(
    async (streamId: string): Promise<StreamActionResult> => {
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

      if (typeof window === 'undefined' || !(window as any).aptos) {
        const errorMsg = 'Aptos wallet not found. Please install Petra wallet.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);
      setTransactionHash(null);

      try {
        const wallet = (window as any).aptos;
        
        // Check if connected
        let accountAddress: string;
        try {
          const account = await wallet.account();
          accountAddress = account.address;
        } catch {
          const connectResult = await wallet.connect();
          if (!connectResult || !connectResult.address) {
            throw new Error('Failed to connect Aptos wallet');
          }
          accountAddress = connectResult.address;
        }

        const { aptosClient } = await import('@/lib/aptosClient');

        // Build transaction
        const transaction = await aptosClient.transaction.build.simple({
          sender: accountAddress,
          data: {
            function: `${CONTRACT_ADDRESS}::agent_pay_stream::cancel_stream`,
            functionArguments: [streamId],
          },
        });

        // Sign and submit
        const response = await wallet.signAndSubmitTransaction(transaction);
        
        // Wait for transaction
        await aptosClient.waitForTransaction({ transactionHash: response.hash });

        setTransactionHash(response.hash);
        return {
          success: true,
          transactionHash: response.hash,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to cancel stream';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [authenticated]
  );

  const reset = useCallback(() => {
    setError(null);
    setTransactionHash(null);
  }, []);

  return {
    handleWithdraw,
    handleCancel,
    isLoading,
    error,
    transactionHash,
    reset,
  };
}

