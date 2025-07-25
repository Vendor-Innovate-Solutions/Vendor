import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { getCurrentConfig, isDevelopment } from './icp-config';
import mockActor from './icp-mock';

// Get current configuration
const config = getCurrentConfig();
const CANISTER_ID = config.CANISTER_ID;
const HOST = config.HOST;

// For development, use mock actor
if (isDevelopment()) {
  console.log('🟡 Using Mock ICP Service for Development');
  console.log('💡 To use real ICP canister, deploy your backend and update icp-config.ts');
}

// IDL factory for the backend canister
export const idlFactory = ({ IDL }: any) => {
  // Define custom types
  const Result = IDL.Variant({ 
    ok: IDL.Text, 
    err: IDL.Text 
  });
  
  const UserId = IDL.Principal;
  const OrderId = IDL.Text;
  const ProductId = IDL.Text;
  const CompanyId = IDL.Text;

  const UserRole = IDL.Variant({
    Admin: IDL.Null,
    Company: IDL.Null,
    User: IDL.Null,
  });

  const User = IDL.Record({
    id: UserId,
    username: IDL.Text,
    email: IDL.Text,
    role: UserRole,
    created_at: IDL.Int,
  });

  const Company = IDL.Record({
    id: CompanyId,
    name: IDL.Text,
    description: IDL.Opt(IDL.Text),
    owner: UserId,
    is_public: IDL.Bool,
    created_at: IDL.Int,
  });

  const Product = IDL.Record({
    id: ProductId,
    name: IDL.Text,
    price: IDL.Float64,
    quantity: IDL.Nat,
    company: CompanyId,
    created_at: IDL.Int,
  });

  const OrderStatus = IDL.Variant({
    Pending: IDL.Null,
    Confirmed: IDL.Null,
    Shipped: IDL.Null,
    Delivered: IDL.Null,
    Cancelled: IDL.Null,
  });

  const Order = IDL.Record({
    id: OrderId,
    user: UserId,
    product: ProductId,
    quantity: IDL.Nat,
    total_price: IDL.Float64,
    status: OrderStatus,
    created_at: IDL.Int,
  });

  const AuthResult = IDL.Variant({
    ok: IDL.Record({ user: User, message: IDL.Text }),
    err: IDL.Text,
  });

  const UserResult = IDL.Variant({
    ok: User,
    err: IDL.Text,
  });

  const CompanyResult = IDL.Variant({
    ok: Company,
    err: IDL.Text,
  });

  const ProductResult = IDL.Variant({
    ok: Product,
    err: IDL.Text,
  });

  const OrderResult = IDL.Variant({
    ok: Order,
    err: IDL.Text,
  });

  const CompanyListResult = IDL.Variant({
    ok: IDL.Vec(Company),
    err: IDL.Text,
  });

  const ProductListResult = IDL.Variant({
    ok: IDL.Vec(Product),
    err: IDL.Text,
  });

  const OrderListResult = IDL.Variant({
    ok: IDL.Vec(Order),
    err: IDL.Text,
  });

  // Main service interface
  return IDL.Service({
    // Authentication
    login: IDL.Func([IDL.Text, IDL.Text], [AuthResult], []),
    register: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [AuthResult], []),
    logout: IDL.Func([], [Result], []),
    get_current_user: IDL.Func([], [UserResult], ['query']),

    // User management
    get_user_profile: IDL.Func([UserId], [UserResult], ['query']),
    update_user_profile: IDL.Func([IDL.Text, IDL.Text], [UserResult], []),

    // Company management
    create_company: IDL.Func([IDL.Text, IDL.Opt(IDL.Text), IDL.Bool], [CompanyResult], []),
    get_company: IDL.Func([CompanyId], [CompanyResult], ['query']),
    get_companies: IDL.Func([], [CompanyListResult], ['query']),
    update_company: IDL.Func([CompanyId, IDL.Text, IDL.Opt(IDL.Text), IDL.Bool], [CompanyResult], []),
    delete_company: IDL.Func([CompanyId], [Result], []),

    // Product management
    create_product: IDL.Func([IDL.Text, IDL.Float64, IDL.Nat, CompanyId], [ProductResult], []),
    get_product: IDL.Func([ProductId], [ProductResult], ['query']),
    get_products: IDL.Func([], [ProductListResult], ['query']),
    get_products_by_company: IDL.Func([CompanyId], [ProductListResult], ['query']),
    update_product: IDL.Func([ProductId, IDL.Text, IDL.Float64, IDL.Nat], [ProductResult], []),
    delete_product: IDL.Func([ProductId], [Result], []),

    // Order management
    create_order: IDL.Func([ProductId, IDL.Nat], [OrderResult], []),
    get_order: IDL.Func([OrderId], [OrderResult], ['query']),
    get_orders: IDL.Func([], [OrderListResult], ['query']),
    get_orders_by_user: IDL.Func([UserId], [OrderListResult], ['query']),
    update_order_status: IDL.Func([OrderId, OrderStatus], [OrderResult], []),
    cancel_order: IDL.Func([OrderId], [Result], []),
  });
};

let actor: any;

if (isDevelopment()) {
  // Use mock actor for development
  actor = mockActor;
} else {
  // Initialize HTTP Agent for production
  const agent = new HttpAgent({ host: HOST });

  // Fetch root key for local development
  if (HOST.includes('127.0.0.1')) {
    agent.fetchRootKey();
  }

  // Create actor instance
  actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
}

export default actor;
export { CANISTER_ID, HOST };
