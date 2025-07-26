#!/bin/bash

# Vendor ICP Deployment Script
# This script builds and deploys both frontend and backend to ICP

set -e

echo "🚀 Starting Vendor ICP Deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX CLI not found. Please install DFX first:"
    echo "curl -fsSL https://internetcomputer.org/install.sh | sh"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found. Please run this script from the project root."
    exit 1
fi

# Network selection
NETWORK=${1:-local}
echo "📡 Deploying to: $NETWORK"

if [ "$NETWORK" = "local" ]; then
    echo "🏠 Local deployment selected"
    
    # Start local replica if not running
    if ! dfx ping 2>/dev/null; then
        echo "🔄 Starting local ICP replica..."
        dfx start --background --clean
        sleep 5
    else
        echo "✅ Local ICP replica is already running"
    fi
elif [ "$NETWORK" = "ic" ]; then
    echo "🌐 Mainnet deployment selected"
    echo "⚠️  This will deploy to the Internet Computer mainnet"
    echo "⚠️  Make sure you have sufficient cycles!"
    read -p "Continue? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "❌ Deployment cancelled"
        exit 0
    fi
else
    echo "❌ Invalid network. Use 'local' or 'ic'"
    exit 1
fi

# Frontend build
echo "🔨 Building frontend..."
cd frontend
npm ci --silent
npm run clean
npm run build
cd ..

# Check if frontend build was successful
if [ ! -d "frontend/out" ]; then
    echo "❌ Frontend build failed - 'out' directory not found"
    exit 1
fi

echo "✅ Frontend build completed"

# Deploy to ICP
echo "🚀 Deploying backend to ICP..."

if [ "$NETWORK" = "local" ]; then
    dfx deploy vendor_backend --network local
else
    dfx deploy vendor_backend --network ic
fi

echo "🌐 Deploying frontend assets..."

if [ "$NETWORK" = "local" ]; then
    dfx deploy vendor_frontend --network local
else
    dfx deploy vendor_frontend --network ic
fi

# Generate environment file
echo "📝 Generating environment configuration..."
dfx generate

# Get canister URLs
echo ""
echo "🎉 Deployment completed successfully!"
echo "=================================================="

if [ "$NETWORK" = "local" ]; then
    BACKEND_ID=$(dfx canister id vendor_backend --network local)
    FRONTEND_ID=$(dfx canister id vendor_frontend --network local)
    
    echo "🏠 Local Deployment URLs:"
    echo "Backend Canister:  http://127.0.0.1:4943/?canisterId=$BACKEND_ID"
    echo "Frontend Canister: http://127.0.0.1:4943/?canisterId=$FRONTEND_ID"
    echo "Frontend App:      http://$FRONTEND_ID.localhost:4943"
else
    BACKEND_ID=$(dfx canister id vendor_backend --network ic)
    FRONTEND_ID=$(dfx canister id vendor_frontend --network ic)
    
    echo "🌐 Mainnet Deployment URLs:"
    echo "Backend Canister:  https://$BACKEND_ID.ic0.app"
    echo "Frontend Canister: https://$FRONTEND_ID.ic0.app"
    echo "Frontend App:      https://$FRONTEND_ID.icp0.io"
fi

echo ""
echo "📋 Canister IDs:"
echo "Backend:  $BACKEND_ID"
echo "Frontend: $FRONTEND_ID"
echo ""
echo "🔧 Environment variables have been generated in .env"
echo "=================================================="

# Display next steps
echo ""
echo "🎯 Next Steps:"
echo "1. Test your application using the URLs above"
echo "2. Update your frontend environment variables if needed"
echo "3. For production, consider setting up custom domains"
echo ""
echo "📚 Useful Commands:"
echo "dfx canister logs vendor_backend  # View backend logs"
echo "dfx canister status vendor_backend  # Check canister status"
echo "dfx cycles balance  # Check your cycles balance"
