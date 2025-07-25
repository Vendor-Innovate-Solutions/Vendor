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
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/utils/icp-auth";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    group_name: "",
  });
  const [groups] = useState<string[]>(["Admin", "Manufacturer", "Employee", "Retailer"]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    // Ensure all fields are filled
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.group_name) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Attempting ICP registration...");
      
      const userType = formData.group_name.toLowerCase() as 'admin' | 'manufacturer' | 'employee' | 'retailer';
      const registerResult = await register(
        formData.username,
        formData.email,
        formData.password,
        userType
      );

      if (registerResult.success) {
        console.log("✅ ICP Registration Successful!", registerResult.user);
        setMessage("Registration successful! Redirecting...");

        // Redirect based on group/role
        setTimeout(() => {
          if (userType === "manufacturer") {
            router.replace("/manufacturer/company?first=true");
          } else if (userType === "admin") {
            router.replace("/manufacturer");
          } else if (userType === "employee") {
            router.replace("/employee");
          } else if (userType === "retailer") {
            router.replace("/retailer");
          } else {
            router.replace("/"); // fallback
          }
        }, 1500);
      } else {
        console.error("❌ ICP Registration failed:", registerResult.message);
        setError(registerResult.message || "Failed to register user.");
      }
    } catch (err) {
      console.error("🚨 ICP Registration Error:", err);
      setError("An error occurred while registering the user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen bg-black")}>
      <Card className="bg-gray-900 text-white border border-gray-700 w-full md:w-96">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription className="text-gray-400 border-b border-gray-600 pb-2">
            Create a new account by filling in the details below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Create a username"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create your password"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group_name">Select Group</Label>
                <select
                  id="group_name"
                  name="group_name"
                  required
                  className="bg-gray-900 text-white border border-gray-700"
                  value={formData.group_name}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select a Group --</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/authentication"
                className="text-blue-400 underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;