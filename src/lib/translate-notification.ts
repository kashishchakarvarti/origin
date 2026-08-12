import { NOTIF_TITLE_TO_KEYS } from "./i18n-extra";
import type { Notification } from "./types";

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;
type TranslateNameFn = (name: string | undefined | null) => string;

function localizeVars(
  vars: Record<string, string> | undefined,
  tn: TranslateNameFn
): Record<string, string> {
  if (!vars) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(vars)) {
    if (k === "name" || k === "country" || k === "category" || k === "step") {
      out[k] = tn(v) || v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Translate stored notification title/message using keys or English title map */
export function translateNotification(
  notif: Notification,
  t: TranslateFn,
  tn: TranslateNameFn
): { title: string; message: string } {
  const mapped = NOTIF_TITLE_TO_KEYS[notif.title];
  const titleKey = notif.titleKey ?? mapped?.titleKey;
  const messageKey = notif.messageKey ?? mapped?.messageKey;
  const vars = localizeVars(notif.vars, tn);

  if (titleKey && messageKey) {
    return {
      title: t(titleKey),
      message: t(messageKey, vars),
    };
  }

  // Fallback: translate known entities inside English message
  let message = notif.message;
  if (notif.vars) {
    for (const [k, v] of Object.entries(notif.vars)) {
      if (k === "name" || k === "country" || k === "category" || k === "step") {
        message = message.split(v).join(tn(v) || v);
      }
    }
  }
  return { title: notif.title, message };
}
