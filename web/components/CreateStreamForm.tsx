// /**
//  * CreateStreamForm Component
//  * Form for creating new payment streams on Movement L1
//  */

// 'use client';

// import { useState, FormEvent } from 'react';
// import { useStreamCreation } from '@/hooks/useStreamCreation';
// import { isValidAptosAddress } from '@/lib/privyToAptos';
// import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';

// export default function CreateStreamForm() {
//   const { createStreamTransaction, isLoading, error, transactionHash, reset } = useStreamCreation();
//   const { isConnected, connect, walletName } = useUnifiedWallet();

//   const [recipientAddress, setRecipientAddress] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [flowRate, setFlowRate] = useState('');
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   // Validate form fields
//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};

//     if (!recipientAddress.trim()) {
//       errors.recipientAddress = 'Recipient address is required';
//     } else if (!isValidAptosAddress(recipientAddress.trim())) {
//       errors.recipientAddress = 'Invalid Aptos address format';
//     }

//     const amount = parseFloat(totalAmount);
//     if (!totalAmount.trim()) {
//       errors.totalAmount = 'Total amount is required';
//     } else if (isNaN(amount) || amount <= 0) {
//       errors.totalAmount = 'Total amount must be a positive number';
//     }

//     const rate = parseFloat(flowRate);
//     if (!flowRate.trim()) {
//       errors.flowRate = 'Flow rate is required';
//     } else if (isNaN(rate) || rate <= 0) {
//       errors.flowRate = 'Flow rate must be a positive number';
//     } else if (rate > amount) {
//       errors.flowRate = 'Flow rate cannot exceed total amount';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     if (!isConnected) {
//       if(walletName && walletName !== ''){
//         connect(walletName);
//       } else {
//         return;
//       }
//     }
  
//     const result = await createStreamTransaction({
//       recipientAddress: recipientAddress.trim(),
//       totalAmount: parseFloat(totalAmount),
//       flowRate: parseFloat(flowRate),
//     });
  
//     if (result) {
//       // Optionally clear form or redirect user
//       setRecipientAddress('');
//       setTotalAmount('');
//       setFlowRate('');
//     }
//   };

//   const isFormValid = 
//     recipientAddress.trim() !== '' &&
//     totalAmount.trim() !== '' &&
//     flowRate.trim() !== '' &&
//     !isNaN(parseFloat(totalAmount)) &&
//     parseFloat(totalAmount) > 0 &&
//     !isNaN(parseFloat(flowRate)) &&
//     parseFloat(flowRate) > 0 &&
//     parseFloat(flowRate) <= parseFloat(totalAmount);

//   const isSubmitDisabled = !isConnected || isLoading || !isFormValid;

//   // Calculate duration for display
//   const calculatedDuration = 
//     totalAmount && flowRate && 
//     !isNaN(parseFloat(totalAmount)) && 
//     !isNaN(parseFloat(flowRate)) && 
//     parseFloat(flowRate) > 0
//       ? (parseFloat(totalAmount) / parseFloat(flowRate)).toFixed(2)
//       : null;

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-[#1A3A4A] rounded-xl border-2 shadow-2xl p-5 relative overflow-hidden" style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
//         {/* Cyan border glow */}
//         <div className="absolute inset-0 rounded-xl cyan-glow opacity-20 pointer-events-none"></div>
        
//         <div className="relative z-10">
//           <h2 className="text-xl font-bold mb-5 text-[#00FFFF]">
//             Create Payment Stream
//           </h2>

//           {!isConnected && (
//             <div className="mb-5 p-3 bg-[#0F2A3A] border border-[#00FFFF]/20 rounded-lg text-center">
//               <p className="text-xs text-[#E0E0E0] mb-2">
//                 Please connect your wallet to create a stream.
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Recipient Address */}
//             <div>
//               <label
//                 htmlFor="recipientAddress"
//                 className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
//               >
//                 Recipient Address
//               </label>
//               <input
//                 type="text"
//                 id="recipientAddress"
//                 value={recipientAddress}
//                 onChange={(e) => {
//                   setRecipientAddress(e.target.value);
//                   if (formErrors.recipientAddress) {
//                     setFormErrors({ ...formErrors, recipientAddress: '' });
//                   }
//                 }}
//                 placeholder="0x..."
//                 className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
//                   formErrors.recipientAddress
//                     ? 'border-[#FF6600]'
//                     : 'border-[#1A3A4A]'
//                 }`}
//                 disabled={isLoading}
//               />
//               {formErrors.recipientAddress && (
//                 <p className="mt-1 text-xs text-[#FF6600]">
//                   {formErrors.recipientAddress}
//                 </p>
//               )}
//               <p className="mt-1 text-xs text-[#A0A0A0]">
//                 The Move address of the AI agent or service to receive payments
//               </p>
//             </div>

