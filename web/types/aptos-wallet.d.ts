/**
 * TypeScript declarations for Aptos wallet extensions (Petra, etc.)
 */

interface AptosWallet {
  connect(): Promise<{ address: string }>;
  account(): Promise<{ address: string }>;
  signAndSubmitTransaction(transaction: any): Promise<{ hash: string }>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  network(): Promise<string>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

interface Window {
  aptos?: AptosWallet;
}

