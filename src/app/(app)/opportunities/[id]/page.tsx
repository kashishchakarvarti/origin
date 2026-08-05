"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LaunchBusinessDialog } from "@/components/opportunities/launch-business-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { crestStore } from "@/lib/data/store";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import { useOpportunity } from "@/hooks/use-crest-data";
import { useToast } from "@/providers/toast-provider";

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: opportunity, isLoading } = useOpportunity(id);
  const [showLaunch, setShowLaunch] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const launchProducts = useMemo(
    () => (opportunity ? crestStore.getOpportunityProducts(opportunity.id) : []),
    [opportunity]
  );

  const handleConfirmLaunch = (selectedProductIds: string[]) => {
    if (!opportunity) return;
    const business = crestStore.launchBusiness(opportunity.id, selectedProductIds);
    if (business) {
      queryClient.invalidateQueries({ queryKey: ["crest"] });
      toast({
        title: "Business Launched",
        description: `${business.name} is now live.`,
        variant: "success",
      });
      setShowLaunch(false);
      router.push(`/businesses/${business.id}`);
    }
  };

  if (isLoading) {
    return <div className="h-96 rounded-2xl bg-white/[0.04] animate-pulse" />;
  }

  if (!opportunity) {
    return (
      <div className="text-center py-20">
        <p className="text-white/50">Opportunity not found.</p>
        <Link href="/opportunities">
          <Button variant="secondary" className="mt-4">Back to Opportunities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
        <CrestImage src={opportunity.image} category={opportunity.category} seed={opportunity.id} alt={opportunity.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-3">
            <Badge variant="outline">{opportunity.country}</Badge>
            <Badge variant="gold">{opportunity.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold">{opportunity.name}</h1>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="CREST Price" value={formatINR(opportunity.crestPrice)} highlight />
            <Detail label="Selling Price" value={formatUSD(opportunity.recommendedSellingPrice)} />
            <Detail label="Monthly Orders" value={formatNumber(opportunity.monthlyOrders)} />
            <Detail label="Launch Score" value={`${opportunity.launchScore}`} highlight />
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50 mb-3">Products Included</h3>
            <div className="space-y-2">
              {launchProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="h-3.5 w-3.5 text-gold" /> {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4">
            <h3 className="text-sm font-medium text-white/50">Commerce Specialist</h3>
            <p className="text-lg font-medium">{opportunity.commerceSpecialist}</p>
            <p className="text-sm text-white/40">Dedicated specialist for your {opportunity.category} business in {opportunity.country}.</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50 mb-3">Included Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {opportunity.includedServices.map((s) => (
                <div key={s} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-gold shrink-0" /> {s}
                </div>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => setShowLaunch(true)}>
            Launch Business
          </Button>
        </div>
      </div>

      <LaunchBusinessDialog
        opportunity={opportunity}
        products={launchProducts}
        open={showLaunch}
        onOpenChange={setShowLaunch}
        onLaunch={handleConfirmLaunch}
      />
    </div>
  );
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-card p-4">
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${highlight ? "text-gold" : "text-white"}`}>{value}</p>
    </div>
  );
}
