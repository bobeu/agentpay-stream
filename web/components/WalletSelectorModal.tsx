// import { usePrivy } from '@privy-io/react-auth';
// import { useWallet } from "@aptos-labs/wallet-adapter-react";

// export function WalletSelector() {
//   const { login, authenticated, logout, user } = usePrivy();
//   const { connect, wallets, connected, disconnect, account } = useWallet();

//   // If already logged in via either method, show account info
//   if (authenticated || connected) {
//     return (
//       <div className="flex flex-col gap-2 p-4 bg-gray-900 rounded-lg">
//         <p className="text-sm text-gray-400">Connected as:</p>
//         <p className="font-mono text-white truncate">
//           {account?.address || user?.wallet?.address}
//         </p>
//         <button 
//           onClick={() => { logout(); disconnect(); }}
//           className="px-4 py-2 mt-2 text-white bg-red-600 rounded-md hover:bg-red-700"
//         >
//           Disconnect
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-3 p-6 bg-gray-800 border border-gray-700 rounded-xl">
//       <h2 className="text-xl font-bold text-white mb-2">Connect to Movement</h2>
      
//       {/* 1. Privy Social Sign-in */}
//       <button
//         onClick={() => login()}
//         className="flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
//       >
//         <span>Continue with Social or Email</span>
//       </button>

//       <div className="relative my-2">
//         <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
//         <div className="relative flex justify-center text-xs uppercase"><span className="px-2 text-gray-400 bg-gray-800">Or use a wallet</span></div>
//       </div>

//       {/* 2. Map through Aptos Wallets (Nightly, Petra, etc.) */}
//       <div className="grid grid-cols-1 gap-2">
//         {wallets.map((wallet) => (
//           <button
//             key={wallet.name}
//             onClick={() => connect(wallet.name)}
//             className="flex items-center justify-between px-4 py-2 transition-all bg-gray-700 rounded-lg hover:bg-gray-600 group"
//           >
//             <div className="flex items-center gap-3">
//               <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
//               <span className="text-white">{wallet.name}</span>
//             </div>
//             {wallet.readyState === "Installed" ? (
//               <span className="text-xs text-green-400">Installed</span>
//             ) : (
//               <span className="text-xs text-gray-400 group-hover:text-white">Link →</span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }