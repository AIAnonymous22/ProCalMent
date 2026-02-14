"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Sign in failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold mb-4">
          LH
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-white/50 mt-1">Sign in to Leadership Hub</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@procurement.gov"
          required
        />
        <GlassInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
        />

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <GlassButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </GlassButton>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Have an invite code?{" "}
        <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Create an account
        </Link>
      </p>
    </GlassCard>
  );
}
