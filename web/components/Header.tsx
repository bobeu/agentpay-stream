/**
 * Header Component
 * Professional Cyberpunk UI for AgentPay Stream
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { Wallet, ChevronDown, Activity, Loader2 } from 'lucide-react';
import UnifiedWalletModal from './UnifiedWalletModal';

export default function Header() {
  const { address, isLoading, isConnected, walletName } = useUnifiedWallet();
  const { balance, isLoading: balanceLoading } = useAccountBalance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatBalance = (bal: number | null) => {
    if (bal === null) return '0.00';
    return bal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F2A3A]/80 backdrop-blur-md border-b-2 border-[#1A3A4A]">
        {/* Top Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Branding */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo4.png"
                  alt="AgentPay"
                  width={48}
                  height={48}
                  className="rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute -inset-1 bg-[#00FFFF]/20 blur-sm rounded-lg -z-10 group-hover:bg-[#00FFFF]/40" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                  AgentPay <span className="text-[#00FFFF]">Stream</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" />
                  <span className="text-[10px] text-[#A0A0A0] font-bold tracking-widest uppercase">Movement L1 Testnet</span>
                </div>
              </div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              
              {/* Stats / Network Activity (Optional Visual Element) */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-2 border-x border-[#1A3A4A] text-[#A0A0A0]">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold">Gas</span>
                  <span className="text-xs font-mono text-white">0.001 MOVE</span>
                </div>
                <Activity className="w-4 h-4 text-[#00FFFF]/50" />
              </div>

              {/* Account / Wallet Area */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center bg-[#0A1F2E] border border-[#1A3A4A] rounded-xl overflow-hidden shadow-2xl">
                    {/* Balance */}
                    {/* Updated Balance Display in Header.tsx */}
                    <div className="px-4 py-2 border-r border-[#1A3A4A] hidden sm:flex flex-col items-start min-w-[100px]">
                      <span className="text-[9px] text-[#A0A0A0] uppercase font-bold">Available MOVE</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">
                          {/* Show balance if exists, else show --. No more layout-breaking loaders. */}
                          {balance !== null ? formatBalance(balance) : '--'} 
                          <span className="text-[#00FFFF] ml-1">MOVE</span>
                        </span>
                        {/* Subtle indicator instead of a big spinner */}
                        {balanceLoading && <div className="w-1 h-1 rounded-full bg-[#00FFFF] animate-ping" />}
                      </div>
                    </div>

                    {/* <div className="px-4 py-2 border-r border-[#1A3A4A] hidden sm:flex flex-col items-start">
                      <span className="text-[9px] text-[#A0A0A0] uppercase font-bold">Balance</span>
                      <div className="flex items-center gap-1">
                        {balanceLoading ? (
                          <Loader2 className="w-3 h-3 text-[#00FFFF] animate-spin" />
                        ) : (
                          <span className="text-sm font-bold text-white font-mono">
                            {formatBalance(balance)} <span className="text-[#00FFFF]">MOVE</span>
                          </span>
                        )}
                      </div>
                    </div> */}

                    {/* Address / Profile */}
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-[#1A3A4A] hover:bg-[#2A4A5A] transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00FFFF] to-[#FF6600] p-[1px]">
                         <div className="w-full h-full rounded-full bg-[#0A1F2E] flex items-center justify-center">
                            <Wallet className="w-3 h-3 text-[#00FFFF]" />
                         </div>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-[#A0A0A0] font-bold leading-none uppercase">
                          {walletName || 'Aptos Wallet'}
                        </p>
                        <p className="text-xs font-mono text-white leading-none mt-1">
                          {address ? formatAddress(address.toString()) : ''}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#A0A0A0] group-hover:text-white transition-colors" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isLoading}
                    className="relative group px-6 py-2.5 bg-[#FF6600] text-white font-black uppercase italic tracking-tighter rounded-lg overflow-hidden transition-all active:scale-95"
                    style={{ 
                      boxShadow: '4px 4px 0px 0px #00FFFF',
                      border: '1px solid rgba(255,255,255,0.2)' 
                    }}
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wallet className="w-4 h-4" />
                      )}
                      <span>{isLoading ? 'Verifying...' : 'Connect Link'}</span>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Spacing for fixed header */}
      <div className="h-24" />

      <UnifiedWalletModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
