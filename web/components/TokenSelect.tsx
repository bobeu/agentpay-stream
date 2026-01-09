/**
 * components/TokenSelect.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import { useAptosContext } from '@/context/AptosContext';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
import { ChevronDown, Coins } from 'lucide-react';


// Define the strict type required by Aptos SDK V2
export type MoveCoinType = `${string}::${string}::${string}`;

export interface Token {
  symbol: string;
  type: MoveCoinType;
  decimals: number;
  icon?: string;
  name?: string;
}

export const SUPPORTED_TOKENS : Token[] = [
  { symbol: 'MOVE', name: 'Movement', type: '0x1::aptos_coin::AptosCoin', decimals: 8 },
  { symbol: 'USDC', name: 'USD Coin', type: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC', decimals: 6 },
];

interface TokenSelectProps {
  selectedToken: typeof SUPPORTED_TOKENS[0];
  onSelect: (token: typeof SUPPORTED_TOKENS[0]) => void;
}

export default function TokenSelect({ selectedToken, onSelect }: TokenSelectProps) {
  const { aptosClient } = useAptosContext();
  const { address, isConnected } = useUnifiedWallet();
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !address) return;
      
      const newBalances: Record<string, string> = {};
      for (const token of SUPPORTED_TOKENS) {
        try {
          const resources = await aptosClient.getAccountCoinAmount({
            accountAddress: address.toString(),
            coinType: token.type as `${string}::${string}::${string}`,
          });
          newBalances[token.symbol] = (Number(resources) / Math.pow(10, token.decimals)).toFixed(2);
        } catch (e) {
          newBalances[token.symbol] = '0.00';
        }
      }
      setBalances(newBalances);
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [address, isConnected, aptosClient]);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-[#E0E0E0] mb-1.5 uppercase tracking-wider">
        Select Asset
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg hover:border-[#00FFFF]/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#00FFFF]/10 flex items-center justify-center">
            <Coins className="w-4 h-4 text-[#00FFFF]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-none">{selectedToken.symbol}</p>
            <p className="text-[10px] text-[#A0A0A0] mt-1">Balance: {balances[selectedToken.symbol] || '0.00'}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#A0A0A0] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A3A4A] border-2 border-[#00FFFF] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {SUPPORTED_TOKENS.map((token) => (
            <button
              key={token.type}
              type="button"
              onClick={() => {
                onSelect(token);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#00FFFF]/10 border-b border-[#00FFFF]/10 last:border-0 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-white">{token.symbol}</span>
                <span className="text-[10px] text-[#A0A0A0]">{token.name}</span>
              </div>
              <span className="text-xs font-mono text-[#00FFFF]">
                {balances[token.symbol] || '0.00'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}