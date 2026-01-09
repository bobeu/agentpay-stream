/**
 * components/Onboarding/OnboardingModal.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Wallet, Sparkles, TrendingUp, ShieldCheck, X } from 'lucide-react';
import Image from 'next/image';

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setRotation(r => r + 360), 4000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const steps = [
    {
      title: 'Protocol Nexus',
      icon: <Sparkles className="w-6 h-6" />,
      desc: 'Real-time liquidity streaming for the AI Agent economy.',
      details: [
        'Continuous second-by-second token settlement',
        'Programmable escrows on Movement L1',
        'Zero-latency balance updates'
      ]
    },
    {
      title: 'Sync Wallet',
      icon: <Wallet className="w-6 h-6" />,
      desc: 'Access the Movement network via your preferred portal.',
      details: [
        'Support for Petra, Nightly, and OKX',
        'Seamless Move-VM integration',
        'Secure signature authorization'
      ]
    },
    {
      title: 'Initiate Flow',
      icon: <TrendingUp className="w-6 h-6" />,
      desc: 'Define your parameters and launch a stream.',
      details: [
        'Input recipient address and total allocation',
        'Set the Flow Rate (tokens per second)',
        'Automated duration calculation'
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#071620]/95 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0A1F2E] border border-[#00FFFF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-8 pb-4 flex flex-col items-center">
          <div 
            className="relative w-24 h-24 mb-6 transition-transform duration-[2000ms] ease-in-out"
            style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-[#00FFFF]/20 rounded-full blur-2xl animate-pulse" />
            <Image src="/logo.png" alt="Logo" width={96} height={96} className="relative z-10 rounded-full" />
          </div>

          <div className="flex gap-1.5 mb-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#00FFFF]' : 'w-2 bg-[#1A3A4A]'}`} />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-8 min-h-[320px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#00FFFF]/10 rounded-lg text-[#00FFFF]">
              {steps[step].icon}
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              {steps[step].title}
            </h2>
          </div>

          <p className="text-[#E0E0E0] text-lg leading-relaxed mb-6 font-medium">
            {steps[step].desc}
          </p>

          <ul className="space-y-3">
            {steps[step].details.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#A0A0A0]">
                <ShieldCheck className="w-4 h-4 text-[#00FFFF] mt-0.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-[#0F2A3A] border-t border-[#00FFFF]/10 flex items-center justify-between">
          <button 
            onClick={() => step > 0 && setStep(step - 1)}
            className={`text-xs font-bold uppercase tracking-widest ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-[#A0A0A0] hover:text-white'}`}
          >
            Back
          </button>

          <button 
            onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}
            className="flex items-center gap-2 bg-[#FF6600] hover:bg-[#FF8533] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_4px_15px_rgba(255,102,0,0.3)]"
          >
            {step === steps.length - 1 ? 'START STREAMING' : 'NEXT PHASE'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Close Toggle */}
        <button onClick={onClose} className="absolute top-4 right-4 text-[#A0A0A0] hover:text-[#00FFFF]">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}






// /**
//  * OnboardingModal Component
//  * Interactive step-by-step guide for new users
//  * Mimics vibecheck Onboarding style with rotating logo
//  */

// 'use client';

// import { useState, useEffect } from 'react';
// import { ChevronLeft, CheckCircle2, ArrowRight, Wallet, Sparkles, TrendingUp, Coins } from 'lucide-react';
// import Image from 'next/image';

// interface OnboardingStep {
//   title: string;
//   icon: React.ReactNode;
//   content: React.ReactNode;
// }

// export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [logoRotation, setLogoRotation] = useState(0);

//   // Rotate logo every 3 seconds (same as vibecheck)
//   useEffect(() => {
//     if (!isOpen) return;
//     const interval = setInterval(() => {
//       setLogoRotation(prev => prev + 360);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [isOpen]);

