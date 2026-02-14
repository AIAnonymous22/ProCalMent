"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        password,
        inviteCode: formData.get("inviteCode"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Sign up failed");
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
        <h1 className="text-2xl font-bold text-white">Join Leadership Hub</h1>
        <p className="text-white/50 mt-1">Enter your invite code to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          name="inviteCode"
          label="Invite Code"
          placeholder="Enter your invite code"
          required
        />
        <GlassInput
          name="name"
          label="Full Name"
          placeholder="Jane Smith"
          required
        />
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
          placeholder="Minimum 8 characters"
          required
        />
        <GlassInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Repeat your password"
          required
        />

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <GlassButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </GlassButton>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </p>
    </GlassCard>
  );
}
