/**
 * Header Component
 * Fixed top header with gradient title
 */

'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#12121F]/95 backdrop-blur-sm border-b border-[#2D2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <h1 className="text-2xl font-bold text-stream-gradient">
                AgentPay Stream
              </h1>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stream-gradient opacity-60"></div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

