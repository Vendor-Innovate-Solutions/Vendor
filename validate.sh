#!/bin/bash

# Vendor Deployment Validation Script
# This script validates the deployment setup and configuration

set -e

echo "🔍 Validating Vendor ICP deployment setup..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Validation results
ERRORS=0
WARNINGS=0

# Check function
check() {
    if eval "$2"; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        if [ "$3" = "error" ]; then
            ERRORS=$((ERRORS + 1))
        else
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

# Warning function
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo "=================================================="
echo "🏗️  PROJECT STRUCTURE VALIDATION"
echo "=================================================="

# Check essential files
check "dfx.json exists" "[ -f 'dfx.json' ]" "error"
check "Backend main.mo exists" "[ -f 'backend/main.mo' ]" "error"
check "Frontend package.json exists" "[ -f 'frontend/package.json' ]" "error"
check "Frontend next.config.ts exists" "[ -f 'frontend/next.config.ts' ]" "error"
check "Deployment script exists" "[ -f 'deploy.sh' ]" "error"
check "Development setup script exists" "[ -f 'dev-setup.sh' ]" "error"

echo ""
echo "=================================================="
echo "🔧 DEPENDENCY VALIDATION"
echo "=================================================="

# Check dependencies
check "DFX CLI installed" "command -v dfx &> /dev/null" "error"
check "Node.js installed" "command -v node &> /dev/null" "error"
check "NPM installed" "command -v npm &> /dev/null" "error"

if command -v dfx &> /dev/null; then
    DFX_VERSION=$(dfx --version 2>/dev/null | head -n1 || echo "unknown")
    echo -e "${GREEN}📋 DFX Version: $DFX_VERSION${NC}"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}📋 Node.js Version: $NODE_VERSION${NC}"
fi

echo ""
echo "=================================================="
echo "⚙️  CONFIGURATION VALIDATION"
echo "=================================================="

# Check DFX configuration
if [ -f "dfx.json" ]; then
    check "DFX config has vendor_backend canister" "grep -q 'vendor_backend' dfx.json" "error"
    check "DFX config has vendor_frontend canister" "grep -q 'vendor_frontend' dfx.json" "error"
    check "DFX config has networks defined" "grep -q 'networks' dfx.json" "error"
fi

# Check frontend configuration
if [ -f "frontend/next.config.ts" ]; then
    check "Next.js configured for export" "grep -q \"output.*export\" frontend/next.config.ts" "error"
    check "Next.js images unoptimized" "grep -q \"unoptimized.*true\" frontend/next.config.ts" "warning"
fi

# Check ICP integration files
check "ICP config file exists" "[ -f 'frontend/utils/icp-config.ts' ]" "error"
check "ICP service file exists" "[ -f 'frontend/utils/icp-service.ts' ]" "error"
check "ICP API file exists" "[ -f 'frontend/utils/icp-api.ts' ]" "error"
check "ICP auth file exists" "[ -f 'frontend/utils/icp-auth.ts' ]" "error"

echo ""
echo "=================================================="
echo "📦 FRONTEND PACKAGE VALIDATION"
echo "=================================================="

if [ -f "frontend/package.json" ]; then
    cd frontend
    
    # Check for ICP dependencies
    check "DFINITY agent dependency" "grep -q '@dfinity/agent' package.json" "error"
    check "DFINITY candid dependency" "grep -q '@dfinity/candid' package.json" "error"
    check "DFINITY principal dependency" "grep -q '@dfinity/principal' package.json" "error"
    
    # Check for removed electron dependencies
    if grep -q "electron" package.json; then
        warn "Electron dependencies still present (should be removed for ICP deployment)"
    else
        echo -e "${GREEN}✅ Electron dependencies removed${NC}"
    fi
    
    # Check build scripts
    check "Export script defined" "grep -q '\"export\"' package.json" "warning"
    check "Clean script defined" "grep -q '\"clean\"' package.json" "warning"
    
    cd ..
fi

echo ""
echo "=================================================="
echo "🚀 DEPLOYMENT READINESS"
echo "=================================================="

# Check if frontend dependencies are installed
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    warn "Frontend dependencies not installed (run 'cd frontend && npm ci')"
fi

# Check scripts are executable
check "Deployment script executable" "[ -x 'deploy.sh' ]" "warning"
check "Development script executable" "[ -x 'dev-setup.sh' ]" "warning"

# Check for any remaining Django API usage
DJANGO_REFS=$(find frontend/app -name "*.tsx" -exec grep -l "API_URL\|fetchWithAuth\|getAuthToken" {} \; 2>/dev/null || true)
if [ -n "$DJANGO_REFS" ]; then
    warn "Some files may still contain Django API references"
    echo "$DJANGO_REFS"
else
    echo -e "${GREEN}✅ No Django API references found${NC}"
fi

echo ""
echo "=================================================="
echo "📊 VALIDATION SUMMARY"
echo "=================================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Your project is ready for ICP deployment!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run ./dev-setup.sh for local development"
    echo "2. Run ./deploy.sh local for local testing"
    echo "3. Run ./deploy.sh ic for mainnet deployment"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Project is mostly ready with $WARNINGS warnings${NC}"
    echo -e "${GREEN}✅ No critical errors found${NC}"
    echo ""
    echo "🚀 You can proceed with deployment, but consider addressing the warnings"
else
    echo -e "${RED}❌ Found $ERRORS critical errors and $WARNINGS warnings${NC}"
    echo -e "${RED}🛑 Please fix the errors before attempting deployment${NC}"
    echo ""
    echo "🔧 Common fixes:"
    echo "- Install missing dependencies"
    echo "- Ensure all required files are present"
    echo "- Check file permissions"
fi

echo "=================================================="

exit $ERRORS
