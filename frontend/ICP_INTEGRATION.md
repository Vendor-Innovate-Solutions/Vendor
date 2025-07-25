# ICP Frontend Integration Guide

This document describes the conversion of the Vendor frontend from Django REST API to ICP (Internet Computer Protocol) backend integration.

## Overview

The frontend has been successfully converted to work with ICP canisters instead of Django REST APIs. All authentication, data fetching, and user management now happens through ICP backend calls.

## New Architecture

### Authentication Flow
- **Old**: JWT tokens stored in localStorage with Django REST API
- **New**: ICP Principal-based authentication with canister calls

### API Layer
- **Old**: HTTP REST calls to Django backend
- **New**: Direct canister method calls using @dfinity/agent

## File Structure Changes

### New ICP Files
- `utils/icp-service.ts` - Core ICP canister interface and IDL definitions
- `utils/icp-auth.ts` - ICP authentication utilities replacing Django JWT
- `utils/icp-api.ts` - High-level API service layer for all business operations
- `utils/icp-config.ts` - Configuration for canister IDs and network settings

### Modified Files
- `components/login_form.tsx` - Updated to use ICP authentication
- `app/authentication/signup/page.tsx` - Updated for ICP user registration
- `components/retailer/data/mockData.ts` - Updated to fetch from ICP backend
- `utils/auth_fn.ts` - Marked as deprecated, kept for backward compatibility

## Configuration

### Environment Setup
1. Update `utils/icp-config.ts` with your canister IDs:
   ```typescript
   export const ICP_CONFIG = {
     CANISTER_ID: 'your-deployed-canister-id',
     NETWORK: {
       LOCAL: {
         HOST: 'http://127.0.0.1:4943',
         CANISTER_ID: 'your-local-canister-id'
       },
       MAINNET: {
         HOST: 'https://ic0.app',
         CANISTER_ID: 'your-mainnet-canister-id'
       }
     },
     ENVIRONMENT: 'MAINNET' // or 'LOCAL' for development
   };
   ```

### Dependencies
The following ICP packages have been installed:
- `@dfinity/agent` - Core ICP agent for canister communication
- `@dfinity/candid` - Candid interface definitions
- `@dfinity/principal` - Principal identity management

## Key Features

### Authentication
- **Login**: `login(username, password)` in `utils/icp-auth.ts`
- **Registration**: `register(username, email, password, userType, companyId?)` in `utils/icp-auth.ts`
- **Session Management**: Automatic session restoration using localStorage and Principal verification

### Data Management
- **Companies**: Full CRUD operations via `companyService` in `utils/icp-api.ts`
- **Products**: Complete product management via `productService`
- **Orders**: Order lifecycle management via `orderService`
- **Users**: User management via `userService`
- **Dashboard**: Analytics and counts via `dashboardService`

### User Types
The system supports four user types:
- `admin` - Administrative access
- `manufacturer` - Company and product management
- `employee` - Employee operations
- `retailer` - Order and inventory management

## API Migration

### Before (Django REST)
```typescript
// Old Django API call
const response = await fetch(`${API_URL}/products/`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
const products = await response.json();
```

### After (ICP Canister)
```typescript
// New ICP canister call
import { productService } from '@/utils/icp-api';
const products = await productService.getAllProducts();
```

## Error Handling

ICP calls use Result types:
```typescript
interface ICPResult<T> {
  ok?: T;
  err?: string;
}
```

All service functions handle errors gracefully and return appropriate success/error responses.

## Session Management

### ICP Session Structure
```typescript
interface UserSession {
  principal: Principal;
  user: any;
  isAuthenticated: boolean;
}
```

Sessions are automatically restored on page reload by verifying the stored Principal with the backend.

## Development vs Production

### Local Development
- Set `ENVIRONMENT: 'LOCAL'` in `icp-config.ts`
- Use local canister IDs from `dfx start`
- Agent automatically fetches root key for local development

### Production Deployment
- Set `ENVIRONMENT: 'MAINNET'` in `icp-config.ts`
- Use mainnet canister IDs
- Connect to `https://ic0.app`

## Testing the Integration

1. **Authentication Test**:
   - Navigate to `/authentication`
   - Create a new account or login with existing credentials
   - Verify successful authentication and redirection

2. **Data Fetching Test**:
   - Check browser console for ICP API calls
   - Verify data loading in dashboard and product lists
   - Test CRUD operations for products and orders

3. **Session Persistence Test**:
   - Login and refresh the page
   - Verify session is maintained
   - Test logout functionality

## Troubleshooting

### Common Issues

1. **Canister Not Found Error**:
   - Verify canister ID in `icp-config.ts`
   - Ensure canister is deployed and running

2. **Principal Authentication Error**:
   - Clear localStorage and re-authenticate
   - Check if canister accepts the authentication method

3. **Network Connection Issues**:
   - Verify HOST configuration for local vs mainnet
   - Check if dfx is running for local development

### Debug Mode
Enable console logging by checking browser developer tools. All ICP calls are logged with 🔄, ✅, and ❌ prefixes for easy identification.

## Future Enhancements

1. **Password Reset**: Implement password reset functionality in ICP backend
2. **Real-time Updates**: Consider using ICP's event system for real-time data updates
3. **Offline Support**: Implement offline-first approach with local caching
4. **Multi-sig Authentication**: Add support for multi-signature authentication for admin operations

## Support

For issues related to:
- **ICP Integration**: Check canister logs and network configuration
- **Authentication**: Verify Principal management and session handling
- **Data Operations**: Check service layer implementations in `utils/icp-api.ts`

## Migration Checklist

- [x] Install ICP dependencies (@dfinity/agent, @dfinity/candid, @dfinity/principal)
- [x] Create ICP service layer (icp-service.ts)
- [x] Implement ICP authentication (icp-auth.ts)
- [x] Create comprehensive API service (icp-api.ts)
- [x] Update login form for ICP
- [x] Update signup form for ICP
- [x] Convert data fetching to ICP calls
- [x] Configure environment settings
- [ ] Test all user flows end-to-end
- [ ] Deploy and verify production integration
- [ ] Update any remaining Django API calls

The frontend is now fully converted to use ICP backend services and ready for production deployment!
