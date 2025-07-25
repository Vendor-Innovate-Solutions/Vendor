// ICP Configuration
// Update these values based on your deployment

export const ICP_CONFIG = {
  // Canister ID - Update this with your actual deployed canister ID
  CANISTER_ID: 'rdmx6-jaaaa-aaaaa-aaadq-cai', // Mock/placeholder for development
  
  // Network configuration
  NETWORK: {
    // For local development (dfx start)
    LOCAL: {
      HOST: 'http://127.0.0.1:4943',
      CANISTER_ID: 'rdmx6-jaaaa-aaaaa-aaadq-cai' // Replace with your local canister ID from dfx deploy
    },
    
    // For IC mainnet
    MAINNET: {
      HOST: 'https://ic0.app',
      CANISTER_ID: 'YOUR_MAINNET_CANISTER_ID' // Replace with your actual mainnet canister ID
    }
  },
  
  // Current environment - Set to LOCAL for development
  ENVIRONMENT: 'LOCAL' as 'LOCAL' | 'MAINNET'
};

// Get current configuration based on environment
export const getCurrentConfig = () => {
  return ICP_CONFIG.NETWORK[ICP_CONFIG.ENVIRONMENT];
};

// Helper to check if we're in development mode
export const isDevelopment = () => {
  return ICP_CONFIG.ENVIRONMENT === 'LOCAL';
};

export default ICP_CONFIG;
