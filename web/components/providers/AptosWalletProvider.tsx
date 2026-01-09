'use client';

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { PropsWithChildren } from "react";

// We include Petra explicitly as it's the most common legacy wallet
// Modern wallets (Nightly, Pontem, etc.) are auto-detected via AIP-62
// const wallets = [new PetraWallet()];

export function AptosWalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
    //   plugins={wallets}
      autoConnect={true}
      dappConfig={{ 
        network: Network.TESTNET, // Movement M1 typically maps to Testnet settings
      }}
      onError={(error) => {
        console.error("Wallet Error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}