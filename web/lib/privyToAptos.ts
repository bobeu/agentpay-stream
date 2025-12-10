/**
 * Utility to convert Privy wallet to Aptos Account
 * 
 * Since Privy primarily supports EVM chains, we need to handle Aptos differently.
 * This utility provides a bridge between Privy authentication and Aptos transactions.
 * 
 * NOTE: This file should only be imported in client components to avoid SSR issues.
 */

'use client';

import { AccountAddress } from '@aptos-labs/ts-sdk';

// Note: Account creation functions removed to avoid SSR issues
// These would require Node.js-specific imports that cause build errors
// For MVP, we use wallet extensions (Petra) directly instead

/**
 * Check if a string is a valid Aptos address
 */
export function isValidAptosAddress(address: string): boolean {
  try {
    AccountAddress.fromString(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a string to Aptos AccountAddress
 */
export function toAccountAddress(address: string): AccountAddress {
  return AccountAddress.fromString(address);
}

