'use client';

import { usePrivy } from '@privy-io/react-auth';
import CreateStreamForm from '@/components/CreateStreamForm';
import StreamDashboard from '@/components/StreamDashboard';
import WalletConnectPanel from '@/components/WalletConnectPanel';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const { ready } = usePrivy();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#12121F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto"></div>
          <p className="mt-4 text-[#E0E0E0]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12121F] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Wallet Connection Panel */}
        <WalletConnectPanel />

        {/* Contract Status Warning */}
        {!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
          <div className="bg-[#DC2626]/20 border-l-4 border-[#00E0A3] rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#00E0A3] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#E0E0E0] mb-1">
                Contract Not Deployed
              </p>
              <p className="text-sm text-[#A0A0A0]">
                Set <span className="font-mono text-[#00E0A3]">NEXT_PUBLIC_CONTRACT_ADDRESS</span> in <span className="font-mono">.env.local</span> to enable full functionality.
              </p>
            </div>
          </div>
        )}

        {/* Contract Deployed Success */}
        {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
          <div className="bg-[#00E0A3]/20 border border-[#00E0A3] rounded-lg p-4">
            <p className="text-sm text-[#00E0A3]">
              <span className="font-semibold">Contract Deployed:</span>{' '}
              <span className="font-mono text-xs">{process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}</span>
            </p>
          </div>
        )}

        {/* Create Stream Form */}
        <CreateStreamForm />

        {/* Stream Dashboard */}
        <StreamDashboard />
      </div>
    </div>
  );
}
