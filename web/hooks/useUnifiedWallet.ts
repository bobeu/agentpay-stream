// // /**
// //  * Unified Wallet Hook
// //  * Uses Privy as the primary wallet connection method for Movement Network
// //  * Privy handles wallet connections and routes them to Movement Network automatically
// //  */

// // 'use client';

// // import { usePrivySafe } from './usePrivySafe';
// // import { useAptosWallet } from '@/components/AptosWalletProvider';
// // import { getCurrentMovementNetwork } from '@/lib/aptosClient';
// // import { getAptosWallets } from '@aptos-labs/wallet-standard';
// // import { useState, useEffect, useCallback } from 'react';

// // interface UnifiedWalletState {
// //   // Connection state
// //   isConnected: boolean;
// //   isLoading: boolean;
  
// //   // Wallet info
// //   address: string | null;
// //   walletName: string | null;
// //   isNightlyWallet: boolean;
  
// //   // Connection methods
// //   connect: () => Promise<void>;
// //   disconnect: () => Promise<void>;
  
// //   // Wallet type
// //   walletType: 'privy' | 'aptos' | null;
// // }

// // /**
// //  * Unified wallet hook that prioritizes Nightly Wallet for Movement blockchain
// //  */
// // export function useUnifiedWallet(): UnifiedWalletState {
// //   const privy = usePrivySafe();
// //   const aptosWallet = useAptosWallet();
  
// //   const [walletState, setWalletState] = useState<UnifiedWalletState>({
// //     isConnected: false,
// //     isLoading: true,
// //     address: null,
// //     walletName: null,
// //     isNightlyWallet: false,
// //     connect: async () => {},
// //     disconnect: async () => {},
// //     walletType: null,
// //   });

// //   // Check for Nightly Wallet specifically
// //   const checkNightlyWallet = useCallback(() => {
// //     if (typeof window === 'undefined') return false;
    
// //     // Check for Nightly Wallet in window object
// //     const nightly = (window as any).nightly;
// //     if (nightly?.aptos) {
// //       return true;
// //     }
    
// //     // Check in Aptos wallet adapters
// //     if (aptosWallet.wallet?.name?.toLowerCase().includes('nightly')) {
// //       return true;
// //     }
    
// //     return false;
// //   }, [aptosWallet.wallet]);

// //       // Update wallet state based on available connections
// //       useEffect(() => {
// //         const updateWalletState = async () => {
// //           const isNightly = checkNightlyWallet();
          
// //           // Priority 1: Privy authentication (Primary method for Movement Network)
// //           // Privy handles wallet connections and routes them to Movement Network
// //           if (privy.authenticated && privy.user?.wallet?.address) {
// //             // Get wallet name from Privy user object
// //             const walletName = privy.user.wallet.walletClientType || 
// //                               privy.user.wallet.connectorType || 
// //                               'Privy Wallet';
            
// //             setWalletState({
// //               isConnected: true,
// //               isLoading: false,
// //               address: privy.user.wallet.address,
// //               walletName: walletName,
// //               isNightlyWallet: walletName.toLowerCase().includes('nightly'),
// //               connect: async () => {
// //                 // Privy login will show wallet selection modal
// //                 // Privy automatically routes connections to Movement Network based on supportedChains config
// //                 await privy.login();
// //               },
// //               disconnect: async () => {
// //                 await privy.logout();
// //               },
// //               walletType: 'privy',
// //             });
// //             return;
// //           }

