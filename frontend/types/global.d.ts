/// <reference types="node" />
/// <reference types="trusted-types" />

// This file provides global type definitions for the project
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      NEXT_PUBLIC_VENDOR_FRONTEND_CANISTER_ID?: string
      CANISTER_ID_VENDOR_FRONTEND?: string
    }
  }
}

export {}
