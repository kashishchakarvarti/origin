"use client";

import { CREST_STATUS_META, type CrestStatus } from "@/lib/crest-status";
import { translateStatus } from "@/lib/translate-status";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

export function StatusBadge({
  status,
  className,
  onMedia = false,
}: {
  status: CrestStatus;
  className?: string;
  /** Solid high-contrast style for badges over images */
  onMedia?: boolean;
}) {
  const { t, language } = useLanguage();
  const meta = CREST_STATUS_META[status];
  return (
    <span
      key={`${language}:${status}`}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase",
        onMedia ? meta.onMediaClassName : meta.className,
        className
      )}
    >
      {translateStatus("crest", status, t)}
    </span>
  );
}