// //           // Priority 2: Aptos wallet adapter (Fallback for direct wallet connections)
// //           if (aptosWallet.connected && aptosWallet.account) {
// //             setWalletState({
// //               isConnected: true,
// //               isLoading: false,
// //               address: aptosWallet.account.address.toString(),
// //               walletName: aptosWallet.wallet?.name || 'Aptos Wallet',
// //               isNightlyWallet: isNightly,
// //               connect: async () => {
// //                 try {
// //                   await aptosWallet.connect(aptosWallet.wallet?.name || '');
// //                 } catch (error) {
// //                   console.error('Failed to connect Aptos wallet:', error);
// //                   throw error;
// //                 }
// //               },
// //               disconnect: async () => {
// //                 try {
// //                   await aptosWallet.disconnect();
// //                 } catch (error) {
// //                   console.error('Failed to disconnect Aptos wallet:', error);
// //                 }
// //               },
// //               walletType: 'aptos',
// //             });
// //             return;
// //           }

// //           // No wallet connected
// //           setWalletState({
// //             isConnected: false,
// //             isLoading: !privy.ready,
// //             address: null,
// //             walletName: null,
// //             isNightlyWallet: false,
// //             connect: async () => {
// //               // Priority 1: Use Privy as primary connection method
// //               // Privy will show wallet selection modal and handle Movement Network routing
// //               // Privy automatically connects wallets to Movement Network based on supportedChains config
// //               try {
// //                 await privy.login();
// //               } catch (error) {
// //                 console.error('Failed to connect via Privy:', error);
                
// //                 // Fallback: Try direct Aptos wallet connection if Privy fails
// //                 if (aptosWallet.wallets.length > 0 && typeof window !== 'undefined') {
// //                   try {
// //                     // Get Movement network configuration
// //                     const movementNetwork = getCurrentMovementNetwork();
                    
// //                     // Get all available wallets from wallet-standard
// //                     const allWallets = getAptosWallets();
                    
// //                     // Find Nightly Wallet first (best Movement support)
// //                     const nightlyWallet = aptosWallet.wallets.find(
// //                       (w) => w.name.toLowerCase().includes('nightly')
// //                     ) || allWallets.aptosWallets.find(
// //                       (w) => w.name.toLowerCase().includes('nightly')
// //                     );
                    
// //                     // Try to connect with Movement network info
// //                     if (nightlyWallet && nightlyWallet.features?.['aptos:connect']) {
// //                       try {
// //                         // Connect directly to Movement Network
// //                         const connectResult = await nightlyWallet.features['aptos:connect'].connect(
// //                           false,
// //                           movementNetwork
// //                         );
                        
// //                         if (connectResult.status === 'Approved') {
// //                           await aptosWallet.connect(nightlyWallet.name);
// //                           return;
// //                         }
// //                       } catch (error) {
// //                         console.warn('Failed to connect Nightly Wallet to Movement Network:', error);
// //                       }
// //                     }
                    
// //                     // Fallback: Try connecting any available wallet
// //                     const walletToConnect = nightlyWallet || aptosWallet.wallets[0];
// //                     if (walletToConnect) {
// //                       // Try connecting with Movement network info if supported
// //                       if (walletToConnect.features?.['aptos:connect']) {
// //                         try {
// //                           const connectResult = await walletToConnect.features['aptos:connect'].connect(
// //                             false,
// //                             movementNetwork
// //                           );
// //                           if (connectResult.status === 'Approved') {
// //                             await aptosWallet.connect(walletToConnect.name);
// //                             return;
// //                           }
// //                         } catch (error) {
// //                           console.warn('Failed to connect wallet to Movement Network:', error);
// //                         }
// //                       }
                      
// //                       // Fallback to standard connection
// //                       await aptosWallet.connect(walletToConnect.name);
// //                       return;
// //                     }
// //                   } catch (error) {
// //                     console.warn('Failed to connect Aptos wallet:', error);
// //                   }
// //                 }
                
// //                 throw error; // Re-throw Privy error if all fallbacks fail
// //               }
// //             },
// //         disconnect: async () => {
// //           if (aptosWallet.connected) {
// //             await aptosWallet.disconnect();
// //           }
// //           if (privy.authenticated) {
// //             await privy.logout();
// //           }
// //         },
// //         walletType: null,
// //       });
// //     };

