// ICP Configuration
// Automatically configured based on dfx deployment

export const ICP_CONFIG = {
  // Canister IDs from environment variables (generated by dfx)
  BACKEND_CANISTER_ID: process.env.NEXT_PUBLIC_VENDOR_BACKEND_CANISTER_ID || process.env.CANISTER_ID_VENDOR_BACKEND || 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  FRONTEND_CANISTER_ID: process.env.NEXT_PUBLIC_VENDOR_FRONTEND_CANISTER_ID || process.env.CANISTER_ID_VENDOR_FRONTEND,
  
  // Network configuration
  NETWORK: {
    // For local development (dfx start)
    LOCAL: {
      HOST: process.env.NEXT_PUBLIC_DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'http://127.0.0.1:4943',
    },
    
    // For IC mainnet
    MAINNET: {
      HOST: 'https://ic0.app',
    }
  },
  
  // Auto-detect environment based on DFX_NETWORK
  ENVIRONMENT: (process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic' ? 'MAINNET' : 'LOCAL') as 'LOCAL' | 'MAINNET'
};

// Get current configuration based on environment
export const getCurrentConfig = () => {
  const config = ICP_CONFIG.NETWORK[ICP_CONFIG.ENVIRONMENT];
  return {
    ...config,
    CANISTER_ID: ICP_CONFIG.BACKEND_CANISTER_ID
  };
};

// Helper to check if we're in development mode
export const isDevelopment = () => {
  return ICP_CONFIG.ENVIRONMENT === 'LOCAL';
};

// Get the current host URL
export const getHostUrl = () => {
  const config = getCurrentConfig();
  return config.HOST;
};

// Get backend canister ID
export const getBackendCanisterId = () => {
  return ICP_CONFIG.BACKEND_CANISTER_ID;
};

export default ICP_CONFIG;