//             {/* Total Amount */}
//             <div>
//               <label
//                 htmlFor="totalAmount"
//                 className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
//               >
//                 Total Amount (MOVE)
//               </label>
//               <input
//                 type="number"
//                 id="totalAmount"
//                 step="0.00000001"
//                 min="0"
//                 value={totalAmount}
//                 onChange={(e) => {
//                   setTotalAmount(e.target.value);
//                   if (formErrors.totalAmount) {
//                     setFormErrors({ ...formErrors, totalAmount: '' });
//                   }
//                 }}
//                 placeholder="100.0"
//                 className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
//                   formErrors.totalAmount
//                     ? 'border-[#FF6600]'
//                     : 'border-[#1A3A4A]'
//                 }`}
//                 disabled={isLoading}
//               />
//               {formErrors.totalAmount && (
//                 <p className="mt-1 text-xs text-[#FF6600]">
//                   {formErrors.totalAmount}
//                 </p>
//               )}
//               <p className="mt-1 text-xs text-[#A0A0A0]">
//                 The total amount of MOVE to deposit into the stream
//               </p>
//             </div>

//             {/* Flow Rate */}
//             <div>
//               <label
//                 htmlFor="flowRate"
//                 className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
//               >
//                 Flow Rate (MOVE/Second)
//               </label>
//               <input
//                 type="number"
//                 id="flowRate"
//                 step="0.00000001"
//                 min="0"
//                 value={flowRate}
//                 onChange={(e) => {
//                   setFlowRate(e.target.value);
//                   if (formErrors.flowRate) {
//                     setFormErrors({ ...formErrors, flowRate: '' });
//                   }
//                 }}
//                 placeholder="0.0001"
//                 className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
//                   formErrors.flowRate
//                     ? 'border-[#FF6600]'
//                     : 'border-[#1A3A4A]'
//                 }`}
//                 disabled={isLoading}
//               />
//               {formErrors.flowRate && (
//                 <p className="mt-1 text-xs text-[#FF6600]">
//                   {formErrors.flowRate}
//                 </p>
//               )}
//               <p className="mt-1 text-xs text-[#A0A0A0]">
//                 The rate at which tokens will be streamed per second
//               </p>
//               {calculatedDuration && (
//                 <div className="mt-2 p-2 bg-[#0F2A3A] border border-[#FF6600]/30 rounded-lg">
//                   <p className="text-xs font-semibold text-[#FF6600]">
//                     Stream duration: ~{calculatedDuration} seconds
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="w-full overflow-auto p-3 flex flex-col justify-center bg-[#FF6600]/20 border border-[#FF6600] rounded-lg">
//                 <p className="text-xs text-[#FF6600]">{error}</p>
//               </div>
//             )}

//             {/* Success Message */}
//             {transactionHash && (
//               <div className="p-3 bg-[#00FFFF]/20 border border-[#00FFFF] rounded-lg">
//                 <p className="text-xs text-[#00FFFF] mb-1 font-semibold">
//                   Stream created successfully!
//                 </p>
//                 <a
//                   href={`https://explorer.movementnetwork.xyz/txn/${transactionHash}?network=testnet`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-xs text-[#00FFFF] hover:underline"
//                 >
//                   View transaction on explorer →
//                 </a>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitDisabled}
//               className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
//                 isSubmitDisabled
//                   ? 'bg-[#0F2A3A] text-[#A0A0A0] cursor-not-allowed border border-[#1A3A4A]'
//                   : 'bg-[#FF6600] hover:bg-[#FF6600]/80 text-white border-2'
//               }`}
//               style={!isSubmitDisabled ? { borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' } : {}}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Creating Stream...
//                 </span>
//               ) : (
//                 'Create Stream'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


/**
 * CreateStreamForm Component (Updated)
 */
// 'use client';

