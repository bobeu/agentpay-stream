/**
 * React hook for fetching and managing stream data
 * Queries the blockchain to get all streams for the connected wallet
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivySafe } from './usePrivySafe';
import { aptosClient, CONTRACT_ADDRESS } from '@/lib/aptosClient';
import { AccountAddress } from '@aptos-labs/ts-sdk';
import { StreamResource } from '@/lib/AgentPayStreamClient';
import { toAccountAddress } from '@/lib/privyToAptos';

export interface StreamData extends StreamResource {
  // Computed fields
  accruedFunds: number; // in APT
  availableToWithdraw: number; // in APT
  isActive: boolean;
  timeRemaining: number; // seconds
  progress: number; // percentage (0-100)
}

const APT_TO_OCTAS = 100_000_000; // 1 APT = 10^8 octas
const POLL_INTERVAL = 15000; // 15 seconds

/**
 * Fetch a single stream by sender address and stream ID
 */
async function fetchStream(
  senderAddress: string,
  streamId: string
): Promise<StreamResource | null> {
  if (!CONTRACT_ADDRESS) return null;

  try {
    const { aptosClient } = await import('@/lib/aptosClient');
    const sender = toAccountAddress(senderAddress);
    
    const viewResponse = await aptosClient.view({
      payload: {
        function: `${CONTRACT_ADDRESS}::agent_pay_stream::get_stream`,
        functionArguments: [sender.toString(), streamId],
      },
    });

    const [senderAddr, recipient, amount, startTime, endTime, ratePerSecond, withdrawn] = viewResponse as [
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];

    return {
      stream_id: streamId,
      sender: senderAddr,
      recipient,
      amount,
      start_time: startTime,
      end_time: endTime,
      rate_per_second: ratePerSecond,
      withdrawn,
    };
  } catch (error) {
    console.error(`Error fetching stream ${streamId} for ${senderAddress}:`, error);
    return null;
  }
}

/**
 * Calculate accrued funds and other computed values
 */
function calculateStreamData(stream: StreamResource): StreamData {
  const currentTime = Math.floor(Date.now() / 1000);
  const startTime = parseInt(stream.start_time);
  const endTime = parseInt(stream.end_time);
  const ratePerSecond = parseInt(stream.rate_per_second);
  const withdrawn = parseInt(stream.withdrawn);
  const totalAmount = parseInt(stream.amount);

  // Calculate elapsed time
  const elapsed = Math.min(
    currentTime > endTime ? endTime - startTime : currentTime - startTime,
    endTime - startTime
  );

  // Calculate accrued funds (total that should have been streamed)
  const accruedOctas = ratePerSecond * Math.max(0, elapsed);
  const accruedFunds = accruedOctas / APT_TO_OCTAS;

  // Calculate available to withdraw (accrued - already withdrawn)
  const availableOctas = Math.max(0, accruedOctas - withdrawn);
  const availableToWithdraw = availableOctas / APT_TO_OCTAS;

  // Check if stream is active
  const isActive = currentTime < endTime && elapsed >= 0;

  // Calculate time remaining
  const timeRemaining = Math.max(0, endTime - currentTime);

  // Calculate progress percentage
  const progress = totalAmount > 0 
    ? Math.min(100, (accruedOctas / totalAmount) * 100)
    : 0;

  return {
    ...stream,
    accruedFunds,
    availableToWithdraw,
    isActive,
    timeRemaining,
    progress,
  };
}

/**
 * Fetch all streams for a given address (as sender or recipient)
 * Note: This is a simplified implementation. In production, you might need to:
 * 1. Query events to find all streams
 * 2. Use a table/index to track streams
 * 3. Query multiple addresses if the user has multiple accounts
 */
async function fetchAllStreamsForAddress(address: string): Promise<StreamResource[]> {
  if (!CONTRACT_ADDRESS || !address) return [];

  try {
    // For MVP, we'll try to fetch streams by querying the sender's resource
    // Since streams are stored under the sender's address, we need to:
    // 1. Try to get the StreamCounter to know how many streams exist
    // 2. Try fetching each stream ID until we find all active ones
    
    // This is a simplified approach - in production, you'd want to:
    // - Use events to track stream creation
    // - Maintain an index/table of all streams
    // - Query multiple addresses if needed
    
    const streams: StreamResource[] = [];
    const maxStreamsToCheck = 100; // Limit to prevent excessive queries
    
    // Try fetching streams by ID (0 to maxStreamsToCheck)
    // In a real implementation, you'd query events or use a better indexing mechanism
    for (let i = 0; i < maxStreamsToCheck; i++) {
      try {
        const stream = await fetchStream(address, i.toString());
        if (stream) {
          // Check if this stream is for the current user (as sender or recipient)
          if (stream.sender.toLowerCase() === address.toLowerCase() || 
              stream.recipient.toLowerCase() === address.toLowerCase()) {
            streams.push(stream);
          }
        }
      } catch {
        // Stream doesn't exist or error - continue
        break;
      }
    }

    return streams;
  } catch (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
}

export function useStreamData() {
  const { authenticated, user } = usePrivySafe();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aptosAddress, setAptosAddress] = useState<string | null>(null);

  // Get Aptos wallet address
  useEffect(() => {
    const getAptosAddress = async () => {
      if (typeof window !== 'undefined' && (window as any).aptos) {
        try {
          const wallet = (window as any).aptos;
          const account = await wallet.account();
          if (account?.address) {
            setAptosAddress(account.address);
          }
        } catch {
          // Wallet not connected
        }
      }
    };

    getAptosAddress();
  }, []);

  // Fetch streams
  const fetchStreams = useCallback(async () => {
    if (!authenticated || !aptosAddress) {
      setStreams([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rawStreams = await fetchAllStreamsForAddress(aptosAddress);
      const computedStreams = rawStreams.map(calculateStreamData);
      setStreams(computedStreams);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch streams');
      console.error('Error fetching streams:', err);
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, aptosAddress]);

  // Initial fetch and polling
  useEffect(() => {
    fetchStreams();

    // Set up polling
    const interval = setInterval(fetchStreams, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchStreams]);

  // Real-time updates for accrued funds (update every second)
  useEffect(() => {
    if (streams.length === 0) return;

    const interval = setInterval(() => {
      setStreams(prevStreams => 
        prevStreams.map(stream => {
          const rawStream: StreamResource = {
            stream_id: stream.stream_id,
            sender: stream.sender,
            recipient: stream.recipient,
            amount: stream.amount,
            start_time: stream.start_time,
            end_time: stream.end_time,
            rate_per_second: stream.rate_per_second,
            withdrawn: stream.withdrawn,
          };
          return calculateStreamData(rawStream);
        })
      );
    }, 1000); // Update every second for real-time accrued funds

    return () => clearInterval(interval);
  }, [streams.length]);

  return {
    streams,
    isLoading,
    error,
    refetch: fetchStreams,
    aptosAddress,
  };
}

