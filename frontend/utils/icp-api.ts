import actor from './icp-service';
import { getCurrentPrincipal } from './icp-auth';

/**
 * ICP API Service Layer
 * 
 * This file provides all the API functionality that was previously 
 * handled by Django REST API calls, now using ICP canisters.
 */

// Define result types
interface ICPResult<T> {
  ok?: T;
  err?: string;
}

// Company Management
export const companyService = {
  // Get all companies
  getAllCompanies: async () => {
    try {
      const result = await actor.getAllCompanies() as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get companies error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get companies error:', error);
      return [];
    }
  },

  // Get company by ID
  getCompanyById: async (companyId: number) => {
    try {
      const result = await actor.getCompanyById(companyId) as ICPResult<any>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get company error:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Get company error:', error);
      return null;
    }
  },

  // Create company
  createCompany: async (name: string, address: string, phone: string, email: string, website?: string, manufacturerId?: number) => {
    try {
      const result = await actor.createCompany(
        name, 
        address, 
        phone, 
        email, 
        website ? [website] : [], 
        manufacturerId || 1
      ) as ICPResult<any>;
      
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Create company error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Update company
  updateCompany: async (companyId: number, companyData: any) => {
    try {
      const result = await actor.updateCompany(companyId, companyData) as ICPResult<any>;
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Update company error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Get companies by manufacturer
  getCompaniesByManufacturer: async (manufacturerId: number) => {
    try {
      const result = await actor.getCompaniesByManufacturer(manufacturerId) as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get companies by manufacturer error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get companies by manufacturer error:', error);
      return [];
    }
  }
};

// Product Management
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const result = await actor.getAllProducts() as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get products error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  },

  // Get product by ID
  getProductById: async (productId: number) => {
    try {
      const result = await actor.getProductById(productId) as ICPResult<any>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get product error:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Get product error:', error);
      return null;
    }
  },

  // Create product
  createProduct: async (name: string, categoryId: number, companyId: number, price: number, description?: string, imageUrl?: string) => {
    try {
      const result = await actor.createProduct(
        name, 
        categoryId, 
        companyId, 
        price, 
        description ? [description] : [], 
        imageUrl ? [imageUrl] : []
      ) as ICPResult<any>;
      
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Create product error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Update product
  updateProduct: async (productId: number, productData: any) => {
    try {
      const result = await actor.updateProduct(productId, productData) as ICPResult<any>;
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Get products by company
  getProductsByCompany: async (companyId: number) => {
    try {
      const result = await actor.getProductsByCompany(companyId) as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get products by company error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get products by company error:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number) => {
    try {
      const result = await actor.getProductsByCategory(categoryId) as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get products by category error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get products by category error:', error);
      return [];
    }
  }
};

// Order Management
export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const result = await actor.getAllOrders() as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get orders error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number) => {
    try {
      const result = await actor.getOrderById(orderId) as ICPResult<any>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get order error:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Get order error:', error);
      return null;
    }
  },

  // Create order
  createOrder: async (retailerId: number, productId: number, requiredQty: number, notes?: string) => {
    try {
      const result = await actor.createOrder(
        retailerId, 
        productId, 
        requiredQty, 
        notes ? [notes] : []
      ) as ICPResult<any>;
      
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      const statusVariant = { [status]: null };
      const result = await actor.updateOrderStatus(orderId, statusVariant) as ICPResult<any>;
      
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Update order status error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Get orders by retailer
  getOrdersByRetailer: async (retailerId: number) => {
    try {
      const result = await actor.getOrdersByRetailer(retailerId) as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get orders by retailer error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get orders by retailer error:', error);
      return [];
    }
  },

  // Get orders by product
  getOrdersByProduct: async (productId: number) => {
    try {
      const result = await actor.getOrdersByProduct(productId) as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get orders by product error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get orders by product error:', error);
      return [];
    }
  }
};

// User Management
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const result = await actor.getAllUsers() as ICPResult<any[]>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get users error:', result.err);
        return [];
      }
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  },

  // Get user by ID
  getUserById: async (userId: number) => {
    try {
      const result = await actor.getUserById(userId) as ICPResult<any>;
      if (result.ok) {
        return result.ok;
      } else {
        console.error('Get user error:', result.err);
        return null;
      }
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Update user
  updateUser: async (userId: number, userData: any) => {
    try {
      const result = await actor.updateUser(userId, userData) as ICPResult<any>;
      if (result.ok) {
        return { success: true, data: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }
};

// Dashboard and Analytics
export const dashboardService = {
  // Get order count
  getOrderCount: async (userId: number) => {
    try {
      const count = await actor.getOrderCount(userId);
      return count;
    } catch (error) {
      console.error('Get order count error:', error);
      return 0;
    }
  },

  // Get product count
  getProductCount: async (userId: number) => {
    try {
      const count = await actor.getProductCount(userId);
      return count;
    } catch (error) {
      console.error('Get product count error:', error);
      return 0;
    }
  },

  // Get company count
  getCompanyCount: async (userId: number) => {
    try {
      const count = await actor.getCompanyCount(userId);
      return count;
    } catch (error) {
      console.error('Get company count error:', error);
      return 0;
    }
  },

  // Get user count
  getUserCount: async (userId: number) => {
    try {
      const count = await actor.getUserCount(userId);
      return count;
    } catch (error) {
      console.error('Get user count error:', error);
      return 0;
    }
  }
};

// Utility function to get current user ID from session
export const getCurrentUserId = (): number | null => {
  const principal = getCurrentPrincipal();
  if (!principal) return null;
  
  // In a real implementation, you'd need to maintain a mapping 
  // between principals and user IDs, or include the user ID in the session
  // For now, return a placeholder
  return 1;
};

export default {
  companyService,
  productService,
  orderService,
  userService,
  dashboardService,
  getCurrentUserId
};
