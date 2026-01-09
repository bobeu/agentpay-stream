// // 'use client';

// // import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
// // import { ReactNode } from 'react';

// // export function PrivyProvider({ children }: { children: ReactNode }) {
// //   const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
// //   // If no app ID is provided, render children without Privy (for development/testing)
// //   if (!appId || appId === 'your-privy-app-id-here') {
// //     console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy features will be disabled. Please configure it in .env.local for full functionality.');
// //     return <>{children}</>;
// //   }

// //   // Get Movement network configuration from environment
// //   // Movement Testnet: Chain ID 250, RPC: https://full.testnet.movementinfra.xyz/v1
// //   // Movement Mainnet: Chain ID 126, RPC: https://mainnet.movementnetwork.xyz/v1
// //   const movementNodeUrl = process.env.NEXT_PUBLIC_MOVEMENT_NODE_URL || 'https://full.testnet.movementinfra.xyz/v1';
// //   const isMainnet = movementNodeUrl.includes('mainnet.movementnetwork.xyz');
// //   const isTestnet = movementNodeUrl.includes('testnet.movementinfra.xyz') || movementNodeUrl.includes('testnet');

// //   // Movement Network Chain IDs
// //   const movementChainId = isMainnet ? 126 : 250; // Movement Mainnet: 126, Testnet: 250

// //   return (
// //     <PrivyProviderBase
// //       appId={appId}
// //       config={{
// //         loginMethods: ['wallet'], // Only wallet login for DeFi app
// //         appearance: {
// //           theme: 'dark',
// //           accentColor: '#00FFFF',
// //           logo: '/logo.png',
// //         },
// //         // Configure supported chains for Movement Network
// //         // Privy will use this configuration to connect wallets to Movement Network
// //         // This enables Privy to properly route wallet connections to Movement Network
// //         supportedChains: [
// //           {
// //             id: movementChainId, // Movement Mainnet: 126, Testnet: 250
// //             name: isMainnet ? 'Movement Mainnet' : 'Movement Testnet',
// //             network: isMainnet ? 'mainnet' : 'testnet',
// //             nativeCurrency: {
// //               name: 'MOVE',
// //               symbol: 'MOVE',
// //               decimals: 8,
// //             },
// //             rpcUrls: {
// //               default: {
// //                 http: [movementNodeUrl],
// //               },
// //             },
// //             blockExplorers: {
// //               default: {
// //                 name: 'Movement Explorer',
// //                 url: 'https://explorer.movementnetwork.xyz',
// //               },
// //             },
// //           },
// //         ],
// //       }}
// //     >
// //       {children}
// //     </PrivyProviderBase>
// //   );
// // }














// 'use client';

// import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
// import { ReactNode } from 'react';

// export function PrivyProvider({ children }: { children: ReactNode }) {
//   const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
//   if (!appId || appId === 'your-privy-app-id-here') {
//     return <>{children}</>;
//   }

//   return (
//     <PrivyProviderBase
//       appId={appId}
//       config={{
//         appearance: {
//           theme: 'dark',
//           accentColor: '#00FFFF',
//           showWalletLoginFirst: false, // Priority to social/embedded for onboarding
//         },
//         loginMethods: ['email', 'google', 'twitter', 'wallet'], 
//         embeddedWallets: {
//           // Nest the config here
//           ethereum: {
//             createOnLogin: 'users-without-wallets',
//           },
//           // If you are also using Solana, you can add:
//           // solana: { createOnLogin: 'users-without-wallets' }
//         },
//       }}
//     >
//       {children}
//     </PrivyProviderBase>
//   );
// }
