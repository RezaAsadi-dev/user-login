"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../stores/auth-store";
import { authSchema, type AuthFormData } from "../../lib/validation";
import type { RandomUserResponse } from "../../types/user";
import styles from "./auth-form.module.scss";

export function AuthForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isHydrated } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isHydrated && user) {
      router.push("/dashboard");
    }
  }, [isHydrated, user, router]);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch(
        "https://randomuser.me/api/?results=1&nat=us"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData: RandomUserResponse = await response.json();

      if (userData.results && userData.results.length > 0) {
        login(userData.results[0]);
        sessionStorage.setItem("justLoggedIn", "true");
        router.push("/dashboard");
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className={styles.authForm}>
        <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
          <div style={{ fontSize: "1.125rem", fontWeight: "500" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Enter your phone number to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          id="phoneNumber"
          label="Phone Number"
          type="number"
          placeholder="09123456789"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        {apiError && <div className={styles.apiError}>⚠️ {apiError}</div>}

        <div className={styles.loginButton}>
          <Button type="submit" loading={isSubmitting} fullWidth size="lg">
            {isSubmitting ? "Signing you in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
