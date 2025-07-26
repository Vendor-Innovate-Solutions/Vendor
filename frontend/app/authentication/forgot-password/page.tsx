"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="bg-black text-white border border-white-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Password Recovery</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center space-y-4">
              <div className="bg-blue-950/30 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">ICP Authentication</h3>
                <p className="text-sm text-gray-300">
                  This application uses Internet Identity for secure authentication. 
                  Password recovery is handled automatically through your Internet Identity.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  If you're having trouble accessing your account:
                </p>
                <ul className="text-xs text-gray-500 space-y-1 text-left">
                  <li>• Use your Internet Identity to log in</li>
                  <li>• Recovery options are managed by Internet Identity</li>
                  <li>• Visit identity.ic0.app for account recovery</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push("/authentication")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Back to Login
                </Button>
                
                <Link
                  href="https://identity.ic0.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 underline-offset-4 hover:underline"
                >
                  Visit Internet Identity
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
