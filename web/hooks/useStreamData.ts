/**
 * hooks/useStreamData.ts
 * Fetches and formats stream data from the Movement blockchain
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAptosContext } from '@/context/AptosContext';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';

export interface StreamData {
  stream_id: string;
  sender: string;
  recipient: string;
  amount: string;
  start_time: string;
  end_time: string;
  coin_type: string;
  isActive: boolean;
  progress: number;
  accruedFunds: number;
  availableToWithdraw: number;
  timeRemaining: number;
}

export const useStreamData = () => {
  const { aptosClient, moduleAddress } = useAptosContext();
  const { address, isConnected } = useUnifiedWallet();
  
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    if (!isConnected || !address || !moduleAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      // SDK V2 View Function Syntax Fix
      const result = await aptosClient.view({
        payload: {
          function: `${moduleAddress}::agent_pay_stream::get_user_streams`,
          typeArguments: [],
          functionArguments: [address.toString()],
        },
      });

      // result[0] typically contains the vector/array returned from Move
      const rawStreams = (result[0] as any[]) || [];
      
      const formattedStreams: StreamData[] = rawStreams.map((s: any) => {
        const now = Math.floor(Date.now() / 1000);
        const start = parseInt(s.start_time);
        const end = parseInt(s.end_time);
        const total = parseInt(s.amount);
        const withdrawn = parseInt(s.withdrawn || '0');
        
        // Duration and Elapsed logic
        const duration = end - start;
        const elapsed = Math.min(Math.max(now - start, 0), duration);
        
        // Calculate accrued funds using BigInt for precision
        const accruedOctas = duration > 0 
          ? (BigInt(total) * BigInt(elapsed)) / BigInt(duration)
          : 0n;
          
        const isMove = s.coin_type.includes('aptos_coin');
        const divisor = isMove ? 100_000_000 : 1_000_000;

        return {
          stream_id: s.stream_id,
          sender: s.sender,
          recipient: s.recipient,
          amount: s.amount,
          start_time: s.start_time,
          end_time: s.end_time,
          coin_type: s.coin_type,
          isActive: now < end && s.active !== false,
          progress: duration > 0 ? (elapsed / duration) * 100 : 0,
          accruedFunds: Number(accruedOctas) / divisor,
          availableToWithdraw: Number(accruedOctas) - withdrawn, // In Octas
          timeRemaining: Math.max(end - now, 0),
        };
      });

      setStreams(formattedStreams);
    } catch (err: any) {
      console.error("Failed to fetch streams:", err);
      setError(err.message || "Failed to sync with blockchain");
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, aptosClient, moduleAddress]);

  // Initial fetch and poll every 30 seconds for blockchain state
  useEffect(() => {
    fetchStreams();
    const interval = setInterval(fetchStreams, 30000);
    return () => clearInterval(interval);
  }, [fetchStreams]);

  return { streams, isLoading, error, refetch: fetchStreams };
};







// /**
//  * React hook for fetching and managing stream data
//  * Queries the blockchain to get all streams for the connected wallet
//  */

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { CONTRACT_ADDRESS } from '@/lib/aptosClient';
// import { StreamResource } from '@/lib/AgentPayStreamClient';
// import { toAccountAddress } from '@/lib/privyToAptos';
// import { useWallet } from '@aptos-labs/wallet-adapter-react';

// export interface StreamData extends StreamResource {
//   // Computed fields
//   accruedFunds: number; // in MOVE
//   availableToWithdraw: number; // in MOVE
//   isActive: boolean;
//   timeRemaining: number; // seconds
//   progress: number; // percentage (0-100)
// }

// const MOVE_TO_OCTAS = 100_000_000; // 1 MOVE = 10^8 octas
// const POLL_INTERVAL = 15000; // 15 seconds

// /**
//  * Fetch a single stream by sender address and stream ID
//  */
// async function fetchStream(
//   senderAddress: string,
//   streamId: string
// ): Promise<StreamResource | null> {
//   if (!CONTRACT_ADDRESS) return null;

//   try {
//     const { aptosClient } = await import('@/lib/aptosClient');
//     const sender = toAccountAddress(senderAddress);
    
//     const viewResponse = await aptosClient.view({
//       payload: {
//         function: `${CONTRACT_ADDRESS}::agent_pay_stream::get_stream`,
//         functionArguments: [sender.toString(), streamId],
//       },
//     });

//     const [senderAddr, recipient, amount, startTime, endTime, ratePerSecond, withdrawn] = viewResponse as [
//       string,
//       string,
//       string,
//       string,
//       string,
//       string,
//       string
//     ];

