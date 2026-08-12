"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { OnMediaChip } from "@/components/ui/on-media-chip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionTimeline } from "@/components/mission-control/mission-timeline";
import { ReviewsPanel } from "@/components/reviews/reviews-panel";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import { maskEmail, maskPhone } from "@/lib/mask";
import { estimateAudienceReach, formatAudienceReach, formatFilterLabel, isAiDecidedTargeting, normalizeAudienceTargeting, resolveAudienceTargeting, summarizeTargeting } from "@/lib/audience-filters";
import { useCrestData, useOrders, useReviews, useUserBusiness } from "@/hooks/use-crest-data";
import { useLanguage } from "@/providers/language-provider";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: business, isLoading } = useUserBusiness(id);
  const { data: orders = [] } = useOrders(id);
  const { data: appData } = useCrestData();
  const { t, tn } = useLanguage();

  const products = useMemo(() => {
    if (!business || !appData) return [];
    return appData.products.filter((p) => business.productIds.includes(p.id));
  }, [business, appData]);

  const { data: reviews = [] } = useReviews({
    productIds: products.map((p) => p.id),
  });

  const chartData = useMemo(() => {
    if (!business) return [];
    const days = [
      t("common.dayMon"),
      t("common.dayTue"),
      t("common.dayWed"),
      t("common.dayThu"),
      t("common.dayFri"),
      t("common.daySat"),
      t("common.daySun"),
    ];
    return Array.from({ length: 7 }, (_, i) => ({
      day: days[i],
      revenue: Math.floor((business.revenue / 7) * (0.8 + Math.random() * 0.4)),
    }));
  }, [business, t]);

  if (isLoading) return <div className="h-96 rounded-2xl bg-white/[0.04] animate-pulse" />;

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-white/50">{t("biz.notFound")}</p>
        <Link href="/businesses"><Badge className="mt-4">{t("common.back")}</Badge></Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <Link href="/businesses" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>

      <div className="relative h-56 rounded-2xl overflow-hidden">
        <CrestImage src={business.image} category={business.category} seed={business.id} alt={tn(business.name)} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-black/40" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <OnMediaChip
              variant={
                business.status === "pending"
                  ? "pending"
                  : business.status === "growing"
                    ? "growing"
                    : "live"
              }
              className="uppercase"
            >
              {t(`biz.status.${business.status}`)}
            </OnMediaChip>
            <OnMediaChip variant="country">{tn(business.country)}</OnMediaChip>
            <OnMediaChip variant="category">{tn(business.category)}</OnMediaChip>
          </div>
          <h1 className="text-3xl font-semibold text-white drop-shadow-md">{tn(business.name)}</h1>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
          <TabsTrigger value="orders">{t("common.orders")}</TabsTrigger>
          <TabsTrigger value="products">{t("common.products")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("common.reviews")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("common.analytics")}</TabsTrigger>
          <TabsTrigger value="mission">{t("biz.mission")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-2">
            {[
              { label: t("biz.revenue"), value: formatINR(business.revenue) },
              { label: t("biz.profit"), value: formatINR(business.profit) },
              { label: t("common.orders"), value: formatNumber(business.orders) },
              { label: t("biz.inventory"), value: formatNumber(business.inventory) },
              { label: t("biz.withdrawable"), value: formatINR(business.withdrawable) },
              { label: t("biz.sellingPrice"), value: formatUSD(business.currentSellingPrice) },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/[0.06] bg-card p-4"
              >
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-semibold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {business.audienceTargeting && (() => {
            const audience = normalizeAudienceTargeting(business.audienceTargeting);
            const resolved = resolveAudienceTargeting(audience, business.category, business.country);
            const aiDecided = isAiDecidedTargeting(audience);
            return (
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-card p-6 space-y-3">
              <p className="text-sm font-medium text-white/50">{t("biz.targeting")}</p>
              <p className="text-sm text-white/80">
                {summarizeTargeting(audience, business.category, business.country)}
              </p>
              <p className="text-sm text-gold">
                {formatAudienceReach(estimateAudienceReach(business.country, resolved))}
              </p>
              {!aiDecided && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resolved.interests.map((i) => (
                    <Badge key={i} variant="gold" className="text-[10px]">{formatFilterLabel(i)}</Badge>
                  ))}
                  {resolved.behaviors.map((b) => (
                    <Badge key={b} variant="outline" className="text-[10px]">{formatFilterLabel(b)}</Badge>
                  ))}
                  {resolved.google.keywords.map((k) => (
                    <Badge key={k} variant="outline" className="text-[10px]">{formatFilterLabel(k)}</Badge>
                  ))}
                  {resolved.google.inMarket.map((i) => (
                    <Badge key={i} variant="gold" className="text-[10px]">{formatFilterLabel(i)}</Badge>
                  ))}
                </div>
              )}
            </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden mt-2">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-white/40">{t("biz.noOrders")}</p>
            ) : (
              orders.slice(0, 15).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.04] last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-white/50 font-mono tracking-wide mt-0.5 truncate">
                      {maskEmail(order.customerEmail)}
                    </p>
                    <p className="text-xs text-white/50 font-mono tracking-wide mt-0.5">
                      {maskPhone(order.customerPhone)}
                    </p>
                    <p className="text-xs text-white/35 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{formatINR(order.amount)}</p>
                    <Badge variant="outline" className="mt-1">{order.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-xl border border-white/[0.06] bg-card overflow-hidden">
                <div className="relative h-32">
                  <CrestImage src={product.image} category={product.category} seed={product.id} alt={product.name} fill className="object-cover" sizes="300px" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{tn(product.name)}</p>
                  <p className="text-xs text-white/40 mt-1">{formatINR(product.crestPrice)} · {t("common.score", { n: product.launchScore })}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="mt-2">
            <ReviewsPanel reviews={reviews} />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 mt-2">
            <p className="text-sm text-white/50 mb-4">{t("biz.weeklyRevenue")}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d4af37" fill="url(#goldGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mission">
          <div className="mt-6">
            <MissionTimeline steps={business.missionSteps} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
