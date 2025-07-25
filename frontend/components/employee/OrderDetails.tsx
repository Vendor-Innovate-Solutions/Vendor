import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { orderService } from "@/utils/icp-api";
import { getCurrentUser, restoreSession } from "@/utils/icp-auth";

interface Order {
  id: number;
  requiredQty: number;
  orderDate: string;
  status: string;
  retailerId: number;
  productId: number;
}

export const OrderDetails = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        // Try to restore session
        const sessionRestored = await restoreSession();
        if (!sessionRestored) {
          throw new Error("No authenticated user found. Please log in again.");
        }
      }

      console.log("🔄 Fetching orders from ICP backend...");
      
      // Get all orders for now (in production, filter by employee assignment)
      const orderData = await orderService.getAllOrders();
      
      if (Array.isArray(orderData)) {
        const formattedOrders: Order[] = orderData.map((order: any) => {
          // Extract status from ICP variant format
          let status = 'Pending';
          if (order.status) {
            for (const [key, value] of Object.entries(order.status)) {
              if (value === null) {
                status = key.charAt(0).toUpperCase() + key.slice(1);
                break;
              }
            }
          }

          return {
            id: order.id,
            requiredQty: order.requiredQty,
            orderDate: new Date(Number(order.orderDate) / 1000000).toISOString(), // Convert nanoseconds to milliseconds
            status: status,
            retailerId: order.retailerId,
            productId: order.productId,
          };
        });

        setOrders(formattedOrders);
        console.log("✅ Fetched orders from ICP:", formattedOrders);
      } else {
        console.log("⚠️ No orders found or invalid response format");
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Orders Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-slate-300 p-4">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {error}</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-300 p-4">No orders allocated.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 font-medium text-slate-300">
                    Order ID
                  </th>
                  <th className="text-left p-4 font-medium text-slate-300">
                    Required Quantity
                  </th>
                  <th className="text-left p-4 font-medium text-slate-300">
                    Order Date
                  </th>
                  <th className="text-left p-4 font-medium text-slate-300">
                    Retailer ID
                  </th>
                  <th className="text-left p-4 font-medium text-slate-300">
                    Product ID
                  </th>
                  <th className="text-left p-4 font-medium text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700"
                  >
                    <td className="p-4 text-slate-300">{order.id}</td>
                    <td className="p-4 text-slate-300">{order.requiredQty}</td>
                    <td className="p-4 text-slate-300">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-300">{order.retailerId}</td>
                    <td className="p-4 text-slate-300">{order.productId}</td>
                    <td className="p-4 text-slate-300">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};