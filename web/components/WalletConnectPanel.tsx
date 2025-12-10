/**
 * WalletConnectPanel Component
 * Unified wallet connection panel for Privy and Aptos
 */

'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { Lock, Link as LinkIcon } from 'lucide-react';

export default function WalletConnectPanel() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [aptosWalletConnected, setAptosWalletConnected] = useState(false);
  const [aptosAddress, setAptosAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check for Aptos wallet (Petra, etc.)
    const checkAptosWallet = async () => {
      if (typeof window !== 'undefined' && (window as any).aptos) {
        try {
          const wallet = (window as any).aptos;
          const account = await wallet.account();
          if (account?.address) {
            setAptosAddress(account.address);
            setAptosWalletConnected(true);
          }
        } catch {
          // Wallet not connected
        }
      }
    };

    checkAptosWallet();
  }, []);

  const connectAptosWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).aptos) {
      try {
        const wallet = (window as any).aptos;
        const account = await wallet.account();
        if (account?.address) {
          setAptosAddress(account.address);
          setAptosWalletConnected(true);
        } else {
          const connectResult = await wallet.connect();
          if (connectResult?.address) {
            setAptosAddress(connectResult.address);
            setAptosWalletConnected(true);
          }
        }
      } catch (error) {
        console.error('Failed to connect Aptos wallet:', error);
        alert('Failed to connect Aptos wallet. Please make sure Petra wallet is installed.');
      }
    } else {
      alert('Aptos wallet not found. Please install Petra wallet from https://petra.app');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!ready) {
    return null;
  }

  return (
    <div className="bg-[#1B1B32] rounded-xl border border-[#2D2D4A] p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-[#E0E0E0]">Wallet Connection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Privy Authentication */}
        <div className="bg-[#252540] rounded-lg p-4 border border-[#2D2D4A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1B1B32] rounded-lg">
                <Lock className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#E0E0E0]">Privy Auth</p>
                <p className="text-xs text-[#A0A0A0]">User Authentication</p>
              </div>
            </div>
          </div>
          {!authenticated ? (
            <button
              onClick={login}
              className="w-full bg-stream-gradient hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg"
            >
              Connect Privy
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-[#1B1B32] rounded-lg p-2">
                <p className="text-xs text-[#A0A0A0] mb-1">Connected</p>
                <p className="text-sm font-mono text-[#E0E0E0]">
                  {user?.wallet?.address ? formatAddress(user.wallet.address) : user?.id?.slice(0, 8) || 'Unknown'}
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Aptos Wallet */}
        <div className="bg-[#252540] rounded-lg p-4 border border-[#2D2D4A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1B1B32] rounded-lg">
                <LinkIcon className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#E0E0E0]">Aptos Wallet</p>
                <p className="text-xs text-[#A0A0A0]">Blockchain Transactions</p>
              </div>
            </div>
          </div>
          {!aptosWalletConnected ? (
            <button
              onClick={connectAptosWallet}
              className="w-full bg-stream-gradient hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg"
            >
              Connect Aptos
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-[#1B1B32] rounded-lg p-2">
                <p className="text-xs text-[#A0A0A0] mb-1">Connected</p>
                <p className="text-sm font-mono text-[#E0E0E0]">
                  {aptosAddress ? formatAddress(aptosAddress) : 'Unknown'}
                </p>
              </div>
              <button
                onClick={() => {
                  setAptosWalletConnected(false);
                  setAptosAddress(null);
                }}
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

