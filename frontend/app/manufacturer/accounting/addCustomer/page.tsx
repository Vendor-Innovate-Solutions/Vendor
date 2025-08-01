"use client";
import React, { useState, useEffect } from "react";
import { accountingService } from "@/utils/icp-api";
import { getCurrentUser } from "@/utils/icp-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type RetailerForm = {
  retailer_id?: number;
  name: string;
  contact_person: string;
  email: string;
  contact: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
  distance_from_warehouse: string;
  is_active: boolean;
};

type Company = {
  id: number;
  name: string;
};

const initialRetailerState: RetailerForm = {
  retailer_id: undefined,
  name: "",
  contact_person: "",
  email: "",
  contact: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  gstin: "",
  distance_from_warehouse: "",
  is_active: true,
};


export default function RetailerPage() {
  const [retailers, setRetailers] = useState<RetailerForm[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerForm | null>(null);
  const [form, setForm] = useState<RetailerForm>(initialRetailerState);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch companies and retailers on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get current user to verify authentication
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError("Please log in to access this page.");
          setLoading(false);
          return;
        }

        const companyId = localStorage.getItem("company_id");
        if (!companyId) {
          setError("No company selected.");
          setLoading(false);
          return;
        }

        // Fetch retailers using ICP service
        const retailerData = await accountingService.getRetailersByCompany(parseInt(companyId));
        
        // Transform the data to match RetailerForm format
        const retailerList = retailerData.map((retailer: any) => ({
          retailer_id: retailer.id,
          name: retailer.name,
          contact_person: retailer.contact_person || '',
          email: retailer.email,
          contact: retailer.phone || retailer.contact || '',
          address_line1: retailer.address || '',
          address_line2: '',
          city: retailer.city || '',
          state: retailer.state || '',
          pincode: retailer.pincode || '',
          country: retailer.country || 'India',
          gstin: retailer.gstin || '',
          distance_from_warehouse: retailer.distance || '0',
          is_active: retailer.is_active !== false,
        }));
        
        setRetailers(retailerList);
        
        if (retailerList.length > 0) {
          setSelectedRetailer(retailerList[0]);
          setForm(retailerList[0]);
        }
      } catch (error) {
        console.error('Error fetching retailers:', error);
        setError("Failed to fetch retailers.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  // Select a retailer from the list
  const handleSelectRetailer = (retailer: RetailerForm) => {
    setSelectedRetailer(retailer);
    setForm(retailer);
    setIsEditing(false);
    setIsCreating(false);
    setMessage("");
    setError("");
  };

  // Start creating a new retailer
  const handleStartCreate = () => {
    setForm(initialRetailerState);
    setSelectedRetailer(null);
    setIsEditing(true);
    setIsCreating(true);
    setMessage("");
    setError("");
  };

  // Create retailer
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const companyId = localStorage.getItem("company_id");
      if (!companyId) {
        setError("No company selected.");
        return;
      }

      // Transform form data to match the service format
      const retailerData = {
        name: form.name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.contact,
        address: form.address_line1,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        gstin: form.gstin,
        distance: Number(form.distance_from_warehouse),
        is_active: form.is_active,
      };

      const result = await accountingService.addRetailer(parseInt(companyId), retailerData);
      
      if (result.success) {
        // Transform the returned data to RetailerForm format
        const newRetailer = {
          retailer_id: result.data.id,
          name: result.data.name,
          contact_person: result.data.contact_person || '',
          email: result.data.email,
          contact: result.data.phone || '',
          address_line1: result.data.address || '',
          address_line2: '',
          city: result.data.city || '',
          state: result.data.state || '',
          pincode: result.data.pincode || '',
          country: result.data.country || 'India',
          gstin: result.data.gstin || '',
          distance_from_warehouse: result.data.distance?.toString() || '0',
          is_active: result.data.is_active !== false,
        };

        setRetailers((prev) => [...prev, newRetailer]);
        setSelectedRetailer(newRetailer);
        setForm(newRetailer);
        setMessage("Retailer added successfully!");
        setIsEditing(false);
        setIsCreating(false);
      } else {
        setError(result.error || "Failed to add retailer.");
      }
    } catch (error) {
      console.error('Error creating retailer:', error);
      setError("Failed to add retailer.");
    }
  };

  // Edit retailer
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.retailer_id) return;
    
    try {
      // Transform form data to match the service format
      const retailerData = {
        name: form.name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.contact,
        address: form.address_line1,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        gstin: form.gstin,
        distance: Number(form.distance_from_warehouse),
        is_active: form.is_active,
      };

      const result = await accountingService.updateRetailer(form.retailer_id, retailerData);
      
      if (result.success) {
        // Transform the returned data to RetailerForm format
        const updatedRetailer = {
          retailer_id: result.data.id,
          name: result.data.name,
          contact_person: result.data.contact_person || '',
          email: result.data.email,
          contact: result.data.phone || '',
          address_line1: result.data.address || '',
          address_line2: '',
          city: result.data.city || '',
          state: result.data.state || '',
          pincode: result.data.pincode || '',
          country: result.data.country || 'India',
          gstin: result.data.gstin || '',
          distance_from_warehouse: result.data.distance?.toString() || '0',
          is_active: result.data.is_active !== false,
        };

        setRetailers((prev) =>
          prev.map((r) => (r.retailer_id === updatedRetailer.retailer_id ? updatedRetailer : r))
        );
        setSelectedRetailer(updatedRetailer);
        setForm(updatedRetailer);
        setMessage("Retailer details updated!");
        setIsEditing(false);
        setIsCreating(false);
      } else {
        setError(result.error || "Failed to update retailer.");
      }
    } catch (error) {
      console.error('Error updating retailer:', error);
      setError("Failed to update retailer.");
    }
  };

  // Cancel editing/creating
  const handleCancel = () => {
    if (selectedRetailer) {
      setForm(selectedRetailer);
      setIsEditing(false);
      setIsCreating(false);
    } else {
      setForm(initialRetailerState);
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
      {/* Sidebar: Retailer List */}
      <div className="w-72 mr-8">
        <Card className="bg-gray-900 text-white border border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {retailers.map((retailer) => (
                <Button
                  key={retailer.retailer_id}
                  variant={selectedRetailer?.retailer_id === retailer.retailer_id ?  "default" : "outline"}
                  className="justify-start w-full"
                  onClick={() => handleSelectRetailer(retailer)}
                >
                  {retailer.name}
                </Button>
              ))}
              <Button
                variant="secondary"
                className="mt-4 w-full bg-blue-700 hover:bg-blue-800"
                onClick={handleStartCreate}
              >
                + Add New Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main: Retailer Details Form */}
      <div className="flex-1 max-w-xl">
        <Card className="bg-gray-900 text-white border border-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isCreating
                ? "Add Customer"
                : selectedRetailer
                ? isEditing
                  ? "Edit Customer"
                  : "Customer Details"
                : "Select a Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(isCreating || selectedRetailer) && (
              <form
                onSubmit={isCreating ? handleCreate : handleEdit}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Retailer Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Phone</Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input
                    id="address_line1"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input
                    id="address_line2"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
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
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="bg-gray-800 text-white border-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    name="gstin"
                    value={form.gstin}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="distance_from_warehouse">Distance from Warehouse (km)</Label>
                  <Input
                    id="distance_from_warehouse"
                    name="distance_from_warehouse"
                    type="number"
                    value={form.distance_from_warehouse}
                    onChange={handleChange}
                    required
                    disabled={!isEditing && !isCreating}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={handleChange}
                    disabled={!isEditing && !isCreating}
                    className="accent-blue-600"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <div className="flex gap-4 mt-4">
                  {(isCreating || isEditing) && (
                    <>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        {isCreating ? "Add Customer" : "Save Changes"}
                      </Button>
                      <Button type="button" className="w-full bg-gray-700 hover:bg-gray-800" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {!isCreating && selectedRetailer && !isEditing && (
                    <Button type="button" className="w-full bg-yellow-600 hover:bg-yellow-700" onClick={() => { setIsEditing(true); setIsCreating(false); }}>
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            )}
            {!isCreating && !selectedRetailer && (
              <div className="text-gray-400 text-center py-8">
                Select a customer from the left or add a new one.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}