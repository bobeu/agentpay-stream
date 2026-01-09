/**
 * components/Onboarding/OnboardingTrigger.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import OnboardingModal from './OnboardingModal';

export default function OnboardingTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('agentpay_onboarding_v1');
    if (!hasSeen) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeAndSave = () => {
    setIsOpen(false);
    localStorage.setItem('agentpay_onboarding_v1', 'true');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#0A1F2E] border border-[#00FFFF]/30 text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute inset-0 rounded-full bg-[#00FFFF]/5 group-hover:bg-[#00FFFF]/10 transition-colors" />
        <HelpCircle className="w-6 h-6 relative z-10" />
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all bg-[#0A1F2E] text-[#00FFFF] text-[10px] font-bold px-3 py-1 rounded border border-[#00FFFF]/30 whitespace-nowrap uppercase tracking-widest">
          Protocol Guide
        </span>
      </button>

      <OnboardingModal isOpen={isOpen} onClose={closeAndSave} />
    </>
  );
}






// /**
//  * OnboardingTrigger Component
//  * Handles auto-popup on first visit and floating help button
//  */

// 'use client';

// import { HelpCircle } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import OnboardingModal from './OnboardingModal';

// export default function OnboardingTrigger() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

//   // Check if user has seen onboarding on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const seen = localStorage.getItem('agentpay-onboarding-seen');
//       if (!seen) {
//         setHasSeenOnboarding(false);
//         setIsOpen(true);
//       }
//     }
//   }, []);

//   const handleClose = () => {
//     setIsOpen(false);
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('agentpay-onboarding-seen', 'true');
//       setHasSeenOnboarding(true);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF6600] hover:bg-[#FF6600]/80 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
//         aria-label="Open onboarding guide"
//       >
//         <HelpCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
//       </button>
//       <OnboardingModal isOpen={isOpen} onClose={handleClose} />
//     </>
//   );
// }

