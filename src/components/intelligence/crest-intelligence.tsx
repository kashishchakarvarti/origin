"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AI_RESPONSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTION_KEYS = [
  "intelligence.suggest.canada",
  "intelligence.suggest.recommend",
  "intelligence.suggest.category",
  "intelligence.suggest.products",
] as const;

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("canada") || lower.includes("कनाडा") || lower.includes("canadá")) {
    return AI_RESPONSES.canada;
  }
  if (lower.includes("recommend") || lower.includes("suger") || lower.includes("empfehl")) {
    return AI_RESPONSES.recommend;
  }
  if (
    lower.includes("category") ||
    lower.includes("performing") ||
    lower.includes("catégorie") ||
    lower.includes("categoría")
  ) {
    return AI_RESPONSES.category;
  }
  if (lower.includes("product") || lower.includes("produit") || lower.includes("producto")) {
    return AI_RESPONSES.products;
  }
  return AI_RESPONSES.default;
}

export function CrestIntelligence() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const greeting = t("intelligence.greeting");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const displayMessages = useMemo(
    () => (messages.length > 0 ? messages : [{ role: "assistant" as const, content: greeting }]),
    [messages, greeting]
  );

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => {
      const base = prev.length > 0 ? prev : [{ role: "assistant" as const, content: greeting }];
      return [...base, { role: "user", content: text }];
    });
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getAIResponse(text) }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black shadow-2xl shadow-gold/20 transition-shadow hover:shadow-gold/40",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[400px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                  <MessageCircle className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t("intelligence.brand")}</p>
                  <p className="text-[10px] text-white/40">{t("intelligence.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {displayMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-gold/15 text-white border border-gold/20"
                          : "bg-white/[0.04] text-white/80 border border-white/[0.06]"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-1 px-4 py-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-gold"
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-white/[0.06] p-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTION_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => sendMessage(t(key))}
                    className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("intelligence.placeholder")}
                  className="flex-1 h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