//     return {
//       stream_id: streamId,
//       sender: senderAddr,
//       recipient,
//       amount,
//       start_time: startTime,
//       end_time: endTime,
//       rate_per_second: ratePerSecond,
//       withdrawn,
//     };
//   } catch (error) {
//     console.error(`Error fetching stream ${streamId} for ${senderAddress}:`, error);
//     return null;
//   }
// }

// /**
//  * Calculate accrued funds and other computed values
//  */
// function calculateStreamData(stream: StreamResource): StreamData {
//   const currentTime = Math.floor(Date.now() / 1000);
//   const startTime = parseInt(stream.start_time);
//   const endTime = parseInt(stream.end_time);
//   const ratePerSecond = parseInt(stream.rate_per_second);
//   const withdrawn = parseInt(stream.withdrawn);
//   const totalAmount = parseInt(stream.amount);

//   // Calculate elapsed time
//   const elapsed = Math.min(
//     currentTime > endTime ? endTime - startTime : currentTime - startTime,
//     endTime - startTime
//   );

//   // Calculate accrued funds (total that should have been streamed)
//   const accruedOctas = ratePerSecond * Math.max(0, elapsed);
//   const accruedFunds = accruedOctas / MOVE_TO_OCTAS;

//   // Calculate available to withdraw (accrued - already withdrawn)
//   const availableOctas = Math.max(0, accruedOctas - withdrawn);
//   const availableToWithdraw = availableOctas / MOVE_TO_OCTAS;

//   // Check if stream is active
//   const isActive = currentTime < endTime && elapsed >= 0;

//   // Calculate time remaining
//   const timeRemaining = Math.max(0, endTime - currentTime);

//   // Calculate progress percentage
//   const progress = totalAmount > 0 
//     ? Math.min(100, (accruedOctas / totalAmount) * 100)
//     : 0;

//   return {
//     ...stream,
//     accruedFunds,
//     availableToWithdraw,
//     isActive,
//     timeRemaining,
//     progress,
//   };
// }

// /**
//  * Fetch all streams for a given address (as sender or recipient)
//  * Note: This is a simplified implementation. In production, you might need to:
//  * 1. Query events to find all streams
//  * 2. Use a table/index to track streams
//  * 3. Query multiple addresses if the user has multiple accounts
//  */

// async function fetchAllStreamsForAddress(address: string): Promise<StreamResource[]> {
//   if (!CONTRACT_ADDRESS || !address) return [];

//   try {
//     const streams: StreamResource[] = [];
//     // Note: In a real Move contract, you'd usually query a 'StreamCounter' resource 
//     // first to know how many times to loop. We'll check up to 10 for the MVP.
//     const maxStreamsToCheck = 10; 
    
//     for (let i = 0; i < maxStreamsToCheck; i++) {
//       try {
//         const stream = await fetchStream(address, i.toString());
//         if (stream) {
//           streams.push(stream);
//         }
//       } catch (e) {
//         // If fetchStream fails, we've likely hit the end of the user's streams
//         break;
//       }
//     }
//     return streams;
//   } catch (error) {
//     console.error('Error fetching streams:', error);
//     return [];
//   }
// }

// export function useStreamData() {
//   const { connected, account } = useWallet();
//   const [streams, setStreams] = useState<StreamData[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const aptosAddress = account?.address.toString();

//   // Fetch streams
//   const fetchStreams = useCallback(async () => {
//     if (!connected || !aptosAddress) {
//       setStreams([]);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const rawStreams = await fetchAllStreamsForAddress(aptosAddress);
//       const computedStreams = rawStreams.map(calculateStreamData);
//       setStreams(computedStreams);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch streams');
//       console.error('Error fetching streams:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [connected, aptosAddress]);

//   // Initial fetch and polling
//   useEffect(() => {
//     fetchStreams();

//     // Set up polling
//     const interval = setInterval(fetchStreams, POLL_INTERVAL);

//     return () => clearInterval(interval);
//   }, [fetchStreams]);

//   // Real-time updates for accrued funds (update every second)
//   useEffect(() => {
//     if (streams.length === 0) return;

//     const interval = setInterval(() => {
//       setStreams(prevStreams => 
//         prevStreams.map(stream => {
//           const rawStream: StreamResource = {
//             stream_id: stream.stream_id,
//             sender: stream.sender,
//             recipient: stream.recipient,
//             amount: stream.amount,
//             start_time: stream.start_time,
//             end_time: stream.end_time,
//             rate_per_second: stream.rate_per_second,
//             withdrawn: stream.withdrawn,
//           };
//           return calculateStreamData(rawStream);
//         })
//       );
//     }, 1000); // Update every second for real-time accrued funds

//     return () => clearInterval(interval);
//   }, [streams.length]);

//   return {
//     streams,
//     isLoading,
//     error,
//     refetch: fetchStreams,
//     aptosAddress,
//   };
// }

