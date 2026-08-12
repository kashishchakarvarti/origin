"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/language-provider";
import { useToast } from "@/providers/toast-provider";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    toast({ title: t("auth.verified"), description: t("auth.emailVerified"), variant: "success" });
    router.push("/profile-setup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("auth.verifyEmail")}</h1>
          <p className="text-sm text-white/50">{t("auth.enterCode")}</p>
        </div>

        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <Input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-lg font-semibold"
            />
          ))}
        </div>

        <Button onClick={handleVerify} className="w-full max-w-md">
          {t("auth.verify")}
        </Button>

        <button
          onClick={() => toast({ title: t("auth.codeResent"), description: t("auth.newCodeSent") })}
          className="text-sm text-gold hover:text-gold-light"
        >
          {t("auth.resend")}
        </button>
      </motion.div>
    </div>
  );
}
