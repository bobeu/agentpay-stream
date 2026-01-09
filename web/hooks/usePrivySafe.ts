// /**
//  * Safe Privy Hook
//  * Wraps usePrivy to handle cases where PrivyProvider is not rendered
//  */

// import { usePrivy } from '@privy-io/react-auth';

// export function usePrivySafe() {
//   try {
//     return usePrivy();
//   } catch (error) {
//     // Privy not available - return default values
//     return {
//       ready: true,
//       authenticated: false,
//       login: () => console.warn('Privy not configured. Please set NEXT_PUBLIC_PRIVY_APP_ID in .env.local'),
//       logout: () => {},
//       user: null,
//     };
//   }
// }

