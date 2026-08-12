"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/language-provider";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReviewsPanelProps {
  reviews: Review[];
  className?: string;
}

export function ReviewsPanel({ reviews, className }: ReviewsPanelProps) {
  const { t, tn } = useLanguage();
  const customers = reviews.filter((r) => r.authorType === "customer");
  const sellers = reviews.filter((r) => r.authorType === "seller");

  if (reviews.length === 0) {
    return (
      <div className={cn("rounded-2xl border border-white/[0.06] bg-card p-6", className)}>
        <p className="text-sm text-white/40">{t("reviews.empty")}</p>
      </div>
    );
  }

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("common.reviews")}</h3>
          <p className="text-sm text-white/40 mt-0.5">
            {reviews.length} {t("common.reviews").toLowerCase()} · {avg.toFixed(1)} {t("reviews.avg")}
          </p>
        </div>
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("h-4 w-4", i < Math.round(avg) ? "fill-gold" : "text-white/20")}
            />
          ))}
        </div>
      </div>

      <ReviewGroup title={t("reviews.customer")} items={customers} t={t} tn={tn} />
      <ReviewGroup title={t("reviews.seller")} items={sellers} t={t} tn={tn} />
    </div>
  );
}

function ReviewGroup({
  title,
  items,
  t,
  tn,
}: {
  title: string;
  items: Review[];
  t: (key: string) => string;
  tn: (name: string | null | undefined) => string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white/50">{title}</p>
      <div className="space-y-3">
        {items.slice(0, 4).map((review) => (
          <ReviewCard key={review.id} review={review} t={t} tn={tn} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  t,
  tn,
}: {
  review: Review;
  t: (key: string) => string;
  tn: (name: string | null | undefined) => string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{review.authorName}</p>
            <Badge variant="outline" className="text-[10px]">
              {review.authorType === "customer" ? t("common.customer") : t("common.seller")}
            </Badge>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            {tn(review.country)} · {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < review.rating ? "fill-gold text-gold" : "text-white/20"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm font-medium text-white/90">{review.title}</p>
      <p className="text-sm text-white/55 leading-relaxed">{review.comment}</p>
      <p className="text-[11px] text-white/30">
        {review.helpful} {t("reviews.helpful")}
      </p>
    </div>
  );
}
