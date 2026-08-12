import type { IntelligenceInsight, Opportunity } from "./types";

/** Opportunity / insight status — practical labels, not salesy promises */
export type CrestStatus = "new" | "emerging" | "high_potential" | "established";

export const CREST_STATUS_META: Record<
  CrestStatus,
  { className: string; onMediaClassName: string }
> = {
  new: {
    className: "status-inline status-inline--new",
    onMediaClassName: "status-on-media status-on-media--new",
  },
  emerging: {
    className: "status-inline status-inline--emerging",
    onMediaClassName: "status-on-media status-on-media--emerging",
  },
  high_potential: {
    className: "status-inline status-inline--high",
    onMediaClassName: "status-on-media status-on-media--high",
  },
  established: {
    className: "status-inline status-inline--established",
    onMediaClassName: "status-on-media status-on-media--established",
  },
};

export function resolveOpportunityStatus(opp: Opportunity): CrestStatus {
  if (opp.status) return opp.status;

  const score = opp.launchScore;
  const started = opp.peopleStarted ?? 0;
  const capacity = opp.availableCapacity ?? 50;

  if (started < 120 || capacity > 70) return "new";
  if (score >= 92 && opp.monthlyOrders >= 2500) return "high_potential";
  if (started >= 1200 && score >= 85) return "established";
  return "emerging";
}

export function resolveIntelligenceStatus(insight: IntelligenceInsight): CrestStatus {
  if (insight.status) return insight.status;
  if (insight.confidence >= 94) return "high_potential";
  if (insight.confidence >= 90) return "emerging";
  if (insight.confidence >= 85) return "established";
  return "new";
}
