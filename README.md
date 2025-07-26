# Vendor ICP Application

A complete vendor management system built on the Internet Computer Protocol (ICP) with a Next.js frontend and Motoko backend.

## 🏗️ Architecture

- **Frontend**: Next.js application with ICP integration
- **Backend**: Motoko canister with complete business logic
- **Deployment**: Unified DFX configuration for seamless deployment

## 🚀 Quick Start

### Prerequisites

1. **DFX CLI** (DFINITY SDK)
   ```bash
   curl -fsSL https://internetcomputer.org/install.sh | sh
   ```

2. **Node.js** (v18 or higher)
   ```bash
   # Download from https://nodejs.org/
   ```

3. **Git** (for cloning the repository)

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd Vendor
   ```

2. **Run development setup**
   ```bash
   ./dev-setup.sh
   ```

3. **Start frontend development**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend Candid UI: http://127.0.0.1:4943/?canisterId=<backend-canister-id>

### Production Deployment

#### Local Deployment (for testing)
```bash
./deploy.sh local
```

#### Mainnet Deployment
```bash
./deploy.sh ic
```

## 📁 Project Structure

```
Vendor/
├── dfx.json                    # Unified DFX configuration
├── deploy.sh                   # Production deployment script
├── dev-setup.sh                # Development setup script
├── frontend/                   # Next.js frontend application
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components
│   ├── utils/                  # ICP integration utilities
│   │   ├── icp-api.ts         # ICP service layer
│   │   ├── icp-auth.ts        # ICP authentication
│   │   ├── icp-config.ts      # ICP configuration
│   │   └── icp-service.ts     # ICP canister interface
│   ├── package.json           # Frontend dependencies
│   └── next.config.ts         # Next.js configuration
└── backend/                    # Motoko backend
    ├── main.mo                 # Main canister actor
    ├── models/                 # Data models
    ├── utils/                  # Utility modules
    └── Documentation.md        # Backend API documentation
```

## 🔧 Configuration

### Environment Variables

The application automatically configures itself based on the deployment environment:

- **Local Development**: Uses local DFX replica
- **Mainnet**: Uses Internet Computer mainnet

Key environment variables (auto-generated):
```bash
NEXT_PUBLIC_DFX_NETWORK=local|ic
NEXT_PUBLIC_VENDOR_BACKEND_CANISTER_ID=<canister-id>
CANISTER_ID_VENDOR_BACKEND=<canister-id>
```

### Canister Configuration

The `dfx.json` file configures both frontend and backend canisters:

- **vendor_backend**: Motoko canister with business logic
- **vendor_frontend**: Asset canister hosting the Next.js app

## 🎯 Features

### Frontend
- **Complete ICP Integration**: No Django API dependencies
- **Web3 Authentication**: Principal-based user authentication
- **Real-time Updates**: Direct canister communication
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with React and Tailwind CSS

### Backend
- **Complete Business Logic**: Full vendor management system
- **User Management**: Registration, authentication, roles
- **Company Management**: Multi-tenant architecture
- **Product Catalog**: Inventory with tax compliance
- **Order Processing**: Complete order lifecycle
- **Financial Management**: Invoicing and payments
- **Analytics**: Dashboard statistics and reports

## 📚 API Documentation

Detailed backend API documentation is available in [`backend/Documentation.md`](./backend/Documentation.md).

### Key Endpoints

- **Authentication**: `register()`, `login()`, `logout()`
- **Company Management**: `createCompany()`, `getCompanies()`
- **Product Management**: `createProduct()`, `getProducts()`
- **Order Management**: `createOrder()`, `getOrders()`
- **Invoice Management**: `createInvoice()`, `getInvoices()`

## 🔄 Development Workflow

### Local Development
1. Run `./dev-setup.sh` to initialize the local environment
2. Start frontend development with `cd frontend && npm run dev`
3. Backend changes require `dfx deploy vendor_backend`
4. Frontend automatically connects to local canister

### Testing
```bash
# Test backend canister
dfx canister call vendor_backend health '()'

# View canister logs
dfx canister logs vendor_backend

# Check canister status
dfx canister status vendor_backend
```

### Deployment
```bash
# Deploy to local replica (testing)
./deploy.sh local

# Deploy to mainnet (production)
./deploy.sh ic
```

## 🛠️ Troubleshooting

### Common Issues

1. **DFX replica not starting**
   ```bash
   dfx killall
   dfx start --clean --background
   ```

2. **Frontend build errors**
   ```bash
   cd frontend
   npm run clean
   npm ci
   npm run export
   ```

3. **Canister deployment fails**
   ```bash
   dfx canister stop --all
   dfx start --clean --background
   dfx deploy
   ```

### Development Tips

- Use `dfx generate` to update Candid types after backend changes
- Check `.env` file for correct canister IDs
- Use browser developer tools to debug ICP calls
- Monitor cycles balance for mainnet deployments

## 🎁 Features Completed

### ✅ Frontend ICP Integration
- Complete conversion from Django API to ICP services
- Profile management via ICP
- Accounting dashboard with ICP backend
- Customer/retailer management
- Invoice creation and viewing
- Stock management system

### ✅ Backend Motoko Implementation
- Complete Django model migration
- Full API endpoint coverage
- Authentication and authorization
- Business logic preservation
- Tax compliance features
- Multi-tenant architecture

### ✅ Deployment Ready
- Unified DFX configuration
- Automated deployment scripts
- Environment auto-configuration
- Production optimizations

## 🚀 Production Deployment URLs

After deployment, your application will be available at:

### Local Development
- Frontend: `http://<frontend-canister-id>.localhost:4943`
- Backend: `http://127.0.0.1:4943/?canisterId=<backend-canister-id>`

### Mainnet
- Frontend: `https://<frontend-canister-id>.icp0.io`
- Backend: `https://<backend-canister-id>.ic0.app`

## 📞 Support

For deployment issues or questions:
1. Check the troubleshooting section above
2. Review the backend documentation
3. Use `dfx --help` for DFX CLI assistance
4. Check ICP documentation at https://internetcomputer.org/docs

---

**🎉 Your Vendor application is now fully ICP-enabled and ready for Web3 deployment!**
