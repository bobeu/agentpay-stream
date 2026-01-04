/**
 * Header Component
 * PancakeSwap-inspired header with logo and wallet connect button
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivySafe } from '@/hooks/usePrivySafe';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import WalletDisconnectModal from './WalletDisconnectModal';

export default function Header() {
  const { authenticated, login, user } = usePrivySafe();
  const { balance, isLoading: balanceLoading } = useAccountBalance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (bal: number | null) => {
    if (bal === null) return '--';
    if (bal === 0) return '0';
    if (bal < 0.000001) return '<0.000001';
    return bal.toFixed(6);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F2A3A]/95 backdrop-blur-sm border-b border-[#00FFFF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo4.png"
                alt="AgentPay Stream"
                width={72}
                height={72}
                className="rounded-l pt-4"
              />
              {/* <span className="text-xl font-bold text-[#00FFFF]">AgentPay Stream</span> */}
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#A0A0A0] hidden sm:block">Movement L1</span>
              
              {/* Account Balance Display */}
              {(authenticated || balance !== null) && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A3A4A] border border-[#00FFFF]/20 rounded-lg">
                  {balanceLoading ? (
                    <Loader2 className="w-4 h-4 text-[#00FFFF] animate-spin" />
                  ) : (
                    <>
                      <span className="text-xs text-[#A0A0A0]">Balance:</span>
                      <span className="text-sm font-semibold text-[#00FFFF]">
                        {formatBalance(balance)} APT
                      </span>
                    </>
                  )}
                </div>
              )}
              
              {/* Wallet Connect/Status Button */}
              {!authenticated ? (
                <button
                  onClick={login}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF6600] hover:bg-[#FF6600]/80 text-white font-semibold rounded-lg transition-all shadow-lg border-2"
                  style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1A3A4A] hover:bg-[#1A3A4A]/80 border border-r-2 border-b-2 border-[#00FFFF] rounded-lg transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00FFFF]" />
                  <div className="text-left">
                    <p className="text-xs text-[#A0A0A0] leading-tight">Connected</p>
                    <p className="text-sm font-mono text-[#00FFFF] leading-tight">
                      {user?.wallet?.address ? formatAddress(user.wallet.address) : user?.id?.slice(0, 8) || 'Unknown'}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <WalletDisconnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

