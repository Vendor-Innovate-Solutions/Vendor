// Mock ICP Service for Development and Testing
// This service provides mock data and simulates ICP canister behavior
// Replace this with real ICP service when you have deployed canisters

interface ICPResult<T> {
  ok?: T;
  err?: string;
}

// Mock data storage
let mockUsers: any[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@vendor.com',
    password: 'hashed_password',
    userType: { admin: null },
    isActive: true,
    profilePicture: null,
    phone: null,
    companyId: [1],
    address: null,
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  },
  {
    id: 2,
    username: 'manufacturer1',
    email: 'manufacturer@vendor.com',
    password: 'hashed_password',
    userType: { manufacturer: null },
    isActive: true,
    profilePicture: null,
    phone: null,
    companyId: [1],
    address: null,
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  },
];

let mockCompanies: any[] = [
  {
    id: 1,
    name: 'Test Manufacturing Co.',
    description: ['A test manufacturing company'],
    address: '123 Manufacturing St.',
    phone: '+1234567890',
    email: 'contact@testmfg.com',
    website: ['https://testmfg.com'],
    logoUrl: null,
    isPublic: true,
    manufacturerId: 2,
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  }
];

let mockProducts: any[] = [
  {
    id: 1,
    name: 'Test Product 1',
    categoryId: 1,
    companyId: 1,
    price: 99.99,
    description: ['A test product'],
    imageUrl: null,
    isActive: true,
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  },
  {
    id: 2,
    name: 'Test Product 2',
    categoryId: 1,
    companyId: 1,
    price: 149.99,
    description: ['Another test product'],
    imageUrl: null,
    isActive: true,
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  }
];

let mockOrders: any[] = [
  {
    id: 1,
    retailerId: 3,
    productId: 1,
    requiredQty: 10,
    status: { pending: null },
    orderDate: Date.now() * 1000000,
    expectedDelivery: null,
    notes: ['Test order'],
    createdAt: Date.now() * 1000000,
    updatedAt: Date.now() * 1000000,
  }
];

let nextUserId = 3;
let nextCompanyId = 2;
let nextProductId = 3;
let nextOrderId = 2;

// Mock authentication state
let currentAuthenticatedUser: any = null;

