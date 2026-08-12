"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Search } from "lucide-react";
import { AudienceFiltersPanel } from "@/components/build/audience-filters-panel";
import { CrestImage } from "@/components/ui/crest-image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";
import {
  DEFAULT_AUDIENCE,
  estimateAudienceReach,
  formatAudienceReach,
  resolveAudienceTargeting,
  summarizeTargeting,
  type AudienceTargeting,
} from "@/lib/audience-filters";
import { crestStore } from "@/lib/data/store";
import { formatINR, formatNumber } from "@/lib/format";
import type { Category, Country, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/use-crest-data";
import { useToast } from "@/providers/toast-provider";
import { useLanguage } from "@/providers/language-provider";

const STEP_KEYS = ["build.stepName", "build.stepCategory", "build.stepMarket", "build.stepProducts"] as const;

export default function BuildBusinessPage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [nameError, setNameError] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [audienceTargeting, setAudienceTargeting] = useState<AudienceTargeting>(DEFAULT_AUDIENCE);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { data: products = [] } = useProducts({ category: category ?? undefined });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const { t, tn } = useLanguage();

  const trimmedName = businessName.trim();
  const hasValidName = trimmedName.length > 0;

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const launchCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const launchScore = selectedProducts.length
    ? Math.round(selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length)
    : 0;

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const validateName = () => {
    if (!trimmedName) {
      setNameError(t("build.nameRequired"));
      return false;
    }
    setNameError("");
    return true;
  };

  const handleContinueFromName = () => {
    if (!validateName()) return;
    setStep(2);
  };

  const handleLaunch = () => {
    if (!validateName()) return;
    if (!category || !country || selectedProducts.length === 0) return;
    const finalTargeting = resolveAudienceTargeting(audienceTargeting, category, country);
    const business = crestStore.launchCustomBusiness(
      category,
      country,
      selectedProducts.map((p) => p.id),
      trimmedName,
      finalTargeting
    );
    if (business) {
      queryClient.invalidateQueries({ queryKey: ["crest"] });
      toast({
        title: t("opp.launched"),
        description: `${tn(business.name)} ${t("opp.nowLive")}`,
        variant: "success",
      });
      router.push(`/businesses/${business.id}`);
    }
  };

  const canBuild =
    hasValidName && !!category && !!country && selectedProducts.length > 0;

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("build.title")}</h1>
        <p className="text-white/50 mt-2">{t("build.subtitle")}</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 flex-wrap">
        {STEP_KEYS.map((key, i) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium border transition-colors",
                step > i + 1 ? "bg-gold/15 border-gold/30 text-gold" :
                step === i + 1 ? "bg-white/[0.08] border-white/[0.12] text-white" :
                "border-white/[0.06] text-white/30"
              )}
            >
              {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("text-sm", step === i + 1 ? "text-white" : "text-white/40")}>{t(key)}</span>
            {i < STEP_KEYS.length - 1 && <div className="w-8 h-px bg-white/[0.06]" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4 max-w-lg"
              >
                <div className="space-y-2">
                  <Label htmlFor="business-name">
                    {t("build.nameLabel")} <span className="text-gold">*</span>
                  </Label>
                  <Input
                    id="business-name"
                    placeholder={t("build.namePlaceholder")}
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      if (nameError && e.target.value.trim()) setNameError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleContinueFromName();
                      }
                    }}
                    autoComplete="off"
                  />
                  {nameError && (
                    <p className="text-xs text-red-400">{nameError}</p>
                  )}
                </div>
                <Button onClick={handleContinueFromName} disabled={!hasValidName}>
                  {t("common.continue")}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setStep(3); }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-gold/30 hover:bg-gold/[0.03]",
                      category === cat ? "border-gold/40 bg-gold/[0.05]" : "border-white/[0.06] bg-card"
                    )}
                  >
                    <p className="font-medium">{tn(cat)}</p>
                  </button>
                ))}
                <Button variant="ghost" onClick={() => setStep(1)} className="col-span-full w-fit">{t("common.back")}</Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <p className="text-sm text-white/50 mb-3">{t("build.selectMarket")}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCountry(c)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all hover:border-gold/30 hover:bg-gold/[0.03]",
                          country === c ? "border-gold/40 bg-gold/[0.05]" : "border-white/[0.06] bg-card"
                        )}
                      >
                        <p className="font-medium">{tn(c)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setStep(2)}>{t("common.back")}</Button>
                  <Button onClick={() => setStep(4)} disabled={!country}>
                    {t("common.continue")}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input placeholder={t("build.searchProducts")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>

                <AudienceFiltersPanel
                  country={country}
                  category={category}
                  targeting={audienceTargeting}
                  onChange={setAudienceTargeting}
                />

                <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.slice(0, 40).map((product) => {
                    const isSelected = selectedProducts.some((p) => p.id === product.id);
                    return (
                      <div key={product.id} className={cn("rounded-xl border bg-card overflow-hidden transition-all", isSelected ? "border-gold/40" : "border-white/[0.06]")}>
                        <div className="relative h-32">
                          <CrestImage src={product.image} category={product.category} seed={product.id} alt={tn(product.name)} fill className="object-cover" sizes="300px" />
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="font-medium text-sm">{tn(product.name)}</p>
                          <div className="flex justify-between text-xs text-white/50">
                            <span>{formatINR(product.crestPrice)}</span>
                            <span>{t("build.scoreLabel", { n: product.launchScore })}</span>
                          </div>
                          <p className="text-xs text-white/40">{t("build.ordersPerMonth", { n: formatNumber(product.monthlyOrders) })}</p>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "secondary"}
                            className="w-full"
                            onClick={() => toggleProduct(product)}
                          >
                            {isSelected ? <><Check className="h-3 w-3" /> {t("build.added")}</> : <><Plus className="h-3 w-3" /> {t("build.add")}</>}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" onClick={() => setStep(3)} className="w-fit">{t("common.back")}</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel — Review */}
        <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-6 h-fit sticky top-24">
          <h3 className="font-semibold">{t("build.summary")}</h3>
          <div className="space-y-4">
            <SummaryRow label={t("build.nameLabel")} value={hasValidName ? trimmedName : "—"} />
            <SummaryRow label={t("common.category")} value={category ? tn(category) : "—"} />
            <SummaryRow label={t("common.country")} value={country ? tn(country) : "—"} />
            {country && step >= 4 && (
              <>
                <SummaryRow
                  label={t("build.targeting")}
                  value={summarizeTargeting(audienceTargeting, category, country)}
                />
                <SummaryRow
                  label={t("build.estReach")}
                  value={formatAudienceReach(
                    estimateAudienceReach(
                      country,
                      resolveAudienceTargeting(audienceTargeting, category, country)
                    )
                  )}
                  highlight
                />
              </>
            )}
            <SummaryRow label={t("build.productsSelected")} value={String(selectedProducts.length)} />
            <SummaryRow label={t("build.launchCost")} value={launchCost ? formatINR(launchCost) : "—"} highlight />
            <SummaryRow label={t("build.launchScore")} value={launchScore ? `${launchScore}` : "—"} highlight />
          </div>

          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-wider">{t("build.selectedProducts")}</p>
              {selectedProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70 truncate">{tn(p.name)}</span>
                  <button onClick={() => toggleProduct(p)} className="text-white/30 hover:text-white text-xs">{t("common.remove")}</button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">{t("build.status")}</span>
              <Badge variant={canBuild ? "live" : "outline"}>
                {canBuild ? t("build.ready") : t("build.incomplete")}
              </Badge>
            </div>
            {launchScore > 0 && <Progress value={launchScore} className="h-1.5" />}
          </div>

          {nameError && (
            <p className="text-xs text-red-400">{nameError}</p>
          )}

          <Button
            className="w-full"
            disabled={!canBuild}
            onClick={handleLaunch}
          >
            {t("build.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-white/50">{label}</span>
      <span className={cn("text-sm font-medium", highlight ? "text-gold" : "text-white")}>{value}</span>
    </div>
  );
}
