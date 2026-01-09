// /**
//  * useAccountBalance Hook
//  * Fetches and returns the current APT balance for the connected account
//  */

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { usePrivySafe } from './usePrivySafe';
// import { aptosClient } from '@/lib/aptosClient';
// // import { AccountAddress } from '@aptos-labs/ts-sdk';
// import { toAccountAddress } from '@/lib/privyToAptos';
// import { useActiveWallet } from '@privy-io/react-auth';

// const APT_TO_OCTAS = 100_000_000; // 1 APT = 10^8 octas
// const BALANCE_POLL_INTERVAL = 10000; // Poll every 10 seconds

// export function useAccountBalance() {
//   const { authenticated, user } = usePrivySafe();
//   const { wallet: privyWallet } = useActiveWallet();
//   const [balance, setBalance] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [aptosAddress, setAptosAddress] = useState<string | null>(null);

//   // Get Aptos wallet address - prioritize direct Aptos wallet, fallback to Privy if it's Aptos-compatible
//   useEffect(() => {
//     const getAptosAddress = async () => {
//       let address: string | null = null;

//       // First, try to get address from direct Aptos wallet (Petra, etc.)
//       if (typeof window !== 'undefined' && (window as any).aptos) {
//         try {
//           const aptosWallet = (window as any).aptos;
//           const account = await aptosWallet.account();
//           if (account?.address) {
//             const addr = account.address;
//             const cleanAddr = addr.startsWith('0x') ? addr.slice(2) : addr;
//             // Validate it's an Aptos address (60-64 hex chars)
//             if (cleanAddr.length >= 60 && cleanAddr.length <= 64) {
//               address = account.address;
//             }
//           }
//         } catch (err) {
//           // Aptos wallet not connected or error
//           console.debug('Aptos wallet not available:', err);
//         }
//       }

//       // If no direct Aptos wallet, check if Privy wallet has an Aptos address
//       if (!address && privyWallet) {
//         // Check if Privy wallet has chain-specific addresses
//         // Privy might expose Aptos address in wallet.address if it's an Aptos wallet
//         const privyAddr = privyWallet.address;
//         if (privyAddr) {
//           const cleanAddr = privyAddr.startsWith('0x') ? privyAddr.slice(2) : privyAddr;
//           // Check if it's a valid Aptos address length
//           if (cleanAddr.length >= 60 && cleanAddr.length <= 64) {
//             address = privyAddr;
//           }
//           // If it's an Ethereum address (42 chars), we can't use it for Aptos
//           // Privy embedded wallets for Aptos should return Aptos addresses, but external wallets might not
//         }
//       }

//       setAptosAddress(address);
//     };

//     getAptosAddress();

//     // Listen for wallet connection changes
//     if (typeof window !== 'undefined' && (window as any).aptos) {
//       const aptosWallet = (window as any).aptos;
      
//       const handleAccountChange = () => {
//         getAptosAddress();
//       };

//       // Listen for account changes
//       if (aptosWallet.on) {
//         aptosWallet.on('accountChanged', handleAccountChange);
//         aptosWallet.on('connect', handleAccountChange);
//         aptosWallet.on('disconnect', () => {
//           setAptosAddress(null);
//         });
//       }
      
//       // Poll for wallet connection if events aren't available
//       const pollInterval = setInterval(() => {
//         getAptosAddress();
//       }, 2000);
      
//       return () => {
//         if (aptosWallet.off) {
//           aptosWallet.off('accountChanged', handleAccountChange);
//           aptosWallet.off('connect', handleAccountChange);
//           aptosWallet.off('disconnect', () => {});
//         }
//         clearInterval(pollInterval);
//       };
//     }
//   }, [privyWallet]);

//   // Fetch balance
//   const fetchBalance = useCallback(async () => {
//     if (!aptosAddress) {
//       setBalance(null);
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Convert string address to AccountAddress
//       const accountAddress = toAccountAddress(aptosAddress);
      
//       // Get account resources to find the coin store
//       const accountResources = await aptosClient.getAccountResources({
//         accountAddress: accountAddress,
//       });

//       // Find the AptosCoin resource
//       const coinStoreResource = accountResources.find(
//         (resource) => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
//       );

//       if (coinStoreResource && coinStoreResource.data) {
//         const coinData = coinStoreResource.data as { coin: { value: string } };
//         const balanceInOctas = BigInt(coinData.coin.value);
//         const balanceInAPT = Number(balanceInOctas) / APT_TO_OCTAS;
//         setBalance(balanceInAPT);
//       } else {
//         // No coin store found, balance is 0
//         setBalance(0);
//       }
//     } catch (err: any) {
//       console.error('Error fetching balance:', err);
//       setError(err.message || 'Failed to fetch balance');
//       setBalance(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [aptosAddress]);

//   // Initial fetch and polling
//   useEffect(() => {
//     fetchBalance();

//     // Set up polling
//     const interval = setInterval(fetchBalance, BALANCE_POLL_INTERVAL);

//     return () => clearInterval(interval);
//   }, [fetchBalance]);

//   return {
//     balance,
//     isLoading,
//     error,
//     aptosAddress,
//     refetch: fetchBalance,
//   };
// }









'use client';

import { useState, useEffect, useCallback } from 'react';
import { AptosClient } from 'aptos';
import { useUnifiedWallet } from './useUnifiedWallet';

// Movement Testnet RPC Endpoint
const MOVEMENT_RPC = 'https://aptos.testnet.m1.movementlabs.xyz/v1';
const client = new AptosClient(MOVEMENT_RPC);

export function useAccountBalance() {
  const { address, isConnected } = useUnifiedWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch the CoinStore resource for AptosCoin (MOVE on Movement)
      const resource = await client.getAccountResource(
        address.toString(),
        "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      
      // Data is returned in Octas (10^8)
      const amount = (resource.data as any).coin.value;
      setBalance(Number(amount) / 100_000_000);
    } catch (error: any) {
      // If the account resource is not found (404), it means the balance is 0
      if (error.status === 404 || error.message?.includes('not found')) {
        setBalance(0);
      } else {
        console.error("Error fetching balance:", error);
        setBalance(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchBalance();
    
    // Refresh balance every 10 seconds to keep UI updated
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, isLoading, aptosAddress: address, error: '', refresh: fetchBalance };
}