// Mock ICP Actor
const mockActor = {
  // Authentication methods
  authenticate: async (username: string, password: string) => {
    console.log('🔄 Mock ICP: authenticate called with', username);
    
    // Simple mock authentication
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      currentAuthenticatedUser = user;
      return {
        success: true,
        message: 'Authentication successful',
        user: [user],
        principal: [{ toString: () => 'mock-principal-' + user.id }]
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials',
      user: [],
      principal: []
    };
  },

  register: async (username: string, email: string, password: string, userType: any, companyId?: number[]) => {
    console.log('🔄 Mock ICP: register called with', username, email, userType);
    
    // Check if user already exists
    if (mockUsers.find(u => u.username === username || u.email === email)) {
      return {
        success: false,
        message: 'User already exists',
        user: [],
        principal: []
      };
    }
    
    const newUser = {
      id: nextUserId++,
      username,
      email,
      password: 'hashed_' + password,
      userType,
      isActive: true,
      profilePicture: null,
      phone: null,
      companyId: companyId || [],
      address: null,
      createdAt: Date.now() * 1000000,
      updatedAt: Date.now() * 1000000,
    };
    
    mockUsers.push(newUser);
    currentAuthenticatedUser = newUser;
    
    return {
      success: true,
      message: 'Registration successful',
      user: [newUser],
      principal: [{ toString: () => 'mock-principal-' + newUser.id }]
    };
  },

  getUserByPrincipal: async (principal: any) => {
    console.log('🔄 Mock ICP: getUserByPrincipal called');
    if (currentAuthenticatedUser) {
      return { ok: currentAuthenticatedUser };
    }
    return { err: 'User not found' };
  },

  // User management
  createUser: async (username: string, email: string, password: string, userType: any, companyId?: number[]) => {
    const newUser = {
      id: nextUserId++,
      username,
      email,
      password: 'hashed_' + password,
      userType,
      isActive: true,
      profilePicture: null,
      phone: null,
      companyId: companyId || [],
      address: null,
      createdAt: Date.now() * 1000000,
      updatedAt: Date.now() * 1000000,
    };
    mockUsers.push(newUser);
    return { ok: newUser };
  },

  updateUser: async (userId: number, userData: any) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updatedAt: Date.now() * 1000000 };
      return { ok: mockUsers[userIndex] };
    }
    return { err: 'User not found' };
  },

  deleteUser: async (userId: number) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      mockUsers.splice(userIndex, 1);
      return { ok: 'User deleted successfully' };
    }
    return { err: 'User not found' };
  },

  getAllUsers: async () => {
    return { ok: mockUsers };
  },

  getUserById: async (userId: number) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? { ok: user } : { err: 'User not found' };
  },

  // Company management
  createCompany: async (name: string, address: string, phone: string, email: string, website?: string[], manufacturerId?: number) => {
    const newCompany = {
      id: nextCompanyId++,
      name,
      description: [],
      address,
      phone,
      email,
      website: website || [],
      logoUrl: null,
      isPublic: true,
      manufacturerId: manufacturerId || 1,
      createdAt: Date.now() * 1000000,
      updatedAt: Date.now() * 1000000,
    };
    mockCompanies.push(newCompany);
    return { ok: newCompany };
  },

  updateCompany: async (companyId: number, companyData: any) => {
    const companyIndex = mockCompanies.findIndex(c => c.id === companyId);
    if (companyIndex >= 0) {
      mockCompanies[companyIndex] = { ...mockCompanies[companyIndex], ...companyData, updatedAt: Date.now() * 1000000 };
      return { ok: mockCompanies[companyIndex] };
    }
    return { err: 'Company not found' };
  },

  deleteCompany: async (companyId: number) => {
    const companyIndex = mockCompanies.findIndex(c => c.id === companyId);
    if (companyIndex >= 0) {
      mockCompanies.splice(companyIndex, 1);
      return { ok: 'Company deleted successfully' };
    }
    return { err: 'Company not found' };
  },

  getAllCompanies: async () => {
    return { ok: mockCompanies };
  },

  getCompanyById: async (companyId: number) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company ? { ok: company } : { err: 'Company not found' };
  },

  getCompaniesByManufacturer: async (manufacturerId: number) => {
    const companies = mockCompanies.filter(c => c.manufacturerId === manufacturerId);
    return { ok: companies };
  },

  // Product management
  createProduct: async (name: string, categoryId: number, companyId: number, price: number, description?: string[], imageUrl?: string[]) => {
    const newProduct = {
      id: nextProductId++,
      name,
      categoryId,
      companyId,
      price,
      description: description || [],
      imageUrl: imageUrl?.[0] || null,
      isActive: true,
      createdAt: Date.now() * 1000000,
      updatedAt: Date.now() * 1000000,
    };
    mockProducts.push(newProduct);
    return { ok: newProduct };
  },

  updateProduct: async (productId: number, productData: any) => {
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex >= 0) {
      mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData, updatedAt: Date.now() * 1000000 };
      return { ok: mockProducts[productIndex] };
    }
    return { err: 'Product not found' };
  },

  deleteProduct: async (productId: number) => {
    const productIndex = mockProducts.findIndex(p => p.id === productId);
    if (productIndex >= 0) {
      mockProducts.splice(productIndex, 1);
      return { ok: 'Product deleted successfully' };
    }
    return { err: 'Product not found' };
  },

  getAllProducts: async () => {
    return { ok: mockProducts };
  },

  getProductById: async (productId: number) => {
    const product = mockProducts.find(p => p.id === productId);
    return product ? { ok: product } : { err: 'Product not found' };
  },

  getProductsByCompany: async (companyId: number) => {
    const products = mockProducts.filter(p => p.companyId === companyId);
    return { ok: products };
  },

  getProductsByCategory: async (categoryId: number) => {
    const products = mockProducts.filter(p => p.categoryId === categoryId);
    return { ok: products };
  },

  // Order management
  createOrder: async (retailerId: number, productId: number, requiredQty: number, notes?: string[]) => {
    const newOrder = {
      id: nextOrderId++,
      retailerId,
      productId,
      requiredQty,
      status: { pending: null },
      orderDate: Date.now() * 1000000,
      expectedDelivery: null,
      notes: notes || [],
      createdAt: Date.now() * 1000000,
      updatedAt: Date.now() * 1000000,
    };
    mockOrders.push(newOrder);
    return { ok: newOrder };
  },

  updateOrderStatus: async (orderId: number, status: any) => {
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex >= 0) {
      mockOrders[orderIndex] = { ...mockOrders[orderIndex], status, updatedAt: Date.now() * 1000000 };
      return { ok: mockOrders[orderIndex] };
    }
    return { err: 'Order not found' };
  },

  deleteOrder: async (orderId: number) => {
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex >= 0) {
      mockOrders.splice(orderIndex, 1);
      return { ok: 'Order deleted successfully' };
    }
    return { err: 'Order not found' };
  },

  getAllOrders: async () => {
    return { ok: mockOrders };
  },

  getOrderById: async (orderId: number) => {
    const order = mockOrders.find(o => o.id === orderId);
    return order ? { ok: order } : { err: 'Order not found' };
  },

  getOrdersByRetailer: async (retailerId: number) => {
    const orders = mockOrders.filter(o => o.retailerId === retailerId);
    return { ok: orders };
  },

  getOrdersByProduct: async (productId: number) => {
    const orders = mockOrders.filter(o => o.productId === productId);
    return { ok: orders };
  },

  // Dashboard and analytics
  getOrderCount: async (userId: number) => {
    return mockOrders.length;
  },

  getProductCount: async (userId: number) => {
    return mockProducts.length;
  },

  getCompanyCount: async (userId: number) => {
    return mockCompanies.length;
  },

  getUserCount: async (userId: number) => {
    return mockUsers.length;
  },
};

export default mockActor;
export { mockUsers, mockCompanies, mockProducts, mockOrders };
