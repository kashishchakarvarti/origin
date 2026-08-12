"use client";

import { motion } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CrestImage } from "@/components/ui/crest-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INCLUDED_SERVICES } from "@/lib/constants";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import type { Opportunity, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

interface LaunchBusinessDialogProps {
  opportunity: Opportunity | null;
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLaunch: (selectedProductIds: string[]) => void;
}

export function LaunchBusinessDialog({
  opportunity,
  products,
  open,
  onOpenChange,
  onLaunch,
}: LaunchBusinessDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { t, tn } = useLanguage();

  useEffect(() => {
    if (open && products.length > 0) {
      setSelectedIds(products.map((p) => p.id));
    }
  }, [open, products]);

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [products, selectedIds]
  );

  const launchCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const launchScore =
    selectedProducts.length > 0
      ? Math.round(
          selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length
        )
      : 0;
  const monthlyOrders = selectedProducts.reduce((s, p) => s + p.monthlyOrders, 0);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleLaunch = () => {
    if (selectedIds.length === 0 || !opportunity) return;
    onLaunch(selectedIds);
    onOpenChange(false);
  };

  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="relative h-40 shrink-0">
          <CrestImage
            src={opportunity.image}
            category={opportunity.category}
            seed={opportunity.id}
            alt={tn(opportunity.name)}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 mb-2">
              <Badge variant="outline">{tn(opportunity.country)}</Badge>
              <Badge variant="gold">{tn(opportunity.category)}</Badge>
            </div>
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-2xl">{tn(opportunity.name)}</DialogTitle>
              <DialogDescription className="text-white/50">
                {t("opp.subtitle")}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-0 min-h-0 flex-1">
          <ScrollArea className="md:col-span-3 max-h-[calc(90vh-10rem)] border-r border-white/[0.06]">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/70">{t("opp.productsIncluded")}</h3>
                <span className="text-xs text-white/40">
                  {t("launch.selectedCount", { n: selectedIds.length, m: products.length })}
                </span>
              </div>

              <div className="space-y-3">
                {products.map((product, i) => {
                  const checked = selectedIds.includes(product.id);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "flex gap-4 rounded-xl border p-3 transition-all cursor-pointer",
                        checked
                          ? "border-gold/30 bg-gold/[0.04]"
                          : "border-white/[0.06] bg-white/[0.02] opacity-60"
                      )}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden">
                        <CrestImage
                          src={product.image}
                          category={product.category}
                          seed={product.id}
                          alt={tn(product.name)}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{tn(product.name)}</p>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                          <div>
                            <p className="text-white/40">{t("opp.crestPrice")}</p>
                            <p className="text-white/80 mt-0.5">{formatINR(product.crestPrice)}</p>
                          </div>
                          <div>
                            <p className="text-white/40">{t("opp.launchScore")}</p>
                            <p className="text-gold mt-0.5">{product.launchScore}</p>
                          </div>
                          <div>
                            <p className="text-white/40">{t("opp.monthlyOrders")}</p>
                            <p className="text-white/80 mt-0.5">{formatNumber(product.monthlyOrders)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start pt-1" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleProduct(product.id)}
                          aria-label={t("launch.includeProduct", { name: tn(product.name) })}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  {t("opp.services")}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {INCLUDED_SERVICES.map((service) => (
                    <div key={service} className="flex items-center gap-2 text-xs text-white/70">
                      <Check className="h-3 w-3 text-gold shrink-0" />
                      {tn(service)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="md:col-span-2 p-6 space-y-6 bg-white/[0.02]">
            <div>
              <h3 className="text-sm font-medium text-white/50 mb-1">{t("opp.specialist")}</h3>
              <p className="text-lg font-semibold">{opportunity.commerceSpecialist}</p>
              <p className="text-xs text-white/40 mt-1">
                {t("opp.specialistMarket", { country: tn(opportunity.country) })}
              </p>
            </div>

            <div className="space-y-3">
              <SummaryRow label={t("build.launchCost")} value={formatINR(launchCost)} highlight />
              <SummaryRow label={t("build.launchScore")} value={String(launchScore)} highlight />
              <SummaryRow label={t("opp.sellingPrice")} value={formatUSD(opportunity.recommendedSellingPrice)} />
              <SummaryRow label={t("launch.estMonthlyOrders")} value={formatNumber(monthlyOrders)} />
              <SummaryRow label={t("opp.minLaunch")} value={formatINR(opportunity.minimumLaunchCost)} />
              <SummaryRow label={t("opp.capacity")} value={`${opportunity.availableCapacity}%`} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/40">
                <span>{t("opp.availableCapacity")}</span>
                <span>{opportunity.availableCapacity}%</span>
              </div>
              <Progress value={opportunity.availableCapacity} className="h-1.5" />
            </div>

            <p className="text-xs text-white/40 leading-relaxed">{opportunity.description}</p>

            <Button
              className="w-full"
              size="lg"
              disabled={selectedIds.length === 0}
              onClick={handleLaunch}
            >
              <Rocket className="h-4 w-4" />
              {t(
                selectedIds.length === 1 ? "launch.launchWithProducts" : "launch.launchWithProducts_plural",
                { n: selectedIds.length }
              )}
            </Button>

            {selectedIds.length === 0 && (
              <p className="text-xs text-red-400/80 text-center">{t("launch.selectOneProduct")}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span className={cn("font-medium", highlight ? "text-gold" : "text-white")}>{value}</span>
    </div>
  );
}
