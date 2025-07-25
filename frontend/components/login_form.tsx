"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Chrome } from "lucide-react";
import Link from "next/link";
import { login } from "@/utils/icp-auth";
import { companyService } from "@/utils/icp-api";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manufacturer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("🔄 Attempting ICP login...");
      
      const loginResult = await login(username, password);
      
      if (loginResult.success) {
        console.log("✅ ICP Login Successful!", loginResult.user);
        
        // Get user's company information
        if (loginResult.user && loginResult.user.companyId) {
          const companyData = await companyService.getCompanyById(loginResult.user.companyId);
          if (companyData) {
            localStorage.setItem("company_id", companyData.id.toString());
          }
        }

        // Route based on user type
        const userType = loginResult.user?.userType;
        if (userType) {
          if ('manufacturer' in userType) {
            router.replace("/manufacturer");
          } else if ('employee' in userType) {
            router.replace("/employee");
          } else if ('retailer' in userType) {
            router.replace("/retailer");
          } else if ('admin' in userType) {
            router.replace("/manufacturer"); // Default to manufacturer dashboard for admin
          }
        } else {
          // Fallback to selected role
          if (role === "manufacturer") {
            router.replace("/manufacturer");
          } else if (role === "employee") {
            router.replace("/employee");
          } else if (role === "retailer") {
            router.replace("/retailer");
          }
        }
      } else {
        console.error("❌ ICP Login failed:", loginResult.message);
        setError(loginResult.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("🚨 ICP Login Error:", err);
      setError("Server error. Please check if the ICP backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black text-white border border-white-300 w-full md:w-96">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-gray-900 text-white border-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Select Role</Label>
                <select
                  id="role"
                  className="bg-gray-900 text-white border border-gray-700 w-full h-9 px-3 rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="employee">Employee</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>

              <a
                href="/authentication/forgot-password"
                className="inline-block text-sm text-blue-400 underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/authentication/signup"
                className="text-blue-400 underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
