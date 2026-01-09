/**
 * React hook for creating payment streams
 * Handles transaction submission and state management
 */

// import { usePrivySafe } from './usePrivySafe';
// import { Account, AccountAddress, U64 } from '@aptos-labs/ts-sdk';
// import { createStream } from '@/lib/AgentPayStreamClient';
// import { useState, useCallback } from 'react';
// import { toAccountAddress, isValidAptosAddress } from '@/lib/privyToAptos';
// import { CONTRACT_ADDRESS } from '@/lib/aptosClient';
// import { usePrivy } from '@privy-io/react-auth';

// export interface StreamCreationParams {
//   recipientAddress: string;
//   totalAmount: number; // in APT (will be converted to octas)
//   flowRate: number; // tokens per second
// }

// export interface StreamCreationResult {
//   success: boolean;
//   transactionHash?: string;
//   streamId?: string;
//   error?: string;
// }

// const APT_TO_OCTAS = 100_000_000; // 1 APT = 10^8 octas

// export function useStreamCreation() {
//   const { authenticated, user } = usePrivy();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [transactionHash, setTransactionHash] = useState<string | null>(null);

//   const createStreamTransaction = useCallback(
//     async (params: StreamCreationParams): Promise<StreamCreationResult> => {
//       // Validation
//       if (!authenticated) {
//         const errorMsg = 'Please connect your wallet first';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }

//       if (!CONTRACT_ADDRESS) {
//         const errorMsg = 'Contract not deployed. Please set NEXT_PUBLIC_CONTRACT_ADDRESS';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }

//       if (!isValidAptosAddress(params.recipientAddress)) {
//         const errorMsg = 'Invalid recipient address. Please enter a valid Aptos address.';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }

//       if (params.totalAmount <= 0) {
//         const errorMsg = 'Total amount must be greater than 0';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }

//       if (params.flowRate <= 0) {
//         const errorMsg = 'Flow rate must be greater than 0';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       }

//       setIsLoading(true);
//       setError(null);
//       setTransactionHash(null);

//       try {
//         // Convert amount to octas (smallest unit)
//         const amountInOctas = BigInt(Math.floor(params.totalAmount * APT_TO_OCTAS));
        
//         // Calculate duration in seconds: duration = amount / flow_rate
//         // flow_rate is in tokens/second, so we need to convert it to octas/second
//         const flowRateInOctas = BigInt(Math.floor(params.flowRate * APT_TO_OCTAS));
//         const durationSeconds = amountInOctas / flowRateInOctas;

//         if (durationSeconds === 0n) {
//           throw new Error('Flow rate is too high. Please reduce the flow rate.');
//         }

//         // Convert recipient address
//         const recipient = toAccountAddress(params.recipientAddress);

//         // Get Aptos account from wallet
//         // For MVP, we'll use window.aptos if available (Petra wallet or other Aptos wallets)
//         if (typeof window === 'undefined' || !(window as any).aptos) {
//           throw new Error(
//             'Aptos wallet not found. Please install Petra wallet (https://petra.app) or another Aptos-compatible wallet extension.'
//           );
//         }

//         // Use Petra wallet or other Aptos wallet extension
//         const wallet = (window as any).aptos;
        
//         // Check if already connected, if not, connect
//         let accountAddress: string;
//         try {
//           const accounts = await wallet.account();
//           accountAddress = accounts.address;
//         } catch {
//           // Not connected, try to connect
//           const connectResult = await wallet.connect();
//           if (!connectResult || !connectResult.address) {
//             throw new Error('Failed to connect Aptos wallet. Please try again.');
//           }
//           accountAddress = connectResult.address;
//         }
        
//         // Import aptosClient
//         const { aptosClient } = await import('@/lib/aptosClient');
        
//         // Build the transaction
//         console.log("recipient.toString()", recipient.toString());
//         console.log("amountInOctas.toString()", amountInOctas.toString());
//         console.log("durationSeconds.toString()", durationSeconds.toString());

//         const transaction = await aptosClient.transaction.build.simple({
//           sender: accountAddress,
//           data: {
//             function: `${CONTRACT_ADDRESS}::agent_pay_stream::create_stream`,
//             functionArguments: [recipient.toString(), amountInOctas.toString(), durationSeconds.toString()],
//           },
//         });
        
//         // Sign and submit using the wallet
//         const response = await wallet.signAndSubmitTransaction(transaction);
        
//         // Wait for transaction
//         await aptosClient.waitForTransaction({ transactionHash: response.hash });
        
//         setTransactionHash(response.hash);
//         return {
//           success: true,
//           transactionHash: response.hash,
//         };

//       } catch (err: any) {
//         const errorMsg = err.message || 'Failed to create stream. Please try again.';
//         setError(errorMsg);
//         return { success: false, error: errorMsg };
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [authenticated, user]
//   );

//   const reset = useCallback(() => {
//     setError(null);
//     setTransactionHash(null);
//   }, []);

//   return {
//     createStreamTransaction,
//     isLoading,
//     error,
//     transactionHash,
//     reset,
//     isAuthenticated: authenticated,
//   };
// }






// 0x616d8a6ac2814b25895af1e111eccc62b8ce3fdf421b7b904f4e6cb8f83d4ace
// import { useUnifiedWallet } from './useUnifiedWallet';
// import { usePrivy } from '@privy-io/react-auth';
// import { useWallet } from "@aptos-labs/wallet-adapter-react";

