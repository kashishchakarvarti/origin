"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/providers/toast-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Reset link sent", description: "Check your email for instructions.", variant: "success" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-white/50">We&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-white/[0.06] bg-card p-8 text-center space-y-4">
            <p className="text-white/70">Check your inbox for a password reset link.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/[0.06] bg-card p-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        )}

        <p className="text-center text-sm text-white/50">
          <Link href="/login" className="text-gold hover:text-gold-light">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
}
