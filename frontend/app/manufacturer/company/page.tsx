"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { companyService } from "@/utils/icp-api";
import { getCurrentUser, isAuthenticated } from "@/utils/icp-auth";

type Company = {
  id?: number | bigint;
  name: string;
  gstin: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  description?: string;
  is_public?: boolean;
  owner?: string;
  created_at?: number | bigint;
  website?: string; // For form compatibility
};

const initialCompanyState: Company = {
  id: undefined,
  name: "",
  gstin: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
};


function CompanyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstTime = searchParams.get("first") === "true";
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formCompany, setFormCompany] = useState<Company>(initialCompanyState);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
   // On mount, if first time, force create mode
  useEffect(() => {
    if (isFirstTime) {
      setIsCreating(true);
      setIsEditing(true);
      setSelectedCompany(null);
      setFormCompany(initialCompanyState);
    }
  }, [isFirstTime]);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");
      try {
        if (!isAuthenticated()) {
          router.push("/");
          return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
          router.push("/");
          return;
        }

        // Get company data from ICP
        const companies = await companyService.getAllCompanies();
        
        setCompanies(companies);
        
        if (companies.length > 0) {
          // Find company for current user
          const userCompany = companies.find(company => 
            company.owner_id === currentUser.principal
          );
          
          if (userCompany) {
            setSelectedCompany(userCompany);
            setFormCompany(userCompany);
            setIsCreating(false);
            setIsEditing(false);
          } else {
            // No company found for user, show creation form
            setSelectedCompany(null);
            setFormCompany(initialCompanyState);
            setIsCreating(true);
            setIsEditing(true);
          }
        } else {
          // No companies exist, show creation form
          setCompanies([]);
          setSelectedCompany(null);
          setFormCompany(initialCompanyState);
          setIsCreating(true);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies.");
        // Allow creation if fetch fails
        setIsCreating(true);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormCompany({ ...formCompany, [e.target.name]: e.target.value });
  };

  // Select a company from the list
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setFormCompany(company);
    setIsEditing(false);
    setIsCreating(false);
    setMessage("");
    setError("");
  };

  // Start creating a new company
  const handleStartCreate = () => {
    setFormCompany(initialCompanyState);
    setSelectedCompany(null);
    setIsEditing(true);
    setIsCreating(true);
    setMessage("");
    setError("");
  };

  // Create company
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError("User not authenticated");
        return;
      }

      // Create company using ICP service
      const result = await companyService.createCompany(
        formCompany.name,
        formCompany.address,
        formCompany.phone,
        formCompany.email,
        formCompany.website || undefined,
        parseInt(currentUser.principal) // Use principal as manufacturer ID
      );

      if (result.success && result.data) {
        const newCompany = result.data;
        setCompanies((prev) => [...prev, newCompany]);
        setSelectedCompany(newCompany);
        setFormCompany(newCompany);
        setMessage("Company created successfully!");
        setIsEditing(false);
        setIsCreating(false);
        
        // Store company id for session
        localStorage.setItem("company_id", newCompany.id?.toString() || "");
        
        // If first time, redirect to dashboard after short delay
        if (isFirstTime) {
          setTimeout(() => {
            router.replace("/manufacturer");
          }, 1200);
        }
      } else {
        setError(result.error || "Failed to create company.");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      setError("Failed to create company.");
    }
  };

  // Edit company
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!formCompany.id) return;
    try {
      // Update company using ICP service
      const result = await companyService.updateCompany(
        typeof formCompany.id === 'bigint' ? Number(formCompany.id) : formCompany.id!, 
        formCompany
      );
      
      if (result.success && result.data) {
        const updatedCompany = result.data;
        setCompanies((prev) =>
          prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
        );
        setSelectedCompany(updatedCompany);
        setFormCompany(updatedCompany);
        setMessage("Company details updated!");
        setIsEditing(false);
        setIsCreating(false);
      } else {
        setError(result.error || "Failed to update company.");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setError("Failed to update company.");
    }
  };

  // Cancel editing/creating
  const handleCancel = () => {
    if (selectedCompany) {
      setFormCompany(selectedCompany);
      setIsEditing(false);
      setIsCreating(false);
    } else {
      setFormCompany(initialCompanyState);
      setIsEditing(false);
      setIsCreating(false);
    }
    setMessage("");
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-8">
      <div className="flex-1 max-w-xl">
        {isFirstTime && (
  <div className="mb-6 text-center text-blue-400 text-lg font-semibold">
    Welcome! Please create your company to get started.
  </div>
)}
        <Card className="bg-gray-900 text-white border border-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isCreating
                ? "Create Company"
                : selectedCompany
                ? isEditing
                  ? "Edit Company"
                  : "Company Details"
                : "Select a Company"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(isCreating || selectedCompany) && (
              <form
                onSubmit={isCreating ? handleCreate : handleEdit}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formCompany.name}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    name="gstin"
                    value={formCompany.gstin}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formCompany.address}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formCompany.state}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formCompany.city}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formCompany.pincode}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formCompany.phone}
                      onChange={handleChange}
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formCompany.email}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formCompany.website || ""}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                    placeholder="https://www.example.com"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <div className="flex gap-4 mt-4">
                  {(isCreating || isEditing) && (
                    <>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        {isCreating ? "Create Company" : "Save Changes"}
                      </Button>
                      <Button type="button" className="w-full bg-gray-700 hover:bg-gray-800" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {!isCreating && selectedCompany && !isEditing && (
                    <Button type="button" className="w-full bg-yellow-600 hover:bg-yellow-700" onClick={() => { setIsEditing(true); setIsCreating(false); }}>
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            )}
            {!isCreating && !selectedCompany && (
              <div className="text-gray-400 text-center py-8">
                No company found. Please create your company.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
      <CompanyPageContent />
    </Suspense>
  );
}