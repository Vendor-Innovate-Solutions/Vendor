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
  },

  // Get available employees for order
  getAvailableEmployees: async (orderId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [
        { id: 1, name: "John Doe", department: "Delivery" },
        { id: 2, name: "Jane Smith", department: "Warehouse" },
        { id: 3, name: "Bob Johnson", department: "Delivery" }
      ];
    } catch (error) {
      console.error('Get available employees error:', error);
      return [];
    }
  },

  // Allocate order to employee
  allocateOrder: async (orderId: number, employeeId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      console.log(`Allocating order ${orderId} to employee ${employeeId}`);
      return { success: true };
    } catch (error) {
      console.error('Allocate order error:', error);
      throw new Error('Failed to allocate order');
    }
  },

  // Get orders by company
  getOrdersByCompany: async (companyId: number) => {
    try {
      // Mock implementation - in real ICP, this would filter orders by company
      const allOrders = await orderService.getAllOrders();
      return allOrders.filter((order: any) => order.companyId === companyId);
    } catch (error) {
      console.error('Get orders by company error:', error);
      return [];
    }
  },

  // Approve order (create shipment)
  approveOrder: async (orderId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      console.log(`Approving order ${orderId}`);
      return { success: true };
    } catch (error) {
      console.error('Approve order error:', error);
      throw new Error('Failed to approve order');
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
  },

  // Get overview card data for manufacturer dashboard
  getOverviewCard: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return {
        totalOrders: 45,
        numStores: 12,
        deliveryAgents: 8,
        pendingOrders: 15
      };
    } catch (error) {
      console.error('Get overview card error:', error);
      return {
        totalOrders: 0,
        numStores: 0,
        deliveryAgents: 0,
        pendingOrders: 0
      };
    }
  }
};

// Shipment Management
export const shipmentService = {
  // Get all shipments
  getAllShipments: async () => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [];
    } catch (error) {
      console.error('Get shipments error:', error);
      return [];
    }
  },

  // Get shipments by company
  getShipmentsByCompany: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [];
    } catch (error) {
      console.error('Get shipments by company error:', error);
      return [];
    }
  },

  // Get shipment statistics
  getShipmentStats: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return {
        data: [
          { month: 'January', product: 'Product A', count: 12 },
          { month: 'January', product: 'Product B', count: 8 },
          { month: 'February', product: 'Product A', count: 19 },
          { month: 'February', product: 'Product B', count: 12 },
          { month: 'March', product: 'Product A', count: 15 },
          { month: 'March', product: 'Product B', count: 10 },
          { month: 'April', product: 'Product A', count: 22 },
          { month: 'April', product: 'Product B', count: 15 },
          { month: 'May', product: 'Product A', count: 18 },
          { month: 'May', product: 'Product B', count: 13 }
        ]
      };
    } catch (error) {
      console.error('Get shipment stats error:', error);
      return { data: [] };
    }
  }
};

// Accounting and Invoice Management
export const accountingService = {
  // Get invoice count by company
  getInvoiceCount: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return { count: 15 };
    } catch (error) {
      console.error('Get invoice count error:', error);
      return { count: 0 };
    }
  },

  // Get invoices by company
  getInvoicesByCompany: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [
        {
          id: 1,
          invoiceNumber: 'INV-001',
          customerName: 'Customer 1',
          amount: 1500.00,
          status: 'paid',
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          invoiceNumber: 'INV-002',
          customerName: 'Customer 2',
          amount: 2500.00,
          status: 'pending',
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    } catch (error) {
      console.error('Get invoices by company error:', error);
      return [];
    }
  },

  // Get retailers by company
  getRetailersByCompany: async (companyId: number) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [
        {
          id: 1,
          name: 'Retailer 1',
          email: 'retailer1@example.com',
          phone: '+1234567890',
          address: '123 Retail St'
        },
        {
          id: 2,
          name: 'Retailer 2',
          email: 'retailer2@example.com',
          phone: '+1234567891',
          address: '456 Shop Ave'
        }
      ];
    } catch (error) {
      console.error('Get retailers by company error:', error);
      return [];
    }
  },

  // Add retailer
  addRetailer: async (companyId: number, retailerData: any) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      console.log('Adding retailer:', retailerData);
      return {
        success: true,
        data: { id: Date.now(), ...retailerData }
      };
    } catch (error) {
      console.error('Add retailer error:', error);
      return {
        success: false,
        error: 'Failed to add retailer'
      };
    }
  },

  // Update retailer
  updateRetailer: async (retailerId: number, retailerData: any) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      console.log('Updating retailer:', retailerId, retailerData);
      return {
        success: true,
        data: { id: retailerId, ...retailerData }
      };
    } catch (error) {
      console.error('Update retailer error:', error);
      return {
        success: false,
        error: 'Failed to update retailer'
      };
    }
  }
};

// Category Management
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      // Mock implementation - replace with actual ICP call when available
      return [
        { id: 1, name: 'Electronics', description: 'Electronic products' },
        { id: 2, name: 'Clothing', description: 'Clothing and apparel' },
        { id: 3, name: 'Food', description: 'Food and beverages' },
        { id: 4, name: 'Books', description: 'Books and educational materials' }
      ];
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  },

  // Create category
  createCategory: async (name: string, description?: string) => {
    try {
      // Mock implementation - replace with actual ICP call when available
      console.log('Creating category:', name, description);
      return {
        success: true,
        data: { id: Date.now(), name, description }
      };
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        error: 'Failed to create category'
      };
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
  shipmentService,
  accountingService,
  categoryService,
};