// import { useState, FormEvent } from 'react';
// import { useStreamCreation } from '@/hooks/useStreamCreation';
// import { isValidAptosAddress } from '@/lib/privyToAptos';
// import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
// import TokenSelect, { SUPPORTED_TOKENS } from './TokenSelect';
// import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react';

// export default function CreateStreamForm() {
//   const { createStreamTransaction, isLoading, error, transactionHash } = useStreamCreation();
//   const { isConnected, walletName } = useUnifiedWallet();

//   const [recipientAddress, setRecipientAddress] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [flowRate, setFlowRate] = useState('');
//   const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};
//     if (!isValidAptosAddress(recipientAddress.trim())) errors.recipientAddress = 'Invalid address';
//     if (!totalAmount || parseFloat(totalAmount) <= 0) errors.totalAmount = 'Invalid amount';
//     if (!flowRate || parseFloat(flowRate) <= 0) errors.flowRate = 'Invalid rate';
//     if (parseFloat(flowRate) > parseFloat(totalAmount)) errors.flowRate = 'Rate > Total';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     // Pass the generic coin type to the transaction hook
//     await createStreamTransaction({
//       recipientAddress: recipientAddress.trim(),
//       totalAmount: parseFloat(totalAmount),
//       flowRate: parseFloat(flowRate),
//       coinType: selectedToken.type, // Critical for Generic Move Call
//     });
//   };

