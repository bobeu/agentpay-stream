import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Movement Network Configuration
const MOVEMENT_CONFIGS = {
  testnet: {
    chainId: 250, // Movement Testnet (Bardock) Chain ID
    fullnode: 'https://testnet.movementnetwork.xyz/v1',
    // fullnode: 'https://full.testnet.movementinfra.xyz/v1',
  },
  mainnet: {
    chainId: 126, // Movement Mainnet Chain ID
    fullnode: 'https://mainnet.movementnetwork.xyz/v1',
  },
};

// Get Movement network configuration from environment
function getMovementConfig() {
  const nodeUrl = process.env.NEXT_PUBLIC_MOVEMENT_NODE_URL || MOVEMENT_CONFIGS.testnet.fullnode;
  
  if (nodeUrl.includes('mainnet.movementnetwork.xyz')) {
    return {
      network: Network.CUSTOM,
      fullnode: MOVEMENT_CONFIGS.mainnet.fullnode,
      chainId: MOVEMENT_CONFIGS.mainnet.chainId,
    };
  } else if (nodeUrl.includes('testnet.movementnetwork.xyz') || nodeUrl.includes('testnet')) {
    return {
      network: Network.CUSTOM,
      fullnode: MOVEMENT_CONFIGS.testnet.fullnode,
      chainId: MOVEMENT_CONFIGS.testnet.chainId,
    };
  } else if (nodeUrl.includes('localhost') || nodeUrl.includes('127.0.0.1')) {
    return {
      network: Network.LOCAL,
      fullnode: nodeUrl,
      chainId: 4, // Local chain ID
    };
  }
  
  // Default to Movement Testnet
  return {
    network: Network.CUSTOM,
    fullnode: MOVEMENT_CONFIGS.testnet.fullnode,
    chainId: MOVEMENT_CONFIGS.testnet.chainId,
  };
}

// Initialize Aptos client with Movement Network configuration
const movementConfig = getMovementConfig();
const config = new AptosConfig({
  network: movementConfig.network,
  fullnode: movementConfig.fullnode,
});

export const aptosClient = new Aptos(config);

// Export Movement network info for wallet connections
export const MOVEMENT_NETWORK_INFO = {
  testnet: {
    chainId: MOVEMENT_CONFIGS.testnet.chainId,
    name: 'custom' as const,
    url: MOVEMENT_CONFIGS.testnet.fullnode,
  },
  mainnet: {
    chainId: MOVEMENT_CONFIGS.mainnet.chainId,
    name: 'custom' as const,
    url: MOVEMENT_CONFIGS.mainnet.fullnode,
  },
};
// https://testnet.movementnetwork.xyz/v1
// Get current network info based on environment
export function getCurrentMovementNetwork() {
  const nodeUrl = process.env.NEXT_PUBLIC_MOVEMENT_NODE_URL || MOVEMENT_CONFIGS.testnet.fullnode;
  
  if (nodeUrl.includes('mainnet.movementnetwork.xyz')) {
    return MOVEMENT_NETWORK_INFO.mainnet;
  }
  
  return MOVEMENT_NETWORK_INFO.testnet;
}

// Contract address from environment
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// 31636dd4bce33196896c70ee3dbfc459d38c36d2e33dc4a9e0effb86acb8e20c