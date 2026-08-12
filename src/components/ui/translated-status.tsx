"use client";

import { translateStatus, type StatusKind } from "@/lib/translate-status";
import { useLanguage } from "@/providers/language-provider";

/** Always re-resolves status labels from the active language. */
export function TranslatedStatus({
  kind,
  status,
}: {
  kind: StatusKind;
  status: string;
}) {
  const { t, language } = useLanguage();
  return <span key={`${language}:${kind}:${status}`}>{translateStatus(kind, status, t)}</span>;
}
