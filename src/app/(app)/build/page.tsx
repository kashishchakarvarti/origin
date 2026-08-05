"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Search } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";
import { crestStore } from "@/lib/data/store";
import { formatINR, formatNumber } from "@/lib/format";
import type { Category, Country, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/use-crest-data";
import { useToast } from "@/providers/toast-provider";

export default function BuildBusinessPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { data: products = [] } = useProducts({ category: category ?? undefined });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const launchCost = selectedProducts.reduce((s, p) => s + p.crestPrice, 0);
  const launchScore = selectedProducts.length
    ? Math.round(selectedProducts.reduce((s, p) => s + p.launchScore, 0) / selectedProducts.length)
    : 0;
  const businessName = category && country ? `${category}${country} Co.` : "Your Business";

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const handleLaunch = () => {
    if (!category || !country || selectedProducts.length === 0) return;
    const business = crestStore.launchCustomBusiness(
      category,
      country,
      selectedProducts.map((p) => p.id),
      businessName
    );
    if (business) {
      queryClient.invalidateQueries({ queryKey: ["crest"] });
      toast({ title: "Business Launched", description: `${business.name} is now live.`, variant: "success" });
      router.push(`/businesses/${business.id}`);
    }
  };

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Build Your Business</h1>
        <p className="text-white/50 mt-2">Create a custom global commerce business</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4">
        {["Category", "Country", "Products"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
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
            <span className={cn("text-sm", step === i + 1 ? "text-white" : "text-white/40")}>{label}</span>
            {i < 2 && <div className="w-8 h-px bg-white/[0.06]" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setStep(2); }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-gold/30 hover:bg-gold/[0.03]",
                      category === cat ? "border-gold/40 bg-gold/[0.05]" : "border-white/[0.06] bg-card"
                    )}
                  >
                    <p className="font-medium">{cat}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCountry(c); setStep(3); }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-gold/30 hover:bg-gold/[0.03]",
                      country === c ? "border-gold/40 bg-gold/[0.05]" : "border-white/[0.06] bg-card"
                    )}
                  >
                    <p className="font-medium">{c}</p>
                  </button>
                ))}
                <Button variant="ghost" onClick={() => setStep(1)} className="col-span-full w-fit">Back</Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.slice(0, 40).map((product) => {
                    const isSelected = selectedProducts.some((p) => p.id === product.id);
                    return (
                      <div key={product.id} className={cn("rounded-xl border bg-card overflow-hidden transition-all", isSelected ? "border-gold/40" : "border-white/[0.06]")}>
                        <div className="relative h-32">
                          <CrestImage src={product.image} category={product.category} seed={product.id} alt={product.name} fill className="object-cover" sizes="300px" />
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex justify-between text-xs text-white/50">
                            <span>{formatINR(product.crestPrice)}</span>
                            <span>Score: {product.launchScore}</span>
                          </div>
                          <p className="text-xs text-white/40">{formatNumber(product.monthlyOrders)} orders/mo</p>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "secondary"}
                            className="w-full"
                            onClick={() => toggleProduct(product)}
                          >
                            {isSelected ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Add</>}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" onClick={() => setStep(2)} className="w-fit">Back</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel */}
        <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-6 h-fit sticky top-24">
          <h3 className="font-semibold">Business Summary</h3>
          <div className="space-y-4">
            <SummaryRow label="Business Name" value={businessName} />
            <SummaryRow label="Category" value={category ?? "—"} />
            <SummaryRow label="Country" value={country ?? "—"} />
            <SummaryRow label="Products Selected" value={String(selectedProducts.length)} />
            <SummaryRow label="Launch Cost" value={launchCost ? formatINR(launchCost) : "—"} highlight />
            <SummaryRow label="Launch Score" value={launchScore ? `${launchScore}` : "—"} highlight />
          </div>

          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-wider">Selected Products</p>
              {selectedProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70 truncate">{p.name}</span>
                  <button onClick={() => toggleProduct(p)} className="text-white/30 hover:text-white text-xs">Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Status</span>
              <Badge variant={selectedProducts.length > 0 ? "live" : "outline"}>
                {selectedProducts.length > 0 ? "Ready to Launch" : "Incomplete"}
              </Badge>
            </div>
            {launchScore > 0 && <Progress value={launchScore} className="h-1.5" />}
          </div>

          <Button
            className="w-full"
            disabled={!category || !country || selectedProducts.length === 0}
            onClick={handleLaunch}
          >
            Launch Business
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
