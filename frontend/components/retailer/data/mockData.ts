import { productService, orderService } from '../../../utils/icp-api';
import { getCurrentUser } from '../../../utils/icp-auth';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

export let PRODUCTS: Product[] = [];
export let ORDERS: Order[] = [];

export const fetchStockFromAPI = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log("Server-side rendering detected, skipping API call");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log("No authenticated user found");
      return;
    }

    console.log("🔄 Fetching products from ICP backend...");
    const data = await productService.getAllProducts();

    if (Array.isArray(data)) {
      PRODUCTS = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price || 100.0, // Default price if missing
        category: product.categoryId?.toString() || 'Unknown',
        stock: Math.floor(Math.random() * 100), // Mock stock for now
        image: product.imageUrl || "/api/placeholder/200/200", // Placeholder image
      }));

      console.log("✅ Fetched products from ICP:", PRODUCTS);
    } else {
      console.log("⚠️ No products found or invalid response format");
    }
  } catch (error) {
    console.error("❌ Failed to fetch products from ICP API:", error);
  }
};

export const fetchOrdersFromAPI = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log("Server-side rendering detected, skipping API call");
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log("No authenticated user found");
      return;
    }

    console.log("🔄 Fetching orders from ICP backend...");
    
    // Get orders for the current user (if they're a retailer)
    let orderData;
    if (currentUser.userType && 'retailer' in currentUser.userType) {
      orderData = await orderService.getOrdersByRetailer(currentUser.id);
    } else {
      orderData = await orderService.getAllOrders();
    }

    if (Array.isArray(orderData)) {
      ORDERS = orderData.map((order: any) => {
        const product = PRODUCTS.find((p) => p.id === order.productId);
        const statusMapping: { [key: string]: string } = {
          'pending': 'Pending',
          'confirmed': 'Confirmed',
          'shipped': 'Shipped',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled'
        };
        
        // Extract status from ICP variant format
        let status = 'Pending';
        if (order.status) {
          for (const [key, value] of Object.entries(order.status)) {
            if (value === null) {
              status = statusMapping[key] || key;
              break;
            }
          }
        }

        return {
          id: `ORD-${order.id}`,
          date: new Date(Number(order.orderDate) / 1000000).toLocaleDateString("en-US"), // Convert nanoseconds to milliseconds
          status: status,
          total: order.requiredQty * (product?.price || 100.0), // Default price if not found
          items: order.requiredQty,
        };
      });

      console.log("✅ Fetched orders from ICP:", ORDERS);
    } else {
      console.log("⚠️ No orders found or invalid response format");
    }
  } catch (error) {
    console.error("❌ Failed to fetch orders from ICP API:", error);
  }
};

// First fetch stock, then fetch orders (only in browser environment)
if (typeof window !== 'undefined') {
  fetchStockFromAPI().then(() => {
    fetchOrdersFromAPI();
  });
}