/** Normalize raw status strings from data → i18n keys */

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

const ORDER_KEYS: Record<string, string> = {
  completed: "order.status.completed",
  processing: "order.status.processing",
  shipped: "order.status.shipped",
};

const PAY_KEYS: Record<string, string> = {
  completed: "pay.status.completed",
  pending: "pay.status.pending",
  failed: "pay.status.failed",
};

const BIZ_KEYS: Record<string, string> = {
  live: "biz.status.live",
  pending: "biz.status.pending",
  growing: "biz.status.growing",
};

const DOC_KEYS: Record<string, string> = {
  verified: "profile.docStatus.verified",
  pending: "profile.docStatus.pending",
  rejected: "profile.docStatus.rejected",
};

const CREST_KEYS: Record<string, string> = {
  new: "status.new",
  emerging: "status.emerging",
  high_potential: "status.high_potential",
  established: "status.established",
};

export type StatusKind = "order" | "pay" | "biz" | "doc" | "crest";

const KIND_MAPS: Record<StatusKind, Record<string, string>> = {
  order: ORDER_KEYS,
  pay: PAY_KEYS,
  biz: BIZ_KEYS,
  doc: DOC_KEYS,
  crest: CREST_KEYS,
};

export function statusI18nKey(kind: StatusKind, status: string): string {
  const key = KIND_MAPS[kind][norm(status)];
  if (key) return key;
  // Fallback: try kind.status.<raw>
  return `${kind === "crest" ? "status" : kind === "doc" ? "profile.docStatus" : `${kind}.status`}.${norm(status)}`;
}

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function translateStatus(kind: StatusKind, status: string, t: TranslateFn): string {
  return t(statusI18nKey(kind, status));
}
