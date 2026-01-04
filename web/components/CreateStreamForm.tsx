/**
 * CreateStreamForm Component
 * Form for creating new payment streams on Movement L1
 */

'use client';

import { useState, FormEvent } from 'react';
import { usePrivySafe } from '@/hooks/usePrivySafe';
import { useStreamCreation } from '@/hooks/useStreamCreation';
import { isValidAptosAddress } from '@/lib/privyToAptos';

export default function CreateStreamForm() {
  const { ready, authenticated, login } = usePrivySafe();
  const { createStreamTransaction, isLoading, error, transactionHash, reset } = useStreamCreation();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!recipientAddress.trim()) {
      errors.recipientAddress = 'Recipient address is required';
    } else if (!isValidAptosAddress(recipientAddress.trim())) {
      errors.recipientAddress = 'Invalid Aptos address format';
    }

    const amount = parseFloat(totalAmount);
    if (!totalAmount.trim()) {
      errors.totalAmount = 'Total amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      errors.totalAmount = 'Total amount must be a positive number';
    }

    const rate = parseFloat(flowRate);
    if (!flowRate.trim()) {
      errors.flowRate = 'Flow rate is required';
    } else if (isNaN(rate) || rate <= 0) {
      errors.flowRate = 'Flow rate must be a positive number';
    } else if (rate > amount) {
      errors.flowRate = 'Flow rate cannot exceed total amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!authenticated) {
      login();
      return;
    }

    reset();
    
    const result = await createStreamTransaction({
      recipientAddress: recipientAddress.trim(),
      totalAmount: parseFloat(totalAmount),
      flowRate: parseFloat(flowRate),
    });

    if (result.success && result.transactionHash) {
      // Success - form will show success message
      // Optionally reset form
      // setRecipientAddress('');
      // setTotalAmount('');
      // setFlowRate('');
    }
  };

  const isFormValid = 
    recipientAddress.trim() !== '' &&
    totalAmount.trim() !== '' &&
    flowRate.trim() !== '' &&
    !isNaN(parseFloat(totalAmount)) &&
    parseFloat(totalAmount) > 0 &&
    !isNaN(parseFloat(flowRate)) &&
    parseFloat(flowRate) > 0 &&
    parseFloat(flowRate) <= parseFloat(totalAmount);

  const isSubmitDisabled = !ready || !authenticated || isLoading || !isFormValid;

  // Calculate duration for display
  const calculatedDuration = 
    totalAmount && flowRate && 
    !isNaN(parseFloat(totalAmount)) && 
    !isNaN(parseFloat(flowRate)) && 
    parseFloat(flowRate) > 0
      ? (parseFloat(totalAmount) / parseFloat(flowRate)).toFixed(2)
      : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1A3A4A] rounded-xl border-2 shadow-2xl p-5 relative overflow-hidden" style={{ borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' }}>
        {/* Cyan border glow */}
        <div className="absolute inset-0 rounded-xl cyan-glow opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-5 text-[#00FFFF]">
            Create Payment Stream
          </h2>

          {!authenticated && (
            <div className="mb-5 p-3 bg-[#0F2A3A] border border-[#00FFFF]/20 rounded-lg">
              <p className="text-xs text-[#E0E0E0] mb-2">
                Please connect your wallet to create a stream.
              </p>
              <button
                onClick={login}
                className="w-full bg-[#FF6600] hover:bg-[#FF6600]/80 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 shadow-lg text-sm border-2"
                style={{ borderRightWidth: '4px', borderBottomWidth: '4px', borderColor: '#00FFFF' }}
              >
                Connect Wallet
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Address */}
            <div>
              <label
                htmlFor="recipientAddress"
                className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
              >
                Recipient Address
              </label>
              <input
                type="text"
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => {
                  setRecipientAddress(e.target.value);
                  if (formErrors.recipientAddress) {
                    setFormErrors({ ...formErrors, recipientAddress: '' });
                  }
                }}
                placeholder="0x..."
                className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
                  formErrors.recipientAddress
                    ? 'border-[#FF6600]'
                    : 'border-[#1A3A4A]'
                }`}
                disabled={!authenticated || isLoading}
              />
              {formErrors.recipientAddress && (
                <p className="mt-1 text-xs text-[#FF6600]">
                  {formErrors.recipientAddress}
                </p>
              )}
              <p className="mt-1 text-xs text-[#A0A0A0]">
                The Aptos address of the AI agent or service to receive payments
              </p>
            </div>

            {/* Total Amount */}
            <div>
              <label
                htmlFor="totalAmount"
                className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
              >
                Total Amount (APT)
              </label>
              <input
                type="number"
                id="totalAmount"
                step="0.00000001"
                min="0"
                value={totalAmount}
                onChange={(e) => {
                  setTotalAmount(e.target.value);
                  if (formErrors.totalAmount) {
                    setFormErrors({ ...formErrors, totalAmount: '' });
                  }
                }}
                placeholder="100.0"
                className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
                  formErrors.totalAmount
                    ? 'border-[#FF6600]'
                    : 'border-[#1A3A4A]'
                }`}
                disabled={!authenticated || isLoading}
              />
              {formErrors.totalAmount && (
                <p className="mt-1 text-xs text-[#FF6600]">
                  {formErrors.totalAmount}
                </p>
              )}
              <p className="mt-1 text-xs text-[#A0A0A0]">
                The total amount of APT to deposit into the stream
              </p>
            </div>

            {/* Flow Rate */}
            <div>
              <label
                htmlFor="flowRate"
                className="block text-xs font-medium text-[#E0E0E0] mb-1.5"
              >
                Flow Rate (APT/Second)
              </label>
              <input
                type="number"
                id="flowRate"
                step="0.00000001"
                min="0"
                value={flowRate}
                onChange={(e) => {
                  setFlowRate(e.target.value);
                  if (formErrors.flowRate) {
                    setFormErrors({ ...formErrors, flowRate: '' });
                  }
                }}
                placeholder="0.0001"
                className={`w-full px-3 py-2 text-sm bg-[#0F2A3A] border rounded-lg focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] text-[#E0E0E0] placeholder-[#A0A0A0] transition-all ${
                  formErrors.flowRate
                    ? 'border-[#FF6600]'
                    : 'border-[#1A3A4A]'
                }`}
                disabled={!authenticated || isLoading}
              />
              {formErrors.flowRate && (
                <p className="mt-1 text-xs text-[#FF6600]">
                  {formErrors.flowRate}
                </p>
              )}
              <p className="mt-1 text-xs text-[#A0A0A0]">
                The rate at which tokens will be streamed per second
              </p>
              {calculatedDuration && (
                <div className="mt-2 p-2 bg-[#0F2A3A] border border-[#FF6600]/30 rounded-lg">
                  <p className="text-xs font-semibold text-[#FF6600]">
                    Stream duration: ~{calculatedDuration} seconds
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full overflow-auto p-3 flex flex-col justify-center bg-[#FF6600]/20 border border-[#FF6600] rounded-lg">
                <p className="text-xs text-[#FF6600]">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {transactionHash && (
              <div className="p-3 bg-[#00FFFF]/20 border border-[#00FFFF] rounded-lg">
                <p className="text-xs text-[#00FFFF] mb-1 font-semibold">
                  Stream created successfully!
                </p>
                <a
                  href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00FFFF] hover:underline"
                >
                  View transaction on explorer →
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg ${
                isSubmitDisabled
                  ? 'bg-[#0F2A3A] text-[#A0A0A0] cursor-not-allowed border border-[#1A3A4A]'
                  : 'bg-[#FF6600] hover:bg-[#FF6600]/80 text-white border-2'
              }`}
              style={!isSubmitDisabled ? { borderRightWidth: '8px', borderBottomWidth: '8px', borderColor: '#00FFFF' } : {}}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Stream...
                </span>
              ) : (
                'Create Stream'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