// // Inside your useStreamCreation hook:
// const { walletType, address } = useUnifiedWallet();
// const { signAndSubmitTransaction } = useWallet(); // For extensions
// const { signAndSubmitTransaction: privySign } = usePrivy(); // Pseudo-code: adjust based on your Privy version

// const createStream = async (payload: any) => {
//   const transaction = {
//     data: {
//       function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::stream_manager::create_stream`,
//       typeArguments: [],
//       functionArguments: [payload.recipient, payload.amount, payload.rate],
//     }
//   };

//   if (walletType === 'extension') {
//     return await signAndSubmitTransaction(transaction);
//   } else {
//     // Handle Privy signing (referencing your specific Privy config)
//     // Most Privy Aptos implementations use the 'aptos' provider from Privy
//   }
// };







///////////////////////////////////////////////////////////////////////////////////

'use client';

import { useState, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CONTRACT_ADDRESS, aptosClient } from '@/lib/aptosClient';
import toast from 'react-hot-toast';
// import { AccountAddress } from "@aptos-labs/ts-sdk";

export interface StreamCreationParams {
  recipientAddress: string;
  totalAmount: number; // in MOVE/APT
  flowRate: number;    // tokens per second
}

export interface StreamCreationResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

const MOVE_TO_OCTAS = 100_000_000; // 1 MOVE = 10^8 octas

export function useStreamCreation() {
  const { connected, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // const createStreamTransaction = useCallback(
  //   async (params: StreamCreationParams): Promise<StreamCreationResult> => {
  //     // 1. Initial Validations
  //     if (!connected) {
  //       const msg = 'Wallet not connected';
  //       setError(msg);
  //       return { success: false, error: msg };
  //     }

  //     if (!CONTRACT_ADDRESS) {
  //       const msg = 'Contract address not configured';
  //       setError(msg);
  //       return { success: false, error: msg };
  //     }

  //     setIsLoading(true);
  //     setError(null);
  //     setTransactionHash(null);

  //     try {
  //       // 2. Calculation Logic
  //       const amountInOctas = Math.floor(params.totalAmount * MOVE_TO_OCTAS);
  //       const flowRateInOctas = Math.floor(params.flowRate * MOVE_TO_OCTAS);
        
  //       // duration = total_amount / flow_rate
  //       const durationSeconds = Math.floor(amountInOctas / flowRateInOctas);

  //       if (durationSeconds <= 0) {
  //         throw new Error('Flow rate is too high for this amount.');
  //       }

  //       // 3. Build the Transaction Payload
  //       // We use the Entry Function payload format compatible with the Wallet Adapter
  //       const payload = {
  //         data: {
  //           function: `${CONTRACT_ADDRESS}::agent_pay_stream::create_stream` as `${string}::${string}::${string}`,
  //           functionArguments: [
  //             params.recipientAddress, // Recipient address string
  //             amountInOctas.toString(), // Amount as string/uint64
  //             durationSeconds.toString() // Duration as string/uint64
  //           ],
  //         },
  //       };

  //       // 4. Sign and Submit
  //       // The wallet adapter handles the signing UI and submission to the Movement network
  //       const response = await signAndSubmitTransaction(payload);

  //       // 5. Wait for Transaction Confirmation
  //       // Using the aptosClient (Movement RPC) configured in your libs
  //       await aptosClient.waitForTransaction({ transactionHash: response.hash });

  //       setTransactionHash(response.hash);
  //       return {
  //         success: true,
  //         transactionHash: response.hash,
  //       };

  //     } catch (err: any) {
  //       console.error("Stream Creation Error:", err);
  //       const errorMsg = err.message || 'Transaction failed or was cancelled';
  //       setError(errorMsg);
  //       return { success: false, error: errorMsg };
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [connected, signAndSubmitTransaction]
  // );

  const createStreamTransaction = useCallback(
    async (params: any) => {
      if (!connected) return toast.error("Please connect your wallet first!");

      setIsLoading(true);
      
      // Create a promise for the toast to track
      const transactionPromise = (async () => {
        // 1. Setup Data
        const amountInOctas = Math.floor(params.totalAmount * 100_000_000);
        const flowRateInOctas = Math.floor(params.flowRate * 100_000_000);
        const durationSeconds = Math.floor(amountInOctas / flowRateInOctas);

        const payload = {
          data: {
            function: `${CONTRACT_ADDRESS}::agent_pay_stream::create_stream` as `${string}::${string}::${string}`,
            functionArguments: [params.recipientAddress, amountInOctas.toString(), durationSeconds.toString()],
          },
        };

        // 2. Request Signature (This triggers the wallet popup)
        const response = await signAndSubmitTransaction(payload);
        
        // 3. Wait for confirmation (The 'Loading' state continues here)
        await aptosClient.waitForTransaction({ transactionHash: response.hash });
        
        setTransactionHash(response.hash);
        return response.hash;
      })();

      // Trigger the toast notification
      toast.promise(transactionPromise, {
        loading: 'Confirming transaction on Movement...',
        success: (hash) => `Stream Created! Hash: ${hash.slice(0, 6)}...`,
        error: (err) => {
          console.log("Error occured", err);
          return err.message || 'Transaction failed';
        },
      });

      try {
        await transactionPromise;
        setIsLoading(false);
        return { success: true };
      } catch (e) {
        setIsLoading(false);
        return { success: false };
      }
    },
    [connected, signAndSubmitTransaction]
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
    isConnected: connected,
  };
}