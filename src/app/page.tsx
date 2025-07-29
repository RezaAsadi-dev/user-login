"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

export default function HomePage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [isHydrated, user, router]);

  return (
    <div className="page-wrapper">
      <div style={{ textAlign: "center", color: "#6b7280" }}>
        {!isHydrated ? "Loading..." : "Redirecting..."}
      </div>
    </div>
  );
}
