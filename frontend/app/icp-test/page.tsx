"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { login, register, getCurrentUser, isAuthenticated, restoreSession } from '@/utils/icp-auth';
import { companyService, productService, orderService, dashboardService } from '@/utils/icp-api';

const ICPTestPage = () => {
  const [status, setStatus] = useState<string>('Ready to test ICP integration');
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    // Try to restore session on component mount
    const checkSession = async () => {
      const restored = await restoreSession();
      if (restored) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setStatus('Session restored successfully');
        addTestResult('✅ Session restored from localStorage');
      } else {
        setStatus('No active session found');
        addTestResult('⚠️ No active session');
      }
    };

    checkSession();
  }, []);

  const testLogin = async () => {
    try {
      setStatus('Testing login...');
      addTestResult('🔄 Testing ICP authentication...');
      
      const result = await login(loginForm.username, loginForm.password);
      
      if (result.success) {
        setUser(result.user);
        setStatus('Login successful!');
        addTestResult('✅ Login successful');
      } else {
        setStatus(`Login failed: ${result.message}`);
        addTestResult(`❌ Login failed: ${result.message}`);
      }
    } catch (error) {
      setStatus(`Login error: ${error}`);
      addTestResult(`❌ Login error: ${error}`);
    }
  };

  const testRegistration = async () => {
    try {
      setStatus('Testing registration...');
      addTestResult('🔄 Testing ICP registration...');
      
      const result = await register(
        'testuser' + Date.now(),
        'test@example.com',
        'password123',
        'manufacturer'
      );
      
      if (result.success) {
        setUser(result.user);
        setStatus('Registration successful!');
        addTestResult('✅ Registration successful');
      } else {
        setStatus(`Registration failed: ${result.message}`);
        addTestResult(`❌ Registration failed: ${result.message}`);
      }
    } catch (error) {
      setStatus(`Registration error: ${error}`);
      addTestResult(`❌ Registration error: ${error}`);
    }
  };

  const testDataFetching = async () => {
    try {
      setStatus('Testing data fetching...');
      addTestResult('🔄 Testing ICP data services...');

      // Test company service
      const companies = await companyService.getAllCompanies();
      addTestResult(`📊 Found ${companies.length} companies`);

      // Test product service
      const products = await productService.getAllProducts();
      addTestResult(`📦 Found ${products.length} products`);

      // Test order service
      const orders = await orderService.getAllOrders();
      addTestResult(`📋 Found ${orders.length} orders`);

      // Test dashboard service (if user is authenticated)
      if (user) {
        const orderCount = await dashboardService.getOrderCount(user.id);
        const productCount = await dashboardService.getProductCount(user.id);
        addTestResult(`📈 User stats - Orders: ${orderCount}, Products: ${productCount}`);
      }

      setStatus('Data fetching completed!');
      addTestResult('✅ All data services working');
    } catch (error) {
      setStatus(`Data fetching error: ${error}`);
      addTestResult(`❌ Data fetching error: ${error}`);
    }
  };

  const testCompanyCreation = async () => {
    if (!user) {
      addTestResult('❌ User must be logged in to create company');
      return;
    }

    try {
      setStatus('Testing company creation...');
      addTestResult('🔄 Creating test company...');

      const result = await companyService.createCompany(
        'Test Company ' + Date.now(),
        '123 Test Street',
        '+1234567890',
        'test@company.com',
        'https://testcompany.com',
        user.id
      );

      if (result.success) {
        setStatus('Company created successfully!');
        addTestResult('✅ Company creation successful');
      } else {
        setStatus(`Company creation failed: ${result.error}`);
        addTestResult(`❌ Company creation failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Company creation error: ${error}`);
      addTestResult(`❌ Company creation error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setStatus('Test results cleared');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">ICP Integration Test Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-400">{status}</p>
            {user && (
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <h3 className="text-lg font-semibold">Current User:</h3>
                <pre className="text-sm text-gray-300 mt-2">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>Authentication Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={testLogin} className="bg-blue-600 hover:bg-blue-700">
                Test Login
              </Button>
              <Button onClick={testRegistration} className="bg-green-600 hover:bg-green-700">
                Test Registration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>Data Service Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDataFetching} className="bg-purple-600 hover:bg-purple-700">
                Test Data Fetching
              </Button>
              <Button onClick={testCompanyCreation} className="bg-orange-600 hover:bg-orange-700">
                Test Company Creation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Test Results</CardTitle>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-400">No test results yet. Run some tests!</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ICPTestPage;
