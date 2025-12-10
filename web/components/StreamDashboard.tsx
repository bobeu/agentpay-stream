/**
 * StreamDashboard Component
 * Main view for displaying all active streams
 */

'use client';

import { useStreamData } from '@/hooks/useStreamData';
import StreamCard from './StreamCard';
import { Loader2 } from 'lucide-react';

export default function StreamDashboard() {
  const { streams, isLoading, error, refetch, aptosAddress } = useStreamData();

  if (!aptosAddress) {
    return (
      <div className="w-full">
        <div className="bg-[#1B1B32] border border-[#2D2D4A] rounded-lg p-6">
          <p className="text-sm text-[#E0E0E0]">
            Please connect your Aptos wallet to view your streams.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && streams.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#3B82F6]" />
            <p className="text-[#E0E0E0]">Loading streams...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-[#DC2626]/20 border border-[#DC2626] rounded-lg p-6">
          <p className="text-sm text-[#DC2626] mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-[#1B1B32] border border-[#2D2D4A] rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-stream-gradient">
            No Active Streams
          </h2>
          <p className="text-[#E0E0E0] mb-4">
            You don't have any active payment streams yet.
          </p>
          <p className="text-sm text-[#A0A0A0]">
            Create a new stream using the form above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stream-gradient">
            Your Streams
          </h2>
          <p className="text-sm text-[#A0A0A0] mt-1">
            {streams.length} {streams.length === 1 ? 'stream' : 'streams'} found
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-stream-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg text-sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {streams.map((stream) => (
          <StreamCard
            key={`${stream.sender}-${stream.stream_id}`}
            stream={stream}
            userAddress={aptosAddress}
            onActionComplete={refetch}
          />
        ))}
      </div>
    </div>
  );
}

