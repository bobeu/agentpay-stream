'use client';

import { usePrivySafe } from '@/hooks/usePrivySafe';
import { useStreamData } from '@/hooks/useStreamData';
import { useState, useEffect } from 'react';
import CreateStreamForm from '@/components/CreateStreamForm';
import StreamDashboard from '@/components/StreamDashboard';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const { ready, authenticated, user } = usePrivySafe();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [aptosAddress, setAptosAddress] = useState<string | null>(null);
  
  // Get streams data to check if we should show two-panel layout
  const { streams, isLoading: streamsLoading } = useStreamData();

  // Check wallet connection status (from Privy or direct Aptos wallet)
  useEffect(() => {
    const checkWallet = async () => {
      // Check Privy wallet first
      if (authenticated && user?.wallet?.address) {
        setAptosAddress(user.wallet.address);
        setIsWalletConnected(true);
        return;
      }

      // Fallback to direct Aptos wallet check
      if (typeof window !== 'undefined' && (window as any).aptos) {
        try {
          const wallet = (window as any).aptos;
          const account = await wallet.account();
          if (account?.address) {
            setAptosAddress(account.address);
            setIsWalletConnected(true);
          } else {
            setIsWalletConnected(false);
          }
        } catch {
          setIsWalletConnected(false);
        }
      } else {
        setIsWalletConnected(false);
      }
    };
    checkWallet();
    
    // Listen for wallet connection changes
    const interval = setInterval(checkWallet, 2000);
    return () => clearInterval(interval);
  }, [authenticated, user]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F2A3A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto"></div>
          <p className="mt-4 text-[#E0E0E0]">Loading...</p>
        </div>
      </div>
    );
  }

  // If wallet not connected: centered form (80% width)
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-[#0F2A3A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contract Status */}
          {!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
            <div className="mb-6 bg-[#DC2626]/20 border-l-4 border-[#FF6600] rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#E0E0E0] mb-1">
                  Contract Not Deployed
                </p>
                <p className="text-sm text-[#A0A0A0]">
                  Set <span className="font-mono text-[#00FFFF]">NEXT_PUBLIC_CONTRACT_ADDRESS</span> in <span className="font-mono">.env.local</span> to enable full functionality.
                </p>
              </div>
            </div>
          )}

          {/* Centered Create Stream Form (PancakeSwap style) */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <CreateStreamForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If wallet connected: check if there are streams to display
  // Only show two-panel layout if streams exist, otherwise show only form
  const hasStreams = !streamsLoading && streams.length > 0;

  if (!hasStreams) {
    // No streams: show only centered form
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Centered Create Stream Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <CreateStreamForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has streams: two-panel layout (60% Dashboard, 40% Form)
  return (
    <div className="min-h-screen bg-[#0F2A3A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Two-Panel Layout: Dashboard (Left 60%) | Form (Right 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
          {/* Left Panel: Stream Dashboard */}
          <div className="order-2 lg:order-1">
            <StreamDashboard />
          </div>

          {/* Right Panel: Create Stream Form */}
          <div className="order-1 lg:order-2">
            <CreateStreamForm />
          </div>
        </div>
      </div>
    </div>
  );
}
