// app/page.tsx
'use client';

import { useStreamData } from '@/hooks/useStreamData';
import { DUMMY_STREAMS } from '@/lib/dummyData';
import CreateStreamForm from '@/components/CreateStreamForm';
import StreamDashboard from '@/components/StreamDashboard';
import StreamHistory from '@/components/StreamHistory';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React from 'react';

export default function Home() {
  const { connected } = useWallet();
  const { streams, isLoading, aptosAddress } = useStreamData();
  const [ mounted, setMount ] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMount(true);
  }, []);

  // 1. Loading State
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F2A3A]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF]"></div>
      </div>
    );
  }

  // 2. Scenario: Connected but NO streams found -> Centered Form Only
  if (connected && streams.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F2A3A] py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Start Your First Stream</h1>
            <p className="text-[#A0A0A0] text-sm">No active streams detected for this wallet.</p>
          </div>
          <CreateStreamForm />
        </div>
      </div>
    );
  }

  // 3. Scenario: Not Connected (Show Dummies) OR Connected with Real Streams
  const displayStreams = connected ? streams : DUMMY_STREAMS;
  const isShowingDummy = !connected;

  return (
    <div className="min-h-screen bg-[#0F2A3A] py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          
          <div className="sticky top-8">
            <CreateStreamForm />
          </div>
  
          {/* This now works perfectly without TS errors */}
          <StreamDashboard 
            streams={displayStreams} 
            isDummy={isShowingDummy} 
          />
        </div>
  
        {/* History remains at the bottom */}
        <StreamHistory 
          streams={displayStreams} 
          userAddress={aptosAddress || '0x0'} 
          isDummy={isShowingDummy} 
        />
      </div>
    </div>
  );
}



// 'use client';

// import { useStreamData } from '@/hooks/useStreamData';
// import CreateStreamForm from '@/components/CreateStreamForm';
// import StreamDashboard from '@/components/StreamDashboard';
// import StreamHistory from '@/components/StreamHistory';
// import { useWallet } from '@aptos-labs/wallet-adapter-react';

// export default function Home() {
//   const { connected } = useWallet();
//   const { streams, isLoading, aptosAddress } = useStreamData();

//   // If loading and no streams, show the global loader
//   if (isLoading && streams.length === 0) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#0F2A3A]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0F2A3A] py-12 px-4">
//       <div className="max-w-7xl mx-auto space-y-12">
        
//         {/* Top Section: Action & Monitor */}
//         <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          
//           {/* Create Form - Static Width on Left */}
//           <div className="sticky top-8">
//             <CreateStreamForm />
//           </div>

//           {/* Live Dashboard - Fills remaining space on Right */}
//           <div>
//             <StreamDashboard />
//           </div>
//         </div>

//         {/* Bottom Section: History Registry */}
//         {connected && streams.length > 0 && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//             <StreamHistory streams={streams} userAddress={aptosAddress || ''} />
//           </div>
//         )}
        
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useStreamData } from '@/hooks/useStreamData';
// import CreateStreamForm from '@/components/CreateStreamForm';
// import StreamDashboard from '@/components/StreamDashboard';
// import StreamHistory from '@/components/StreamHistory'; // Add this
// import { AlertTriangle, Loader2 } from 'lucide-react';
// import { useWallet } from '@aptos-labs/wallet-adapter-react';

// export default function Home() {
//   const { connected } = useWallet();
//   const { streams, isLoading: streamsLoading } = useStreamData();

//   // FIX: Show loading while streamsLoading is TRUE
//   if (streamsLoading && streams.length === 0) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#0F2A3A]">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-[#00FFFF] mx-auto" />
//           <p className="mt-4 text-[#E0E0E0] font-bold tracking-widest uppercase text-xs">Synchronizing with Movement...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0F2A3A] py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header/Contract Warning */}
//         {!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
//           <div className="mb-6 bg-[#FF6600]/10 border-2 border-[#FF6600] rounded-xl p-4 flex items-center gap-4">
//              <AlertTriangle className="text-[#FF6600]" />
//              <p className="text-sm text-[#E0E0E0]">Contract Address Missing: Dashboard Offline</p>
//           </div>
//         )}

