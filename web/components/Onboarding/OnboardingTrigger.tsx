/**
 * OnboardingTrigger Component
 * Handles auto-popup on first visit and floating help button
 */

'use client';

import { HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import OnboardingModal from './OnboardingModal';

export default function OnboardingTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  // Check if user has seen onboarding on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('agentpay-onboarding-seen');
      if (!seen) {
        setHasSeenOnboarding(false);
        setIsOpen(true);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentpay-onboarding-seen', 'true');
      setHasSeenOnboarding(true);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF6600] hover:bg-[#FF6600]/80 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="Open onboarding guide"
      >
        <HelpCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>
      <OnboardingModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

