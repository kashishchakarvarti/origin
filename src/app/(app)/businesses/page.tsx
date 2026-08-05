"use client";

import { motion } from "framer-motion";
import { BusinessCard } from "@/components/businesses/business-card";
import { useUserBusinesses } from "@/hooks/use-crest-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyBusinessesPage() {
  const { data: businesses = [], isLoading } = useUserBusinesses();

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Businesses</h1>
          <p className="text-white/50 mt-2">{businesses.length} active businesses</p>
        </div>
        <Link href="/opportunities">
          <Button>Launch New Business</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz, i) => (
            <BusinessCard key={biz.id} business={biz} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