//   const isFormValid = recipientAddress && totalAmount && flowRate && !Object.keys(formErrors).length;

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-[#1A3A4A] rounded-xl border-2 shadow-2xl p-6 relative overflow-hidden" 
//            style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
        
//         <div className="relative z-10 space-y-5">
//           <header>
//             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
//               Initiate <span className="text-[#00FFFF]">Payment Stream</span>
//             </h2>
//             <div className="h-1 w-12 bg-[#FF6600] mt-1" />
//           </header>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Asset Selection */}
//             <TokenSelect 
//               selectedToken={selectedToken} 
//               onSelect={setSelectedToken} 
//             />

//             {/* Recipient */}
//             <div>
//               <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase">Recipient Address</label>
//               <input
//                 type="text"
//                 value={recipientAddress}
//                 onChange={(e) => setRecipientAddress(e.target.value)}
//                 placeholder="0x..."
//                 className="w-full px-4 py-2 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg text-white font-mono text-sm focus:border-[#00FFFF] outline-none transition-all"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               {/* Total Amount */}
//               <div>
//                 <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase">Total {selectedToken.symbol}</label>
//                 <input
//                   type="number"
//                   value={totalAmount}
//                   onChange={(e) => setTotalAmount(e.target.value)}
//                   className="w-full px-4 py-2 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg text-white font-mono text-sm outline-none focus:border-[#00FFFF]"
//                 />
//               </div>

//               {/* Flow Rate */}
//               <div>
//                 <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase">Rate (/sec)</label>
//                 <input
//                   type="number"
//                   value={flowRate}
//                   onChange={(e) => setFlowRate(e.target.value)}
//                   className="w-full px-4 py-2 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg text-white font-mono text-sm outline-none focus:border-[#00FFFF]"
//                 />
//               </div>
//             </div>

//             {/* Visual Feedback: Duration */}
//             {totalAmount && flowRate && (
//               <div className="p-3 bg-[#0A1F2E] border-l-4 border-[#FF6600] rounded-r-lg">
//                 <p className="text-[10px] text-[#A0A0A0] uppercase font-bold">Estimated Duration</p>
//                 <p className="text-sm font-mono text-white">
//                   {(parseFloat(totalAmount) / parseFloat(flowRate)).toFixed(0)} Seconds
//                 </p>
//               </div>
//             )}

//             {/* Error States */}
//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs">
//                 <AlertTriangle className="w-4 h-4" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Success States */}
//             {transactionHash && (
//               <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
//                 <p className="text-xs text-green-500 font-bold mb-1">Stream Initialized!</p>
//                 <a href={`https://explorer.movementnetwork.xyz/txn/${transactionHash}`} 
//                    target="_blank" className="text-[10px] text-[#00FFFF] flex items-center gap-1 hover:underline">
//                   View On Explorer <ExternalLink className="w-3 h-3" />
//                 </a>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={!isConnected || isLoading || !isFormValid}
//               className="w-full group relative py-4 bg-[#FF6600] disabled:bg-[#1A3A4A] disabled:opacity-50 text-white font-black uppercase italic tracking-widest rounded-lg transition-all active:scale-95"
//               style={isConnected && !isLoading ? { borderRight: '6px solid #00FFFF', borderBottom: '6px solid #00FFFF' } : {}}
//             >
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin mx-auto" />
//               ) : (
//                 'Confirm Stream'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



/**
 * CreateStreamForm Component (Connected & Typed)
 */
'use client';

import { useState, FormEvent } from 'react';
import { useStreamCreation } from '@/hooks/useStreamCreation';
import { isValidAptosAddress } from '@/lib/privyToAptos';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
import TokenSelect, { SUPPORTED_TOKENS, Token } from './TokenSelect';
import { Loader2, ExternalLink, AlertTriangle, Zap } from 'lucide-react';

export default function CreateStreamForm() {
  const { createStreamTransaction, isLoading, error, transactionHash } = useStreamCreation();
  const { isConnected } = useUnifiedWallet();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!isValidAptosAddress(recipientAddress.trim())) errors.recipientAddress = 'Invalid address';
    if (!totalAmount || parseFloat(totalAmount) <= 0) errors.totalAmount = 'Invalid amount';
    if (!flowRate || parseFloat(flowRate) <= 0) errors.flowRate = 'Invalid rate';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert human amount to blockchain units (Octas) based on token decimals
    const multiplier = Math.pow(10, selectedToken.decimals);
    const amountInUnits = Math.floor(parseFloat(totalAmount) * multiplier);
    const rateInUnits = Math.floor(parseFloat(flowRate) * multiplier);

    await createStreamTransaction({
      recipientAddress: recipientAddress.trim(),
      totalAmount: amountInUnits, // Integer units
      flowRate: rateInUnits,      // Integer units/sec
      coinType: selectedToken.type, 
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1A3A4A] rounded-xl border-2 shadow-2xl p-6 relative overflow-hidden" 
           style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
        
        <div className="relative z-10 space-y-5">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                Initiate <span className="text-[#00FFFF]">Payment Stream</span>
              </h2>
              <div className="h-1 w-12 bg-[#FF6600] mt-1" />
            </div>
            <Zap className="w-5 h-5 text-[#00FFFF] animate-pulse" />
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Asset Selection Component */}
            <TokenSelect 
              selectedToken={selectedToken} 
              onSelect={setSelectedToken} 
            />

            {/* Recipient */}
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-widest">Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className={`w-full px-4 py-2 bg-[#0F2A3A] border rounded-lg text-white font-mono text-sm outline-none transition-all ${
                  formErrors.recipientAddress ? 'border-red-500' : 'border-[#1A3A4A] focus:border-[#00FFFF]'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-widest">
                  Total {selectedToken.symbol}
                </label>
                <input
                  type="number"
                  step="any"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg text-white font-mono text-sm outline-none focus:border-[#00FFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-widest">Rate (/sec)</label>
                <input
                  type="number"
                  step="any"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2A3A] border border-[#1A3A4A] rounded-lg text-white font-mono text-sm outline-none focus:border-[#00FFFF]"
                />
              </div>
            </div>

            {/* Duration Preview */}
            {totalAmount && flowRate && parseFloat(flowRate) > 0 && (
              <div className="p-3 bg-[#0A1F2E] border-l-4 border-[#FF6600] rounded-r-lg flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-[#A0A0A0] uppercase font-bold">Estimated Duration</p>
                  <p className="text-sm font-mono text-white">
                    {Math.floor(parseFloat(totalAmount) / parseFloat(flowRate))} Seconds
                  </p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-[#A0A0A0] uppercase font-bold">Atomic Units</p>
                   <p className="text-[10px] text-[#00FFFF] font-mono">
                     {(parseFloat(totalAmount) * Math.pow(10, selectedToken.decimals)).toLocaleString()}
                   </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!isConnected || isLoading || !totalAmount || !flowRate}
              className="w-full py-4 bg-[#FF6600] disabled:bg-[#1A3A4A] disabled:opacity-50 text-white font-black uppercase italic tracking-widest rounded-lg transition-all active:scale-95 shadow-[0_0_15px_rgba(255,102,0,0.3)] hover:shadow-[0_0_25px_rgba(255,102,0,0.5)]"
              style={isConnected && !isLoading ? { borderRight: '6px solid #00FFFF', borderBottom: '6px solid #00FFFF' } : {}}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Stream'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}