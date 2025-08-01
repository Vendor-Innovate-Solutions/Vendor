'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, UserPlus, FileInput, Building2, Settings, CreditCard } from "lucide-react";
import Link from 'next/link';
import { accountingService } from "@/utils/icp-api";
import { getCurrentUser } from "@/utils/icp-auth";

export default function AccountingDashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
  const fetchStats = async () => {
    try {
      // Get current user to verify authentication
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.log('No authenticated user found');
        return;
      }

      const companyId = localStorage.getItem('company_id');
      if (!companyId) {
        console.log('No company ID found');
        return;
      }

      // Fetch invoice count using ICP service
      const countResult = await accountingService.getInvoiceCount(parseInt(companyId));
      
      // Fetch all invoices for the company using ICP service
      const invoices = await accountingService.getInvoicesByCompany(parseInt(companyId));

      // Calculate pending payments and total revenue
      let pendingPayments = invoices.filter(
        (inv: any) => inv.status && inv.status.toLowerCase() === 'pending'
      ).length;

      let totalRevenue = invoices.reduce(
        (sum: number, inv: any) => sum + (parseFloat(inv.amount) || 0), 0
      );

      setStats({
        totalInvoices: countResult.count || invoices.length,
        pendingPayments,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching accounting stats:', error);
    }
  };

  fetchStats();
}, []);

  const menuItems = [
    { icon: <FileText className="h-6 w-6" />, title: "Create New Bill", href: "/manufacturer/accounting/createBill" },
    { icon: <UserPlus className="h-6 w-6" />, title: "Add New Customer", href: "/manufacturer/accounting/addCustomer" },
    { icon: <FileInput className="h-6 w-6" />, title: "Customer Invoices", href: "/manufacturer/accounting/customerInvoice" },
    { icon: <Building2 className="h-6 w-6" />, title: "Vendor Bills", href: "/manufacturer/accounting/vendorBills" },
    { icon: <Settings className="h-6 w-6" />, title: "Configure Documents", href: "/manufacturer/accounting/configureDocuments" },
    { icon: <CreditCard className="h-6 w-6" />, title: "Track Payment", href: "/manufacturer/accounting/trackPayment" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-[#1E293B] border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-400">Accounting Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#0F172A] border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.totalInvoices}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0F172A] border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stats.pendingPayments}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0F172A] border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex flex-col items-center justify-center p-8 bg-[#1E293B] rounded-lg border border-blue-500/20 hover:bg-blue-900/20 transition-colors duration-200 group"
              >
                <div className="mb-4 text-blue-400 group-hover:text-blue-300">
                  {item.icon}
                </div>
                <span className="text-white">{item.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}