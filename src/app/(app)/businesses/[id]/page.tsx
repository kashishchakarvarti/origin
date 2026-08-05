"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionTimeline } from "@/components/mission-control/mission-timeline";
import { formatINR, formatNumber, formatUSD } from "@/lib/format";
import { useCrestData, useOrders, useUserBusiness } from "@/hooks/use-crest-data";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: business, isLoading } = useUserBusiness(id);
  const { data: orders = [] } = useOrders(id);
  const { data: appData } = useCrestData();

  const products = useMemo(() => {
    if (!business || !appData) return [];
    return appData.products.filter((p) => business.productIds.includes(p.id));
  }, [business, appData]);

  const chartData = useMemo(() => {
    if (!business) return [];
    return Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      revenue: Math.floor(business.revenue / 7 * (0.8 + Math.random() * 0.4)),
    }));
  }, [business]);

  if (isLoading) return <div className="h-96 rounded-2xl bg-white/[0.04] animate-pulse" />;

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-white/50">Business not found.</p>
        <Link href="/businesses"><Badge className="mt-4">Back</Badge></Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <Link href="/businesses" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="relative h-56 rounded-2xl overflow-hidden">
        <CrestImage src={business.image} category={business.category} seed={business.id} alt={business.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="flex gap-2 mb-2">
            <Badge variant="live">LIVE</Badge>
            <Badge variant="outline">{business.country}</Badge>
            <Badge variant="gold">{business.category}</Badge>
          </div>
          <h1 className="text-3xl font-semibold">{business.name}</h1>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="mission">Mission Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-2">
            {[
              { label: "Revenue", value: formatINR(business.revenue) },
              { label: "Profit", value: formatINR(business.profit) },
              { label: "Orders", value: formatNumber(business.orders) },
              { label: "Inventory", value: formatNumber(business.inventory) },
              { label: "Withdrawable", value: formatINR(business.withdrawable) },
              { label: "Selling Price", value: formatUSD(business.currentSellingPrice) },
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
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden mt-2">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-white/40">No orders yet.</p>
            ) : (
              orders.slice(0, 15).map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-white/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
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
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-white/40 mt-1">{formatINR(product.crestPrice)} · Score {product.launchScore}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 mt-2">
            <p className="text-sm text-white/50 mb-4">Weekly Revenue</p>
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
