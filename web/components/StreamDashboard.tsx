/**
 * StreamDashboard.tsx - Fixed Implementation
 */
'use client';

import StreamCard from './StreamCard';
import { StreamData } from '@/hooks/useStreamData';
import { Wallet } from 'lucide-react';

interface StreamDashboardProps {
  streams: StreamData[];
  isDummy: boolean;
}

export default function StreamDashboard({ streams, isDummy }: StreamDashboardProps) {
  
  const handleConnectTrigger = () => {
    // 1. Try to find the actual wallet adapter button in your layout
    // We look for common button text or roles used by Aptos Wallet Adapters
    const walletButtons = Array.from(document.querySelectorAll('button'));
    const connectBtn = walletButtons.find(btn => 
      btn.innerText.toLowerCase().includes('connect') || 
      btn.innerText.toLowerCase().includes('select wallet')
    );

    if (connectBtn) {
      connectBtn.click();
    } else {
      // Fallback: Scroll to top where the wallet button usually lives
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert("Please use the Connect Wallet button at the top of the page.");
    }
  };

  return (
    <div className="w-full relative min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00FFFF] uppercase tracking-tighter italic">
            {isDummy ? 'Network Preview' : 'Active Transmissions'}
          </h2>
        </div>
      </div>

      {/* Grid: Only this part is disabled and blurred when in dummy mode */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 
        ${isDummy ? 'blur-md grayscale opacity-40 pointer-events-none select-none' : ''}`}>
        {streams.map((stream) => (
          <StreamCard
            key={`${stream.sender}-${stream.stream_id}`}
            stream={stream}
            userAddress={stream.sender}
            isDummy={isDummy}
          />
        ))}
      </div>

      {/* Overlay: This remains fully interactive */}
      {isDummy && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F2A3A]/80 border-2 border-[#FF6600] p-8 rounded-2xl shadow-[0_0_50px_rgba(255,102,0,0.4)] text-center max-w-sm backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-[#FF6600]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF6600]">
              <Wallet className="text-[#FF6600] w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-2 tracking-tighter">Initialize Link</h3>
            <p className="text-sm text-[#A0A0A0] mb-6">
              Connect your Movement wallet to monitor live streams and claim your MOVE tokens.
            </p>
            
            <button 
              onClick={handleConnectTrigger}
              className="w-full bg-[#FF6600] hover:bg-[#FF8533] text-white font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-[4px_4px_0px_0px_#803300]"
            >
              <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              CONNECT WALLET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
