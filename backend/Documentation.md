# Motoko ICP Backend Documentation

## Overview
This Motoko backend is a comprehensive migration of the Django REST API backend for the Vendor Dapp. It replicates all Django models, business logic, API endpoints, and utilities as canister methods on the Internet Computer (ICP). The backend provides seamless compatibility with the existing frontend while leveraging ICP's decentralized infrastructure.

## Architecture

### Core Structure
- **main.mo**: Main canister actor with all public endpoints and business logic
- **models/**: Modular data models with CRUD operations
  - `Company.mo`: Company management with public/private visibility
  - `Category.mo`: Product categorization system
  - `Product.mo`: Product inventory with pricing, tax rates, and status tracking
  - `Retailer.mo`: Legacy retailer management for backward compatibility
  - `RetailerProfile.mo`: Modern retailer profiles with detailed business information
  - `Order.mo`: Order management with items and status tracking
  - `Operations.mo`: Employee, truck, and shipment management
  - `Business.mo`: Advanced business logic (invoices, connections, invites, user management)
- **utils/**: Utility modules for cross-cutting concerns
  - `auth.mo`: Authentication, session management, and authorization
  - `email.mo`: Email notifications for OTP, invites, and status updates
  - `allocation.mo`: Order allocation algorithms and route optimization
  - `odoo.mo`: ERP integration with Odoo systems
- **tests/**: Test modules for canister functionality

## Complete Data Models

### User Management
- **User**: Principal-based identity with username, email, groups, and admin privileges
- **AuthSession**: Session management with expiration and role-based access
- **PasswordResetOTP**: OTP-based password recovery system

### Company & Product Management
- **Company**: Multi-tenant company system with public visibility options
- **Category**: Hierarchical product categorization
- **Product**: Complete inventory management with:
  - Quantity tracking (available, shipped, required)
  - UQC (Unit of Quantity Code) support for all standard units
  - Tax configuration (CGST, SGST, IGST, CESS rates)
  - HSN code support for GST compliance
  - Status tracking (sufficient/on_demand)
  - Price management

### Retailer & Relationship Management
- **RetailerProfile**: Comprehensive retailer business profiles
- **Retailer**: Legacy retailer entities linked to companies
- **CompanyRetailerConnection**: Many-to-many relationship management with:
  - Connection status (pending, approved, rejected, suspended)
  - Credit limits and payment terms
  - Approval workflows
- **CompanyInvite**: Invitation system with unique codes and expiration
- **RetailerRequest**: Request-based company joining system

### Order & Operations Management
- **Order**: Complete order system with:
  - Order items with product quantities
  - Status tracking (pending, allocated, delivered, cancelled)
  - Retailer association
- **OrderItem**: Individual line items within orders
- **Employee**: Staff management with company/retailer association and truck assignment
- **Truck**: Fleet management with capacity and availability tracking
- **Shipment**: Delivery management with employee assignment and status tracking

### Financial Management
- **Invoice**: Complete invoicing system with:
  - E-invoice support (IRN generation)
  - Tax calculations (CGST, SGST, IGST)
  - Payment tracking (cash, UPI, card, bank)
  - Due date management
- **InvoiceItem**: Detailed line items with product-wise tax calculations

## Complete API Endpoints (Canister Methods)

### Authentication & User Management
- `register(username, email, password, groups)`: User registration with role assignment
- `login(username, password)`: Authentication with session creation
- `logout()`: Session termination
- `getLoggedInUser()`: Current user information
- `forgotPassword(username, email)`: Initiate password reset with OTP
- `verifyOTP(username, otp)`: OTP verification
- `resetPassword(username, new_password, otp)`: Complete password reset

### Company Management
- `createCompany(...)`: Create new company with full details
- `getCompanies()`: Retrieve user's companies
- `getPublicCompanies()`: Browse public companies (for retailers)
- `updateCompany(id, ...)`: Update company information
- `deleteCompany(id)`: Remove company

### Category Management
- `createCategory(company_id, name)`: Add product category
- `getCategories(company_id?)`: Retrieve categories (filtered by company)
- `updateCategory(id, name)`: Modify category
- `deleteCategory(id)`: Remove category
- `getCategoryStockData()`: Analytics for category-wise product distribution

### Product Management
- `createProduct(...)`: Add products with complete tax and inventory details
- `getProducts(company_id?)`: Retrieve products (filtered by company)
- `updateProductQuantity(id, available, shipped, required)`: Inventory updates
- `deleteProduct(id)`: Remove product
- `storeQRCode(qr_text)`: QR code-based inventory updates (admin only)

### Retailer Management
- `createRetailerProfile(...)`: Self-registration for retailers
- `getRetailerProfile()`: Retrieve current user's retailer profile
- `updateRetailerProfile(...)`: Update retailer business information
- `addRetailer(...)`: Company adds retailer (legacy method)
- `getRetailers(company_id?)`: Retrieve retailers

### Order Management
- `createOrder(retailer_id, items)`: Place new orders with multiple items
- `getOrders(status?)`: Retrieve orders (optionally filtered by status)
- `getOrdersByRetailer(retailer_id)`: Retailer-specific order history
- `updateOrderStatus(order_id, status)`: Order status updates
- `approveOrder(order_id)`: Convert order to shipment (creates shipment record)

### Employee & Operations Management
- `createEmployee(company_id, retailer_id?, contact, truck_id?)`: Add staff
- `getEmployees(company_id?)`: Retrieve employees
- `createTruck(company_id, license_plate, capacity)`: Fleet management (admin only)
- `getTrucks(company_id?)`: Retrieve trucks
- `allocateOrder(order_id, employee_id)`: Manual order allocation
- `getShipments()`: Retrieve all shipments
- `getEmployeeShipments()`: Employee's assigned shipments
- `updateShipmentStatus(shipment_id, status)`: Update delivery status

### Invoice Management
- `createInvoice(...)`: Generate invoices with tax calculations
- `getInvoices(company_id?)`: Retrieve invoices
- `getInvoiceCount(company_id)`: Invoice statistics

### Company-Retailer Relationship Management
- `requestCompanyApproval(company_id, message)`: Retailer requests to join company
- `acceptRetailerRequest(request_id, action, credit_limit, payment_terms)`: Company approves/rejects requests
- `getCompanyConnections(company_id, status)`: Manage retailer relationships

### Analytics & Statistics
- `getCounts(company_id)`: Dashboard statistics (orders, employees, retailers)
- `getRetailerCounts()`: Retailer dashboard statistics
- `getCategoryStockData()`: Product distribution analytics

### Utility Functions
- `health()`: System health check

## Authentication & Authorization

### ICP Identity Integration
- Uses ICP Principal for user identification
- Session-based authentication with expiration
- Role-based access control (admin, employee, retailer)

### Permission System
- **Admin**: Full system access, can manage trucks, process QR codes
- **Employee**: Order allocation, shipment management, company operations
- **Retailer**: Profile management, order placement, company browsing
- **Public**: Company discovery, registration

### Security Features
- Password validation and hashing
- OTP-based password recovery
- Session expiration management
- Role-based method access control

## Business Logic Migration

### Django → Motoko Mappings

#### Models
| Django Model | Motoko Module | Key Features |
|--------------|---------------|--------------|
| User | Business.User | Principal-based identity |
| Company | Company.Company | Public/private visibility |
| Category | Category.Category | Company association |
| Product | Product.Product | Complete inventory + tax |
| Retailer | Retailer.Retailer | Legacy compatibility |
| RetailerProfile | RetailerProfile.RetailerProfile | Modern retailer system |
| Order/OrderItem | Order.Order/OrderItem | Items embedded in orders |
| Employee | Operations.Employee | User + company + truck |
| Truck | Operations.Truck | Fleet management |
| Shipment | Operations.Shipment | Delivery tracking |
| Invoice/InvoiceItem | Business.Invoice/InvoiceItem | Tax compliance |

#### ViewSets → Canister Methods
| Django ViewSet | Motoko Methods | Functionality |
|----------------|----------------|---------------|
| CompanyViewSet | createCompany, getCompanies, updateCompany, deleteCompany | Full CRUD |
| CategoryViewSet | createCategory, getCategories, updateCategory, deleteCategory | Full CRUD |
| ProductViewSet | createProduct, getProducts, updateProductQuantity, deleteProduct | Inventory management |
| OrderViewSet | createOrder, getOrders, updateOrderStatus | Order lifecycle |
| InvoiceViewSet | createInvoice, getInvoices | Financial management |

#### Custom Endpoints → Canister Methods
| Django Endpoint | Motoko Method | Purpose |
|-----------------|---------------|---------|
| /register/ | register() | User registration |
| /token/ | login() | Authentication |
| /logout/ | logout() | Session termination |
| /forgot-password/ | forgotPassword() | Password recovery |
| /verify-otp/ | verifyOTP() | OTP validation |
| /reset-password/ | resetPassword() | Password reset |
| /approve_order/ | approveOrder() | Order approval |
| /allocate-order/ | allocateOrder() | Manual allocation |
| /category-stock/ | getCategoryStockData() | Analytics |
| /store_qr/ | storeQRCode() | QR processing |
| /count/ | getCounts() | Statistics |

### Business Rules Preserved
1. **Order Lifecycle**: pending → allocated → delivered/cancelled
2. **Inventory Management**: Automatic quantity updates on shipment delivery
3. **Permission System**: Role-based access control maintained
4. **Tax Compliance**: HSN codes, GST rates, invoice generation
5. **Relationship Management**: Company-retailer connections with approval workflows
6. **Allocation Logic**: Employee assignment, truck capacity management

## Deployment & Usage

### Prerequisites
- DFX (DFINITY CLI) installed
- Motoko development environment
- Internet Computer network access

### Deployment Steps
```bash
cd backend/motoko-backend
dfx start --background  # Start local replica
dfx deploy  # Deploy to local network

# For mainnet deployment:
dfx deploy --network ic
```

### Canister Interaction
```bash
# Call methods via DFX CLI
dfx canister call vendor_backend register '("username", "email@example.com", "password", vec {"employee"})'

# Get public companies
dfx canister call vendor_backend getPublicCompanies '()'

# Create company
dfx canister call vendor_backend createCompany '("Company Name", "GSTIN123", "Address", "State", "City", "123456", opt "phone", opt "email", true, opt "description")'
```

### Frontend Integration
The canister provides HTTP-compatible responses and can be integrated with the existing frontend through:
- Direct canister calls
- HTTP gateway integration
- Candid interface generation

## Migration Benefits

### Advantages Over Django Backend
1. **Decentralization**: No single point of failure
2. **Scalability**: Automatic scaling on ICP
3. **Cost Efficiency**: Pay-per-use model
4. **Security**: Built-in cryptographic security
5. **Persistence**: Permanent data storage
6. **Global Access**: Worldwide availability

### Compatibility
- **API Compatibility**: All Django endpoints mapped to canister methods
- **Data Integrity**: All relationships and constraints preserved
- **Business Logic**: Complete feature parity
- **Authentication**: Enhanced with ICP identity system

## Development & Extending

### Adding New Features
1. Define types in appropriate model modules
2. Implement CRUD operations
3. Add business logic in main canister
4. Include authentication checks
5. Add comprehensive error handling

### Testing
```bash
# Run tests
dfx canister call vendor_backend_test runTests '()'
```

### Monitoring
- Use DFX logs for debugging
- Implement custom logging in canister methods
- Monitor canister cycles consumption

## Future Enhancements

### Planned Features
1. **Advanced Analytics**: Real-time dashboards and reporting
2. **Mobile Integration**: Direct mobile app connectivity
3. **Multi-Chain Support**: Cross-chain asset management
4. **AI Integration**: Predictive analytics and automation
5. **Advanced Security**: Multi-signature approvals, audit trails

### Integration Opportunities
1. **Payment Systems**: Direct crypto payments
2. **Supply Chain**: Blockchain-based tracking
3. **Identity Systems**: Decentralized identity verification
4. **IoT Integration**: Real-time inventory tracking

---

This Motoko backend provides complete feature parity with the original Django system while adding the benefits of decentralized infrastructure. All business processes, data relationships, and API contracts are preserved, ensuring seamless migration with enhanced capabilities.
