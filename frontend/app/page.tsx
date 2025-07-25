"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/utils/icp-auth";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user) {
        // Redirect based on user type
        switch (user.userType) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'manufacturer':
            router.replace('/manufacturer');
            break;
          case 'retailer':
            router.replace('/retailer');
            break;
          case 'employee':
            router.replace('/employee');
            break;
          default:
            router.replace('/authentication');
        }
      } else {
        router.replace('/authentication');
      }
    } else {
      router.replace('/authentication');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting...</h1>
        <p className="mt-4">Please wait while we redirect you to the appropriate dashboard.</p>
      </div>
    </div>
  );
}