// //     updateWalletState();
// //   }, [
// //     privy.authenticated,
// //     privy.ready,
// //     privy.user,
// //     aptosWallet.connected,
// //     aptosWallet.account,
// //     aptosWallet.wallet,
// //     aptosWallet.wallets,
// //     checkNightlyWallet,
// //   ]);

// //   return walletState;
// // }







// 'use client';

// import { usePrivy, useWallets as usePrivyWallets } from '@privy-io/react-auth';
// import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';

// export function useUnifiedWallet() {
//   const { authenticated, user, login, logout: privyLogout } = usePrivy();
//   const { wallets: privyWallets } = usePrivyWallets();
//   const { 
//     account: aptosAccount, 
//     connected: aptosConnected, 
//     disconnect: aptosDisconnect, 
//     wallet: currentAptosWallet 
//   } = useAptosWallet();

//   // Determine if we are using Privy (Embedded) or an External Wallet (Nightly)
//   const isPrivyConnected = authenticated && !!user?.wallet;
//   const isAptosConnected = aptosConnected && !!aptosAccount;

//   return {
//     isConnected: isPrivyConnected || isAptosConnected,
//     address: isAptosConnected ? aptosAccount?.address : user?.wallet?.address,
//     walletType: isAptosConnected ? currentAptosWallet?.name : 'Privy Embedded',
//     isNightly: currentAptosWallet?.name === 'Nightly',
    
//     connect: login, // Use Privy login as the entry point
//     disconnect: async () => {
//       if (isAptosConnected) await aptosDisconnect();
//       if (authenticated) await privyLogout();
//     }
//   };
// }








// import { usePrivy } from '@privy-io/react-auth';
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { useState, useMemo } from 'react';

// export function useUnifiedWallet() {
//   const { user, authenticated, logout: privyLogout, ready: privyReady } = usePrivy();
//   const { 
//     account: aptosAccount, 
//     connected: aptosConnected, 
//     disconnect: aptosDisconnect, 
//     wallet: aptosWallet,
//     signAndSubmitTransaction,
//     isLoading: aptosLoading 
//   } = useWallet();

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const unifiedData = useMemo(() => {
//     // Priority 1: Direct Aptos Wallet (Nightly/Petra)
//     if (aptosConnected && aptosAccount) {
//       return {
//         address: aptosAccount.address,
//         isConnected: true,
//         walletType: 'extension',
//         walletName: aptosWallet?.name,
//         isNightlyWallet: aptosWallet?.name.toLowerCase().includes('nightly'),
//         provider: signAndSubmitTransaction, // For signing
//       };
//     }

//     // Priority 2: Privy Social Wallet
//     if (authenticated && user?.wallet) {
//       return {
//         address: user.wallet.address,
//         isConnected: true,
//         walletType: 'privy',
//         walletName: 'Privy',
//         isNightlyWallet: false,
//         provider: null, // Privy handles signing via its own hooks
//       };
//     }

//     return {
//       address: null,
//       isConnected: false,
//       walletType: null,
//       walletName: null,
//       isNightlyWallet: false,
//       provider: null,
//     };
//   }, [aptosConnected, aptosAccount, authenticated, user]);

//   return {
//     ...unifiedData,
//     isLoading: !privyReady || aptosLoading,
//     connect: () => setIsModalOpen(true),
//     disconnect: async () => {
//       await aptosDisconnect();
//       await privyLogout();
//     },
//     isModalOpen,
//     setIsModalOpen,
//   };
// }



'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function useUnifiedWallet() {
  const { 
    account, 
    connected, 
    disconnect, 
    wallet, 
    connect, 
    wallets, 
    isLoading,
    signAndSubmitTransaction,
  } = useWallet();

  return {
    address: account?.address?.toString() || null,
    isConnected: connected,
    walletName: wallet?.name || '',
    disconnect,
    connect,
    isLoading,
    availableWallets: wallets,
    wallet,
    signAndSubmitTransaction
  };
}