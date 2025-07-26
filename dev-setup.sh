#!/bin/bash

# Vendor Local Development Script
# This script sets up the local development environment

set -e

echo "🔧 Setting up Vendor local development environment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX CLI not found. Please install DFX first:"
    echo "curl -fsSL https://internetcomputer.org/install.sh | sh"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first:"
    echo "https://nodejs.org/"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --silent
cd ..

# Start local ICP replica
echo "🏠 Starting local ICP replica..."
dfx start --background --clean

# Wait for replica to be ready
echo "⏳ Waiting for replica to be ready..."
sleep 5

# Deploy backend only for development
echo "🚀 Deploying backend to local replica..."
dfx deploy vendor_backend --network local

echo "📦 Building frontend for deployment..."
cd frontend
npm run build
cd ..

echo "🌐 Deploying frontend assets..."
dfx deploy vendor_frontend --network local

# Generate Candid types
echo "📝 Generating Candid types..."
dfx generate vendor_backend

# Get canister IDs
BACKEND_ID=$(dfx canister id vendor_backend --network local)
FRONTEND_ID=$(dfx canister id vendor_frontend --network local)

# Create environment file for frontend
echo "🔧 Creating environment configuration..."
cat > .env << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_VENDOR_BACKEND_CANISTER_ID=$BACKEND_ID
NEXT_PUBLIC_VENDOR_FRONTEND_CANISTER_ID=$FRONTEND_ID
CANISTER_ID_VENDOR_BACKEND=$BACKEND_ID
CANISTER_ID_VENDOR_FRONTEND=$FRONTEND_ID
EOF

# Copy environment to frontend directory
cp .env frontend/.env.local

echo ""
echo "🎉 Development environment ready!"
echo "=================================================="
echo "🏠 Local Development URLs:"
echo "Frontend App:     http://$FRONTEND_ID.localhost:4943"
echo "Frontend (Alt):   http://127.0.0.1:4943/?canisterId=$FRONTEND_ID"
echo "Backend Canister: http://127.0.0.1:4943/?canisterId=$BACKEND_ID"
echo "Candid UI:        http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=$BACKEND_ID"
echo ""
echo "📋 Canister IDs:"
echo "Backend:  $BACKEND_ID"
echo "Frontend: $FRONTEND_ID"
echo "=================================================="
echo ""
echo "🎯 To start frontend development:"
echo "cd frontend && npm run dev"
echo ""
echo "📚 Useful Commands:"
echo "dfx canister logs vendor_backend  # View backend logs"
echo "dfx canister call vendor_backend health '()'  # Test backend"
echo "dfx stop  # Stop local replica when done"
