/**
 * StreamCard Component
 * Displays a single stream with real-time accrued funds and action buttons
 */

// 'use client';

// import { useState, useEffect } from 'react';
// import { useStreamActions } from '@/hooks/useStreamActions';
// import { StreamData } from '@/hooks/useStreamData';

// interface StreamCardProps {
//   stream: StreamData;
//   userAddress: string;
//   onActionComplete?: () => void;
//   isDummy?: boolean;
// }

// export default function StreamCard({ stream, userAddress, onActionComplete, isDummy }: StreamCardProps) {
//   const { handleWithdraw, handleCancel, isLoading, error, transactionHash } = useStreamActions();
//   const [localAccrued, setLocalAccrued] = useState(stream.accruedFunds);
//   const [isWithdrawing, setIsWithdrawing] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   // Update local accrued funds every second for real-time display
//   useEffect(() => {
//     setLocalAccrued(stream.accruedFunds);
    
//     const interval = setInterval(() => {
//       const currentTime = Math.floor(Date.now() / 1000);
//       const startTime = parseInt(stream.start_time);
//       const endTime = parseInt(stream.end_time);
//       const ratePerSecond = parseInt(stream.rate_per_second);
//       const MOVE_TO_OCTAS = 100_000_000;

//       const elapsed = Math.min(
//         currentTime > endTime ? endTime - startTime : currentTime - startTime,
//         endTime - startTime
//       );

//       const accruedOctas = ratePerSecond * Math.max(0, elapsed);
//       const accruedFunds = accruedOctas / MOVE_TO_OCTAS;
//       setLocalAccrued(accruedFunds);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [stream]);

//   const isSender = stream.sender.toLowerCase() === userAddress.toLowerCase();
//   const isRecipient = stream.recipient.toLowerCase() === userAddress.toLowerCase();

//   const formatAddress = (address: string) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const formatTime = (seconds: number) => {
//     if (seconds <= 0) return 'Ended';
//     const days = Math.floor(seconds / 86400);
//     const hours = Math.floor((seconds % 86400) / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
    
//     if (days > 0) return `${days}d ${hours}h`;
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     return `${minutes}m`;
//   };

//   const handleWithdrawClick = async () => {
//     setIsWithdrawing(true);
//     try {
//       const result = await handleWithdraw(stream.sender, stream.stream_id);
//       if (result.success) {
//         onActionComplete?.();
//       }
//     } finally {
//       setIsWithdrawing(false);
//     }
//   };

//   const handleCancelClick = async () => {
//     setIsCancelling(true);
//     try {
//       const result = await handleCancel(stream.stream_id);
//       if (result.success) {
//         onActionComplete?.();
//       }
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   const totalAmount = parseInt(stream.amount) / 100_000_000;
//   const flowRate = parseInt(stream.rate_per_second) / 100_000_000;

//   return (
//     <div 
//       className={`bg-[#0A1F2E] rounded-xl shadow-lg p-6 border-2 relative overflow-hidden ${
//         isDummy ? 'opacity-80' : stream.isActive ? 'pulse-cyan' : ''
//       }`}
//       style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}
//     >
//     {/* <div 
//       className={`bg-[#0A1F2E] rounded-xl shadow-lg p-6 border-2 ${
//         stream.isActive 
//           ? 'pulse-cyan' 
//           : ''
//       } relative overflow-hidden`}
//       style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}
//     > */}
//       {/* Cyan glow overlay for active streams */}
//       {stream.isActive && (
//         <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/5 to-[#00FFFF]/0 pointer-events-none"></div>
//       )}
      
//       <div className="relative z-10">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <h3 className="text-lg font-semibold text-[#00FFFF] mb-1">
//               Stream #{stream.stream_id}
//             </h3>
//             <div className="flex items-center gap-2">
//               <span
//                 className={`px-2 py-1 rounded text-xs font-medium ${
//                   stream.isActive
//                     ? 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30'
//                     : 'bg-[#1A3A4A] text-[#A0A0A0]'
//                 }`}
//               >
//                 {stream.isActive ? 'Active' : 'Ended'}
//               </span>
//               {isSender && (
//                 <span className="px-2 py-1 rounded text-xs font-medium bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30">
//                   Sender
//                 </span>
//               )}
//               {isRecipient && (
//                 <span className="px-2 py-1 rounded text-xs font-medium bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30">
//                   Recipient
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stream Details */}
//         <div className="space-y-3 mb-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-[#A0A0A0] mb-1">Sender</p>
//               <p className="text-sm font-mono text-[#E0E0E0]">
//                 {formatAddress(stream.sender)}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-[#A0A0A0] mb-1">Recipient</p>
//               <p className="text-sm font-mono text-[#E0E0E0]">
//                 {formatAddress(stream.recipient)}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-[#A0A0A0] mb-1">Total Amount</p>
//               <p className="text-sm font-semibold text-[#E0E0E0]">
//                 {totalAmount.toFixed(6)} MOVE
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-[#A0A0A0] mb-1">Flow Rate</p>
//               <p className="text-sm font-semibold text-[#E0E0E0]">
//                 {flowRate.toFixed(8)} MOVE/s
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Real-Time Accrued Funds - Prominently featuring Electric Cyan */}
//         <div className="bg-gradient-to-r from-[#00FFFF]/20 to-[#00FFFF]/5 rounded-lg p-4 mb-4 border-2 border-[#00FFFF]/40 pulse-cyan">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm font-medium text-[#E0E0E0]">
//               Accrued Funds (Real-time)
//             </p>
//             <p className="text-2xl font-bold text-[#00FFFF]">
//               {localAccrued.toFixed(6)} MOVE
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <p className="text-xs text-[#A0A0A0]">
//               Available to Withdraw
//             </p>
//             <p className="text-sm font-semibold text-[#FF6600]">
//               {stream.availableToWithdraw.toFixed(6)} MOVE
//             </p>
//           </div>
//           <div className="mt-2">
//             <div className="w-full bg-[#0F2A3A] rounded-full h-2">
//               <div
//                 className="bg-[#00FFFF] h-2 rounded-full transition-all duration-1000"
//                 style={{ width: `${Math.min(100, stream.progress)}%` }}
//               />
//             </div>
//             <p className="text-xs text-[#A0A0A0] mt-1">
//               {stream.progress.toFixed(1)}% complete
//             </p>
//           </div>
//         </div>

