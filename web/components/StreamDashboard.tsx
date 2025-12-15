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
        <div className="bg-[#0A1F2E] border border-[#00FFFF]/20 rounded-lg p-6">
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
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00FFFF]" />
            <p className="text-[#E0E0E0]">Loading streams...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-[#FF6600]/20 border border-[#FF6600] rounded-lg p-6">
          <p className="text-sm text-[#FF6600] mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-[#FF6600] hover:bg-[#FF6600]/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
        <div className="bg-[#0A1F2E] border-2 rounded-xl shadow-lg p-8 text-center" style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
          <h2 className="text-2xl font-bold mb-4 text-[#00FFFF]">
            No Active Streams
          </h2>
          <p className="text-[#E0E0E0] mb-4">
            You don't have any active payment streams yet.
          </p>
          <p className="text-sm text-[#A0A0A0]">
            Create a new stream using the form on the right to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00FFFF]">
            Your Streams
          </h2>
          <p className="text-sm text-[#A0A0A0] mt-1">
            {streams.length} {streams.length === 1 ? 'stream' : 'streams'} found
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 disabled:opacity-50 disabled:cursor-not-allowed text-[#081720] font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg text-sm border-2"
          style={!isLoading ? { borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' } : {}}
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

