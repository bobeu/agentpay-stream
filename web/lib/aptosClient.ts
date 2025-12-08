import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Get network from environment or default to testnet
const getNetwork = (): Network => {
  const nodeUrl = process.env.NEXT_PUBLIC_MOVEMENT_NODE_URL;
  
  if (nodeUrl?.includes('testnet')) {
    return Network.TESTNET;
  } else if (nodeUrl?.includes('mainnet')) {
    return Network.MAINNET;
  } else if (nodeUrl?.includes('localhost') || nodeUrl?.includes('127.0.0.1')) {
    return Network.LOCAL;
  }
  
  return Network.TESTNET;
};

// Initialize Aptos client
const config = new AptosConfig({ network: getNetwork() });
export const aptosClient = new Aptos(config);

// Contract address from environment
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

