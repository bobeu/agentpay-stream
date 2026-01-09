/**
 * components/UnifiedWalletModal.tsx
 */
'use client';

import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
import { X, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface UnifiedWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnifiedWalletModal({ isOpen, onClose }: UnifiedWalletModalProps) {
  if (!isOpen) return null;
  const { isConnected, address, walletName, disconnect, connect, availableWallets } = useUnifiedWallet();

  // const wallets = [
  //   { name: 'Nightly', icon: '/nightly.png', description: 'Multi-chain Pro' },
  //   { name: 'Petra', icon: '/petra.png', description: 'Aptos Native' },
  //   { name: 'Martian', icon: '/martian.png', description: 'Move Specialist' },
  // ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#081720]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0A1F2E] border-2 border-[#00FFFF] rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.2)] overflow-hidden animate-in zoom-in duration-200">
        
        {/* Terminal Header */}
        <div className="bg-[#1A3A4A] p-4 border-b border-[#00FFFF]/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00FFFF]" />
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Auth_Protocol_v2.0</span>
          </div>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Establish <span className="text-[#FF6600]">Link</span>
            </h2>
            <p className="text-[#A0A0A0] text-xs mt-1">Select a signature provider to enter the network.</p>
          </div>

          {/* Wallet List */}
          <div className="space-y-3">
            {availableWallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => { connect(wallet.name); onClose(); }}
                className="w-full group relative flex items-center gap-4 p-4 bg-[#142C3D] hover:bg-[#1A3A4A] border border-[#1A3A4A] hover:border-[#00FFFF] rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#0A1F2E] rounded-lg border border-[#1A3A4A] group-hover:border-[#00FFFF]/50 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                   {/* Fallback icon if Image fails */}
                   <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 text-[#00FFFF] opacity-20 absolute" />
                   {/* <Zap className="w-6 h-6 text-[#00FFFF] opacity-20 absolute" /> */}
                   <div className="w-8 h-8 relative z-10 bg-[#00FFFF]/10 rounded" />
                </div>
                
                <div className="text-left flex-1">
                  <h3 className="text-white font-bold uppercase tracking-tight group-hover:text-[#00FFFF] transition-colors">
                    {wallet.name} Wallet
                  </h3>
                  {wallet.readyState === "Installed" && (
                    <span className="text-[9px] font-bold bg-[#00FFFF]/10 text-[#00FFFF] px-2 py-1 rounded border border-[#00FFFF]/20">INSTALLED</span>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]" />
                </div>
              </button>
            ))}
          </div>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t border-[#1A3A4A] flex items-center justify-center gap-4 opacity-50">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00FFFF]" />
              <span className="text-[10px] text-white font-bold uppercase">Encrypted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#1A3A4A]" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Movement L1 Verified</span>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#FF6600] m-2 pointer-events-none" />
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#FF6600] m-2 pointer-events-none opacity-20" />
      </div>
    </div>
  );
}





// 'use client';

// import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
// import { useAccountBalance } from '@/hooks/useAccountBalance';
// import { X, Zap, LogOut, Copy, ExternalLink, ShieldCheck, Wallet } from 'lucide-react';
// import { useState } from 'react';

// export default function UnifiedWalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const { isConnected, address, walletName, disconnect, connect, availableWallets } = useUnifiedWallet();
//   const { balance, isLoading: balanceLoading } = useAccountBalance();
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const handleCopy = () => {
//     if (address) {
//       navigator.clipboard.writeText(address);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#081720]/80 backdrop-blur-sm">
//       <div className="w-full max-w-md bg-[#1A3A4A] border-2 border-[#00FFFF] rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
        
//         {/* Header */}
//         <div className="p-5 border-b border-[#00FFFF]/20 flex justify-between items-center">
//           <h2 className="text-xl font-bold text-[#00FFFF] flex items-center gap-2 uppercase tracking-tighter">
//             {isConnected ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5 fill-[#00FFFF]" />}
//             {isConnected ? 'Account' : 'Select Wallet'}
//           </h2>
//           <button onClick={onClose} className="hover:rotate-90 transition-transform"><X className="w-6 h-6 text-[#A0A0A0]" /></button>
//         </div>

//         <div className="p-6">
//           {isConnected ? (
//             /* --- CONNECTED VIEW --- */
//             <div className="space-y-5">
//               <div className="bg-[#0F2A3A] p-4 rounded-xl border border-[#00FFFF]/20">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <p className="text-[10px] font-bold text-[#00FFFF] uppercase tracking-widest mb-1">{walletName}</p>
//                     <p className="text-lg font-mono text-white">
//                       {address?.slice(0, 6)}...{address?.slice(-6)}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={handleCopy} className="p-2 bg-[#1A3A4A] rounded-lg text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#081720] transition-all">
//                       {copied ? <span className="text-[10px] font-bold">DONE</span> : <Copy className="w-4 h-4" />}
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-between items-end pt-4 border-t border-white/5">
//                   <span className="text-xs text-[#A0A0A0]">Balance</span>
//                   <div className="text-right">
//                     <p className="text-2xl font-black text-white leading-none">
//                       {balanceLoading ? '...' : balance?.toFixed(4)} <span className="text-xs text-[#00FFFF]">MOVE</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => { disconnect(); onClose(); }}
//                 className="w-full py-4 bg-transparent border-2 border-[#FF6600] text-[#FF6600] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#FF6600] hover:text-white transition-all shadow-[4px_4px_0px_#FF6600]/20 active:translate-y-1"
//               >
//                 <LogOut className="w-5 h-5" /> DISCONNECT
//               </button>
//             </div>
//           ) : (
//             /* --- WALLET LIST VIEW --- */
//             <div className="space-y-3">
//               {availableWallets.map((w) => (
//                 <button
//                   key={w.name}
//                   onClick={() => { connect(w.name); onClose(); }}
//                   className="w-full flex items-center justify-between p-4 bg-[#0F2A3A] hover:bg-[#153448] border border-white/10 hover:border-[#00FFFF]/50 rounded-xl group transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img src={w.icon} alt={w.name} className="w-8 h-8 rounded-lg" />
//                     <span className="font-bold text-white group-hover:text-[#00FFFF]">{w.name}</span>
//                   </div>
//                   {w.readyState === "Installed" && (
//                     <span className="text-[9px] font-bold bg-[#00FFFF]/10 text-[#00FFFF] px-2 py-1 rounded border border-[#00FFFF]/20">INSTALLED</span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
