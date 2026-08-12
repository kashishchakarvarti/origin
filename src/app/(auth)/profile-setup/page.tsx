"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useToast } from "@/providers/toast-provider";

export default function ProfileSetupPage() {
  const [name, setName] = useState("Kashish");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding(name);
    toast({ title: t("auth.profileComplete"), description: t("auth.welcomeCrest"), variant: "success" });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{t("auth.setupTitle")}</h1>
          <p className="text-sm text-white/50">{t("auth.tellUs")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/[0.06] bg-card p-8">
          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.fullName")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("auth.phone")}</Label>
            <Input id="phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t("auth.company")}</Label>
            <Input id="company" placeholder={t("auth.companyPh")} value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">{t("auth.completeSetup")}</Button>
        </form>
      </motion.div>
    </div>
  );
}