//         {/* Dynamic Layout */}
//         <div className={`grid grid-cols-1 gap-8 ${connected && streams.length > 0 ? 'lg:grid-cols-[60%_40%]' : 'max-w-2xl mx-auto'}`}>
          
//           {/* Main Panel */}
//           <div className="space-y-8">
//             <CreateStreamForm />
//             {connected && streams.length > 0 && (
//               <StreamHistory streams={streams} isLoading={streamsLoading} />
//             )}
//           </div>

//           {/* Sidebar Panel (Only if streams exist) */}
//           {connected && streams.length > 0 && (
//             <div className="space-y-6">
//               <StreamDashboard />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







// 'use client';

// import { useStreamData } from '@/hooks/useStreamData';
// import CreateStreamForm from '@/components/CreateStreamForm';
// import StreamDashboard from '@/components/StreamDashboard';
// import { AlertTriangle } from 'lucide-react';
// import { useWallet } from '@aptos-labs/wallet-adapter-react';

// export default function Home() {
//   const { connected } = useWallet();
  
//   // Get streams data to check if we should show two-panel layout
//   const { streams, isLoading: streamsLoading } = useStreamData();

  
//   if (!streamsLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#0F2A3A]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto"></div>
//           <p className="mt-4 text-[#E0E0E0]">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // If wallet not connected: centered form (80% width)
//   if (!connected) {
//     return (
//       <div className="min-h-screen bg-[#0F2A3A] py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Contract Status */}
//           {!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
//             <div className="mb-6 bg-[#DC2626]/20 border-l-4 border-[#FF6600] rounded-lg p-4 flex items-start space-x-3">
//               <AlertTriangle className="w-5 h-5 text-[#FF6600] flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm font-semibold text-[#E0E0E0] mb-1">
//                   Contract Not Deployed
//                 </p>
//                 <p className="text-sm text-[#A0A0A0]">
//                   Set <span className="font-mono text-[#00FFFF]">NEXT_PUBLIC_CONTRACT_ADDRESS</span> in <span className="font-mono">.env.local</span> to enable full functionality.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Centered Create Stream Form (PancakeSwap style) */}
//           <div className="flex justify-center">
//             <div className="w-full max-w-2xl">
//               <CreateStreamForm />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If wallet connected: check if there are streams to display
//   // Only show two-panel layout if streams exist, otherwise show only form
//   const hasStreams = !streamsLoading && streams.length > 0;

//   if (!hasStreams) {
//     // No streams: show only centered form
//     return (
//       <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Centered Create Stream Form */}
//           <div className="flex justify-center">
//             <div className="w-full max-w-2xl">
//               <CreateStreamForm />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Has streams: two-panel layout (60% Dashboard, 40% Form)
//   return (
//     <div className="min-h-screen bg-[#0F2A3A] py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Two-Panel Layout: Dashboard (Left 60%) | Form (Right 40%) */}
//         <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
//           {/* Left Panel: Stream Dashboard */}
//           <div className="order-2 lg:order-1">
//             <StreamDashboard />
//           </div>

//           {/* Right Panel: Create Stream Form */}
//           <div className="order-1 lg:order-2">
//             <CreateStreamForm />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

  // Check wallet connection status (from Privy or direct Aptos wallet)
  // useEffect(() => {
  //   const checkWallet = async () => {
  //     // Check Privy wallet first
  //     if (authenticated && user?.wallet?.address) {
  //       // setAptosAddress(user.wallet.address);
  //       // setIsWalletConnected(true);
  //       return;
  //     }

  //     // Fallback to direct Aptos wallet check
  //     if (typeof window !== 'undefined' && (window as any).aptos) {
  //       try {
  //         const wallet = (window as any).aptos;
  //         const account = await wallet.account();
  //         if (account?.address) {
  //           // setAptosAddress(account.address);
  //           // setIsWalletConnected(true);
  //         } else {
  //           // setIsWalletConnected(false);
  //         }
  //       } catch {
  //         // setIsWalletConnected(false);
  //       }
  //     } else {
  //       // setIsWalletConnected(false);
  //     }
  //   };
  //   checkWallet();
    
  //   // Listen for wallet connection changes
  //   const interval = setInterval(checkWallet, 2000);
  //   return () => clearInterval(interval);
  // }, [authenticated, user]);