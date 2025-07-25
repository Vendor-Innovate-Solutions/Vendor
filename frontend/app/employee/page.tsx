"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OrdersTable } from "@/components/employee/OrdersTable";
import { OrderDetails } from "@/components/employee/OrderDetails";
import { DeliveryStatus } from "@/components/employee/DeliveryStatus";
import { CancelOrderDialog } from "@/components/employee/CancelOrderDialog";
import { DeliveryOrder } from "@/components/employee/types";
import { orderService } from "@/utils/icp-api";
import { isAuthenticated, getCurrentUser } from "@/utils/icp-auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EmployeePage({ params }: PageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/authentication');
      return;
    }
  }, [router]);

  // Resolve params Promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const user = getCurrentUser();
        if (!user) {
          throw new Error("No authenticated user found");
        }
        
        setEmployeeId(user.id?.toString() || "1");
        
        // Fetch orders assigned to this employee using ICP service
        const allOrders = await orderService.getAllOrders();
        // Filter orders assigned to this employee (mock filtering)
        const employeeOrders = allOrders.filter((order: any) => 
          order.assignedEmployeeId === user.id || order.employeeId === user.id
        );
        setOrders(employeeOrders);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated()) {
      fetchEmployeeData();
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchShipments() {
      if (!employeeId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get shipments assigned to this employee using ICP service
        const allOrders = await orderService.getAllOrders();
        const employeeOrders = allOrders.filter((order: any) => 
          order.assignedEmployeeId?.toString() === employeeId || 
          order.employeeId?.toString() === employeeId
        );

        const mappedOrders: DeliveryOrder[] = employeeOrders.map((order: any) => ({
          orderId: `ORD-${order.id}`,
          orderName: `Order-${order.id}`,
          phoneNumber: order.customerPhone || "N/A",
          address: order.customerAddress || "N/A",
          isDelivered: order.status === "delivered",
          items: order.items || [`Order-${order.id}`],
          isCancelled: order.status === "cancelled",
          cancellationReason:
            order.status === "cancelled" ? order.cancellationReason || "Unknown" : undefined,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchShipments();
  }, [employeeId]);

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrderId && selectedReason) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrderId
            ? {
                ...order,
                isCancelled: true,
                cancellationReason: selectedReason,
              }
            : order
        )
      );
      setDialogOpen(false);
      setSelectedOrderId(null);
      setSelectedReason("");
    }
  };

  const handleUpdateStatus = async (shipmentId: number) => {
    try {
      // Update order status using ICP service
      await orderService.updateOrderStatus(shipmentId, "delivered");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === `ORD-${shipmentId}`
            ? { ...order, isDelivered: true }
            : order
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  };

  const calculatePieChartData = useMemo(() => {
    const deliveredCount = orders.filter(
      (order) => order.isDelivered && !order.isCancelled
    ).length;
    const notDeliveredCount = orders.filter(
      (order) => !order.isDelivered && !order.isCancelled
    ).length;
    const cancelledCount = orders.filter((order) => order.isCancelled).length;

    return [
      { name: "Delivered", value: deliveredCount, color: "#22c55e" },
      { name: "Pending", value: notDeliveredCount, color: "#3b82f6" },
      { name: "Cancelled", value: cancelledCount, color: "#eab308" },
    ];
  }, [orders]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">
        Employee Dashboard - ID : {employeeId || "Loading..."}
      </h1>

      {error && <p className="text-red-500 p-4">Error: {error}</p>}
      {loading && <p className="text-slate-300 p-4">Loading shipments...</p>}

      <CancelOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
        onConfirm={handleCancelOrder}
      />

      <OrdersTable
        orders={orders}
        onCancelClick={handleCancelClick}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderDetails />
        {mounted && (
          <DeliveryStatus
            data={calculatePieChartData}
            totalOrders={orders.length}
          />
        )}
      </div>
    </div>
  );
}