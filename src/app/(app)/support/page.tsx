"use client";

import { motion } from "framer-motion";
import { Clock, Headphones, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORT_PHONE, SUPPORT_WHATSAPP } from "@/lib/i18n";
import { useLanguage } from "@/providers/language-provider";
import { useToast } from "@/providers/toast-provider";

export default function SupportPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleCall = () => {
    window.open(`tel:${SUPPORT_PHONE}`, "_self");
    toast({
      title: t("support.call"),
      description: t("support.connecting"),
      variant: "success",
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi CREST Support, I need help with my business.");
    window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">{t("support.title")}</h1>
        <p className="text-white/50 mt-2">{t("support.available")}</p>
      </motion.div>

      <div className="rounded-2xl border border-white/[0.06] bg-card p-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 shrink-0">
          <Headphones className="h-5 w-5 text-gold" />
        </div>
        <div>
          <p className="font-medium">{t("support.team")}</p>
          <p className="text-sm text-white/50 mt-1 leading-relaxed">{t("support.blurb")}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
            <Clock className="h-3.5 w-3.5" />
            {t("support.available")}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
            <Phone className="h-4 w-4 text-gold" />
          </div>
          <div>
            <h2 className="font-semibold">{t("support.call")}</h2>
            <p className="text-sm text-white/45 mt-1">{t("support.callDesc")}</p>
          </div>
          <Button className="w-full" onClick={handleCall}>
            <Phone className="h-4 w-4" />
            {t("support.call")}
          </Button>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <MessageCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-semibold">{t("support.whatsapp")}</h2>
            <p className="text-sm text-white/45 mt-1">{t("support.whatsappDesc")}</p>
          </div>
          <Button
            variant="secondary"
            className="w-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            {t("support.whatsapp")}
          </Button>
        </div>
      </div>
    </div>
  );
}