//   const steps: OnboardingStep[] = [
//     {
//       title: 'Welcome to AgentPay Stream',
//       icon: <Sparkles className="w-8 h-8" />,
//       content: (
//         <div className="space-y-4">
//           <p className="text-lg text-[#A0A0A0]">
//             AgentPay Stream enables real-time, continuous payments to AI agents and services on Movement L1.
//           </p>
//           <div className="space-y-2">
//             <div className="flex items-start gap-3">
//               <CheckCircle2 className="w-5 h-5 text-[#00FFFF] mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-[#A0A0A0]">
//                 Create payment streams that automatically distribute funds over time
//               </p>
//             </div>
//             <div className="flex items-start gap-3">
//               <CheckCircle2 className="w-5 h-5 text-[#00FFFF] mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-[#A0A0A0]">
//                 Real-time accrued funds tracking with live updates
//               </p>
//             </div>
//             <div className="flex items-start gap-3">
//               <CheckCircle2 className="w-5 h-5 text-[#00FFFF] mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-[#A0A0A0]">
//                 Withdraw or cancel streams anytime with full control
//               </p>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Connect Your Wallet',
//       icon: <Wallet className="w-8 h-8" />,
//       content: (
//         <div className="space-y-4">
//           <p className="text-lg text-[#A0A0A0]">
//             Connect your wallet to start creating payment streams on Movement L1.
//           </p>
//           <div className="space-y-3">
//             <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0F2A3A]/50">
//               <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0">
//                 <span className="text-[#00FFFF] font-bold">1</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1 text-[#E0E0E0]">Click Connect Wallet</h4>
//                 <p className="text-sm text-[#A0A0A0]">
//                   Click the "Connect Wallet" button in the top navigation bar
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0F2A3A]/50">
//               <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0">
//                 <span className="text-[#00FFFF] font-bold">2</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1 text-[#E0E0E0]">Choose Wallet Provider</h4>
//                 <p className="text-sm text-[#A0A0A0]">
//                   Select from Aptos (Petra), Nightly, OKX, or other supported wallets
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0F2A3A]/50">
//               <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 flex items-center justify-center flex-shrink-0">
//                 <span className="text-[#00FFFF] font-bold">3</span>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-1 text-[#E0E0E0]">Approve Connection</h4>
//                 <p className="text-sm text-[#A0A0A0]">
//                   Approve the connection request in your wallet extension
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Create a Payment Stream',
//       icon: <TrendingUp className="w-8 h-8" />,
//       content: (
//         <div className="space-y-4">
//           <p className="text-lg text-[#A0A0A0]">
//             Fill out the stream creation form to start streaming payments.
//           </p>
//           <div className="space-y-3">
//             <div className="p-4 rounded-lg border border-[#00FFFF]/20 bg-[#00FFFF]/5">
//               <div className="flex items-center gap-2 mb-2">
//                 <Coins className="w-5 h-5 text-[#00FFFF]" />
//                 <h4 className="font-semibold text-[#E0E0E0]">Required Fields</h4>
//               </div>
//               <ul className="text-sm text-[#A0A0A0] space-y-1 ml-4 list-disc">
//                 <li><span className="text-[#00FFFF]">Recipient Address:</span> The Aptos address of the AI agent/service</li>
//                 <li><span className="text-[#00FFFF]">Total Amount:</span> The total APT you want to stream</li>
//                 <li><span className="text-[#00FFFF]">Flow Rate:</span> APT per second for the stream</li>
//               </ul>
//             </div>
//             <div className="p-4 rounded-lg border border-[#FF6600]/20 bg-[#FF6600]/5">
//               <p className="text-sm text-[#A0A0A0]">
//                 <strong className="text-[#FF6600]">Tip:</strong> The form automatically calculates stream duration based on amount and flow rate.
//               </p>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Manage Your Streams',
//       icon: <Coins className="w-8 h-8" />,
//       content: (
//         <div className="space-y-4">
//           <p className="text-lg text-[#A0A0A0]">
//             Monitor and manage your active payment streams from the dashboard.
//           </p>
//           <div className="space-y-3">
//             <div className="p-4 rounded-lg border border-[#00FFFF]/20 bg-[#00FFFF]/5">
//               <h4 className="font-semibold mb-2 text-[#00FFFF]">Real-time Counter</h4>
//               <p className="text-sm text-[#A0A0A0]">
//                 Watch accrued funds update every second with the Electric Cyan counter
//               </p>
//             </div>
//             <div className="p-4 rounded-lg border border-[#FF6600]/20 bg-[#FF6600]/5">
//               <h4 className="font-semibold mb-2 text-[#FF6600]">Stream Actions</h4>
//               <ul className="text-sm text-[#A0A0A0] space-y-1 ml-4 list-disc">
//                 <li><strong>Withdraw:</strong> As recipient, withdraw available funds anytime</li>
//                 <li><strong>Cancel:</strong> As sender, cancel active streams and get refunds</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   const nextStep = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       onClose();
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-[#0F2A3A] overflow-y-auto">
//       <div className="container max-w-md mx-auto px-4 py-6">
//         {/* Logo at top center with rotation animation (same as vibecheck) */}
//         <div className="flex justify-center pt-8 pb-4">
//           <div className="relative">
//             <div 
//               className="relative w-32 h-32"
//               style={{
//                 transform: `perspective(1000px) rotateY(${logoRotation}deg)`,
//                 transition: 'transform 3s ease-in-out',
//                 transformStyle: 'preserve-3d',
//               }}
//             >
//               <div className="relative w-full h-full animate-pulse">
//                 <Image
//                   src="/logo.png"
//                   alt="AgentPay Stream Logo"
//                   width={128}
//                   height={128}
//                   className="object-contain drop-shadow-lg rounded-full"
//                   priority
//                 />
//                 {/* Glow effect */}
//                 <div className="absolute inset-0 bg-[#00FFFF]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Progress indicator */}
//         <div className="mb-6">
//           <div className="flex gap-2 justify-center">
//             {steps.map((_, index) => (
//               <div
//                 key={index}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${
//                   index === currentStep
//                     ? 'bg-[#00FFFF] w-8'
//                     : index < currentStep
//                     ? 'bg-[#00FFFF]/50 w-4'
//                     : 'bg-[#1A3A4A] w-2'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Content Card */}
//         <div className="pb-20">
//           <div className="w-full p-6 bg-[#0A1F2E]/80 backdrop-blur-sm border border-[#00FFFF]/20 rounded-xl shadow-xl">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 rounded-lg bg-[#00FFFF]/10 text-[#00FFFF]">
//                 {steps[currentStep].icon}
//               </div>
//               <h2 className="text-2xl font-bold text-[#00FFFF]">
//                 {steps[currentStep].title}
//               </h2>
//             </div>

//             <div className="min-h-[300px]">
//               {steps[currentStep].content}
//             </div>

//             {/* Navigation buttons */}
//             <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#00FFFF]/20">
//               <button
//                 onClick={prevStep}
//                 disabled={currentStep === 0}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
//                   currentStep === 0
//                     ? 'text-[#A0A0A0]/50 cursor-not-allowed'
//                     : 'text-[#00FFFF] hover:bg-[#00FFFF]/10'
//                 }`}
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 Previous
//               </button>

//               <div className="text-sm text-[#A0A0A0]">
//                 {currentStep + 1} of {steps.length}
//               </div>

//               <button
//                 onClick={nextStep}
//                 className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-[#FF6600] hover:bg-[#FF6600]/80 text-white transition-all shadow-lg"
//               >
//                 {currentStep === steps.length - 1 ? (
//                   <>
//                     Continue to App
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 ) : (
//                   <>
//                     Next
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Background decorative elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00FFFF]/5 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00FFFF]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
//       </div>
//     </div>
//   );
// }

