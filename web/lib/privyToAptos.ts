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
 * Handles both full Aptos addresses and validates the format
 */
export function toAccountAddress(address: string): AccountAddress {
  // Remove 0x prefix if present
  let cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  
  // Check if it's a valid Aptos address length (60-64 hex chars)
  if (cleanAddress.length < 60 || cleanAddress.length > 64) {
    throw new Error(
      `Invalid Aptos address length: ${address}. Expected 60-64 hex characters (excluding 0x). ` +
      `This might be an Ethereum address. Please use an Aptos wallet address.`
    );
  }
  
  // Pad with zeros if needed to reach 64 characters
  if (cleanAddress.length < 64) {
    cleanAddress = cleanAddress.padStart(64, '0');
  }
  
  // Add 0x prefix back
  const fullAddress = '0x' + cleanAddress;
  
  return AccountAddress.fromString(fullAddress);
}

