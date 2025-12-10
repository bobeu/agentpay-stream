/**
 * StreamCard Component
 * Displays a single stream with real-time accrued funds and action buttons
 */

'use client';

import { useState, useEffect } from 'react';
import { useStreamActions } from '@/hooks/useStreamActions';
import { StreamData } from '@/hooks/useStreamData';
import { formatEther } from 'viem';

interface StreamCardProps {
  stream: StreamData;
  userAddress: string;
  onActionComplete?: () => void;
}

export default function StreamCard({ stream, userAddress, onActionComplete }: StreamCardProps) {
  const { handleWithdraw, handleCancel, isLoading, error, transactionHash } = useStreamActions();
  const [localAccrued, setLocalAccrued] = useState(stream.accruedFunds);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Update local accrued funds every second for real-time display
  useEffect(() => {
    setLocalAccrued(stream.accruedFunds);
    
    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = parseInt(stream.start_time);
      const endTime = parseInt(stream.end_time);
      const ratePerSecond = parseInt(stream.rate_per_second);
      const APT_TO_OCTAS = 100_000_000;

      const elapsed = Math.min(
        currentTime > endTime ? endTime - startTime : currentTime - startTime,
        endTime - startTime
      );

      const accruedOctas = ratePerSecond * Math.max(0, elapsed);
      const accruedFunds = accruedOctas / APT_TO_OCTAS;
      setLocalAccrued(accruedFunds);
    }, 1000);

    return () => clearInterval(interval);
  }, [stream]);

  const isSender = stream.sender.toLowerCase() === userAddress.toLowerCase();
  const isRecipient = stream.recipient.toLowerCase() === userAddress.toLowerCase();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Ended';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleWithdrawClick = async () => {
    setIsWithdrawing(true);
    try {
      const result = await handleWithdraw(stream.sender, stream.stream_id);
      if (result.success) {
        onActionComplete?.();
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleCancelClick = async () => {
    setIsCancelling(true);
    try {
      const result = await handleCancel(stream.stream_id);
      if (result.success) {
        onActionComplete?.();
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const totalAmount = parseInt(stream.amount) / 100_000_000;
  const flowRate = parseInt(stream.rate_per_second) / 100_000_000;

  return (
    <div className={`bg-[#1B1B32] rounded-xl shadow-lg p-6 border ${
      stream.isActive 
        ? 'border-[#3B82F6]/50 pulse-glow' 
        : 'border-[#2D2D4A]'
    } relative overflow-hidden`}>
      {/* Subtle gradient overlay for active streams */}
      {stream.isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#8B5CF6]/5 pointer-events-none"></div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-stream-gradient mb-1">
              Stream #{stream.stream_id}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  stream.isActive
                    ? 'bg-[#00E0A3]/20 text-[#00E0A3] border border-[#00E0A3]/30'
                    : 'bg-[#2D2D4A] text-[#A0A0A0]'
                }`}
              >
                {stream.isActive ? 'Active' : 'Ended'}
              </span>
              {isSender && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">
                  Sender
                </span>
              )}
              {isRecipient && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  Recipient
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stream Details */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Sender</p>
              <p className="text-sm font-mono text-[#E0E0E0]">
                {formatAddress(stream.sender)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Recipient</p>
              <p className="text-sm font-mono text-[#E0E0E0]">
                {formatAddress(stream.recipient)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Total Amount</p>
              <p className="text-sm font-semibold text-[#E0E0E0]">
                {totalAmount.toFixed(6)} APT
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Flow Rate</p>
              <p className="text-sm font-semibold text-[#E0E0E0]">
                {flowRate.toFixed(8)} APT/s
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Accrued Funds */}
        <div className="bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 rounded-lg p-4 mb-4 border border-[#3B82F6]/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#E0E0E0]">
              Accrued Funds
            </p>
            <p className="text-lg font-bold text-stream-gradient">
              {localAccrued.toFixed(6)} APT
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#A0A0A0]">
              Available to Withdraw
            </p>
            <p className="text-sm font-semibold text-[#00E0A3]">
              {stream.availableToWithdraw.toFixed(6)} APT
            </p>
          </div>
          <div className="mt-2">
            <div className="w-full bg-[#252540] rounded-full h-2">
              <div
                className="bg-stream-gradient h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, stream.progress)}%` }}
              />
            </div>
            <p className="text-xs text-[#A0A0A0] mt-1">
              {stream.progress.toFixed(1)}% complete
            </p>
          </div>
        </div>

        {/* Time Remaining */}
        {stream.isActive && (
          <div className="mb-4">
            <p className="text-xs text-[#A0A0A0] mb-1">Time Remaining</p>
            <p className="text-sm font-medium text-[#E0E0E0]">
              {formatTime(stream.timeRemaining)}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#DC2626]/20 border border-[#DC2626] rounded-lg">
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {transactionHash && (
          <div className="mb-4 p-3 bg-[#00E0A3]/20 border border-[#00E0A3] rounded-lg">
            <p className="text-sm text-[#00E0A3] mb-2 font-semibold">
              Transaction successful!
            </p>
            <a
              href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#00E0A3] hover:underline"
            >
              View on explorer →
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isRecipient && stream.availableToWithdraw > 0 && (
            <button
              onClick={handleWithdrawClick}
              disabled={isLoading || isWithdrawing}
              className="flex-1 bg-[#00E0A3] hover:bg-[#00C893] disabled:bg-[#252540] disabled:text-[#A0A0A0] text-[#12121F] font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg"
            >
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </button>
          )}
          {isSender && stream.isActive && (
            <button
              onClick={handleCancelClick}
              disabled={isLoading || isCancelling}
              className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-[#252540] disabled:text-[#A0A0A0] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Stream'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

