"use client";

import React from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <AuthModal
        forceOpen={true}
        onClose={() => {
          router.push("/");
        }}
      />
    </div>
  );
}