//         {/* Time Remaining */}
//         {stream.isActive && (
//           <div className="mb-4">
//             <p className="text-xs text-[#A0A0A0] mb-1">Time Remaining</p>
//             <p className="text-sm font-medium text-[#E0E0E0]">
//               {formatTime(stream.timeRemaining)}
//             </p>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-3 bg-[#FF6600]/20 border border-[#FF6600] rounded-lg">
//             <p className="text-sm text-[#FF6600]">{error}</p>
//           </div>
//         )}

//         {/* Success Message */}
//         {transactionHash && (
//           <div className="mb-4 p-3 bg-[#00FFFF]/20 border border-[#00FFFF] rounded-lg">
//             <p className="text-sm text-[#00FFFF] mb-2 font-semibold">
//               Transaction successful!
//             </p>
//             <a
//               href={`https://explorer.movementnetwork.xyz/txn/${transactionHash}?network=testnet`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-[#00FFFF] hover:underline"
//             >
//               View on explorer →
//             </a>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           {((isRecipient && stream.availableToWithdraw > 0) || isDummy) && (
//             <button
//               onClick={handleWithdrawClick}
//               disabled={isLoading || isWithdrawing || isDummy} // Disable if dummy
//               className="flex-1 bg-[#00FFFF] hover:bg-[#00FFFF]/80 disabled:bg-[#1A3A4A] disabled:text-[#A0A0A0] text-[#081720] font-semibold py-2 px-4 rounded-lg transition-all border-2"
//               style={!(isLoading || isWithdrawing || isDummy) ? { borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' } : {}}
//             >
//               {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
//             </button>
//           )}
          
//           {isSender && stream.isActive && (
//             <button
//               onClick={handleCancelClick}
//               disabled={isLoading || isCancelling}
//               className="flex-1 bg-[#FF6600] hover:bg-[#FF6600]/80 disabled:bg-[#0F2A3A] disabled:text-[#A0A0A0] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg border-2"
//               style={!(isLoading || isCancelling) ? { borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' } : {}}
//             >
//               {isCancelling ? 'Cancelling...' : 'Cancel Stream'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }









/////////////////////////////////////

/**
 * components/StreamCard.tsx
 */
// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { Activity, ArrowUpRight, Clock } from 'lucide-react';

// interface StreamCardProps {
//   stream: {
//     amount: string;
//     withdrawn: string;
//     start_time: string;
//     end_time: string;
//     recipient: string;
//     coin_type: string;
//   };
// }

// export default function StreamCard({ stream }: StreamCardProps) {
//   const [currentAccrued, setCurrentAccrued] = useState(0);
  
//   // Parse data once
//   const stats = useMemo(() => {
//     const start = Number(stream.start_time);
//     const end = Number(stream.end_time);
//     const total = Number(stream.amount);
//     const duration = end - start;
//     const isMove = stream.coin_type.includes('aptos_coin');
//     const decimals = isMove ? 8 : 6;
//     const humanTotal = total / Math.pow(10, decimals);
    
//     return { start, end, total, duration, humanTotal, decimals };
//   }, [stream]);

//   useEffect(() => {
//     const updateTicker = () => {
//       const now = Math.floor(Date.now() / 1000);
      
//       if (now <= stats.start) {
//         setCurrentAccrued(0);
//       } else if (now >= stats.end) {
//         setCurrentAccrued(stats.total);
//       } else {
//         const elapsed = now - stats.start;
//         const accrued = (BigInt(stats.total) * BigInt(elapsed)) / BigInt(stats.duration);
//         setCurrentAccrued(Number(accrued));
//       }
//     };

//     const interval = setInterval(updateTicker, 1000); // UI update every second
//     updateTicker();
//     return () => clearInterval(interval);
//   }, [stats]);

