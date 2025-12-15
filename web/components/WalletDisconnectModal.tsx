/**
 * WalletDisconnectModal Component
 * Modal for disconnecting wallet
 */

'use client';

import { X } from 'lucide-react';
import { usePrivySafe } from '@/hooks/usePrivySafe';

interface WalletDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletDisconnectModal({ isOpen, onClose }: WalletDisconnectModalProps) {
  const { logout, user } = usePrivySafe();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  const handleDisconnect = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#1A3A4A] border-2 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
        {/* Header */}
        <div className="bg-[#1A3A4A] border-b border-[#00FFFF]/30 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#00FFFF]">Wallet Connected</h2>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#00FFFF] transition-colors p-2 hover:bg-[#00FFFF]/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-[#A0A0A0] mb-2">Connected Address</p>
            <div className="bg-[#0F2A3A] border border-[#00FFFF]/20 rounded-lg p-3">
              <p className="text-sm font-mono text-[#00FFFF] break-all">
                {user?.wallet?.address || user?.id || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDisconnect}
              className="w-full bg-[#FF6600] hover:bg-[#FF6600]/80 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg border-2"
              style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}
            >
              Disconnect Wallet
            </button>
            <button
              onClick={onClose}
              className="w-full bg-[#0F2A3A] hover:bg-[#0F2A3A]/80 text-[#E0E0E0] font-semibold py-3 px-4 rounded-lg transition-all border border-[#1A3A4A]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

