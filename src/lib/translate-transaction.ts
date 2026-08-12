import type { Transaction } from "./types";

const TYPE_KEYS: Record<Transaction["type"], string> = {
  withdrawal: "pay.type.withdrawal",
  revenue: "pay.type.revenue",
  refund: "pay.type.refund",
  deposit: "pay.type.deposit",
};

const STATUS_KEYS: Record<Transaction["status"], string> = {
  completed: "pay.status.completed",
  pending: "pay.status.pending",
  failed: "pay.status.failed",
};

const DESC_KEYS: Record<Transaction["type"], string> = {
  withdrawal: "pay.desc.withdrawal",
  revenue: "pay.desc.revenue",
  refund: "pay.desc.refund",
  deposit: "pay.desc.deposit",
};

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;
type TranslateNameFn = (name: string | undefined | null) => string;

export function translateTransactionType(type: Transaction["type"], t: TranslateFn): string {
  return t(TYPE_KEYS[type] ?? "pay.type.deposit");
}

export function translateTransactionStatus(
  status: Transaction["status"] | string,
  t: TranslateFn
): string {
  const normalized = String(status ?? "pending").trim().toLowerCase() as Transaction["status"];
  return t(STATUS_KEYS[normalized] ?? "pay.status.pending");
}

export function translateTransactionDescription(
  txn: Transaction,
  t: TranslateFn,
  tn: TranslateNameFn
): string {
  const key = DESC_KEYS[txn.type];
  if (!key) return txn.description;
  if (txn.type === "revenue" || txn.type === "refund") {
    return t(key, { name: tn(txn.businessName) || txn.businessName || "" });
  }
  return t(key);
}