//   const displayAmount = (currentAccrued / Math.pow(10, stats.decimals)).toFixed(6);
//   const progress = Math.min(100, ((currentAccrued / stats.total) * 100));

//   return (
//     <div className="relative group bg-[#0A1F2E] border border-[#1A3A4A] hover:border-[#00FFFF]/50 rounded-xl p-5 transition-all duration-300 overflow-hidden">
//       {/* Cyberpunk Background Grid Overlay */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
//       <div className="relative z-10">
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-[#00FFFF]/10 rounded-lg">
//               <Activity className="w-4 h-4 text-[#00FFFF] animate-pulse" />
//             </div>
//             <div>
//               <p className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Active Flow</p>
//               <p className="text-xs text-white font-mono truncate w-32">
//                 To: {stream.recipient.slice(0, 6)}...{stream.recipient.slice(-4)}
//               </p>
//             </div>
//           </div>
//           <ArrowUpRight className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#FF6600] transition-colors" />
//         </div>

//         {/* The Live Ticker */}
//         <div className="mb-4">
//           <div className="flex items-baseline gap-1">
//             <span className="text-3xl font-black text-white font-mono tracking-tighter tabular-nums">
//               {displayAmount}
//             </span>
//             <span className="text-xs font-bold text-[#00FFFF]">MOVE</span>
//           </div>
//           <p className="text-[10px] text-[#A0A0A0]">Total: {stats.humanTotal.toFixed(2)} tokens</p>
//         </div>

//         {/* Progress Bar */}
//         <div className="space-y-1.5">
//           <div className="flex justify-between text-[9px] uppercase font-black tracking-tighter">
//             <span className="text-[#00FFFF]">Streaming</span>
//             <span className="text-white">{progress.toFixed(1)}%</span>
//           </div>
//           <div className="h-1.5 w-full bg-[#1A3A4A] rounded-full overflow-hidden">
//             <div 
//               className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF6600] transition-all duration-1000 shadow-[0_0_10px_#00FFFF]"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         <div className="mt-4 flex items-center gap-4 text-[10px] text-[#A0A0A0] font-bold">
//             <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span>ETA: {new Date(stats.end * 1000).toLocaleTimeString()}</span>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }























/**
 * components/StreamCard.tsx
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Activity, ArrowUpRight, Clock } from 'lucide-react';

interface StreamCardProps {
  stream: {
    amount: string;
    withdrawn?: string;
    start_time: string;
    end_time: string;
    recipient: string;
    coin_type: string;
  };
}

export default function StreamCard({ stream }: StreamCardProps) {
  const [currentAccrued, setCurrentAccrued] = useState(0);
  
  // Parse data once
  const stats = useMemo(() => {
    const start = Number(stream.start_time);
    const end = Number(stream.end_time);
    const total = Number(stream.amount);
    const duration = end - start;
    const isMove = stream.coin_type.includes('aptos_coin');
    const decimals = isMove ? 8 : 6;
    const humanTotal = total / Math.pow(10, decimals);
    
    return { start, end, total, duration, humanTotal, decimals };
  }, [stream]);

  useEffect(() => {
    const updateTicker = () => {
      const now = Math.floor(Date.now() / 1000);
      
      if (now <= stats.start) {
        setCurrentAccrued(0);
      } else if (now >= stats.end) {
        setCurrentAccrued(stats.total);
      } else {
        const elapsed = now - stats.start;
        const accrued = (BigInt(stats.total) * BigInt(elapsed)) / BigInt(stats.duration);
        setCurrentAccrued(Number(accrued));
      }
    };

    const interval = setInterval(updateTicker, 1000); // UI update every second
    updateTicker();
    return () => clearInterval(interval);
  }, [stats]);

  const displayAmount = (currentAccrued / Math.pow(10, stats.decimals)).toFixed(6);
  const progress = Math.min(100, ((currentAccrued / stats.total) * 100));

  return (
    <div className="relative group bg-[#0A1F2E] border border-[#1A3A4A] hover:border-[#00FFFF]/50 rounded-xl p-5 transition-all duration-300 overflow-hidden">
      {/* Cyberpunk Background Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00FFFF]/10 rounded-lg">
              <Activity className="w-4 h-4 text-[#00FFFF] animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Active Flow</p>
              <p className="text-xs text-white font-mono truncate w-32">
                To: {stream.recipient.slice(0, 6)}...{stream.recipient.slice(-4)}
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#FF6600] transition-colors" />
        </div>

        {/* The Live Ticker */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono tracking-tighter tabular-nums">
              {displayAmount}
            </span>
            <span className="text-xs font-bold text-[#00FFFF]">MOVE</span>
          </div>
          <p className="text-[10px] text-[#A0A0A0]">Total: {stats.humanTotal.toFixed(2)} tokens</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] uppercase font-black tracking-tighter">
            <span className="text-[#00FFFF]">Streaming</span>
            <span className="text-white">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1A3A4A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00FFFF] to-[#FF6600] transition-all duration-1000 shadow-[0_0_10px_#00FFFF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[10px] text-[#A0A0A0] font-bold">
            <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>ETA: {new Date(stats.end * 1000).toLocaleTimeString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
}