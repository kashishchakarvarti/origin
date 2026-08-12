"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AGE_PRESETS,
  BEHAVIOR_OPTIONS,
  type AudienceTargeting,
  type GoogleAdsTargeting,
  estimateAudienceReach,
  GENDER_OPTIONS,
  GOOGLE_AFFINITY_OPTIONS,
  GOOGLE_BID_STRATEGY_OPTIONS,
  GOOGLE_CUSTOM_INTENT_OPTIONS,
  GOOGLE_IN_MARKET_OPTIONS,
  GOOGLE_KEYWORD_OPTIONS,
  GOOGLE_LIFE_EVENT_OPTIONS,
  GOOGLE_PARENTAL_OPTIONS,
  GOOGLE_PLACEMENT_OPTIONS,
  GOOGLE_REMARKETING_OPTIONS,
  INCOME_OPTIONS,
  INTEREST_OPTIONS,
  isAiDecidedTargeting,
  LANGUAGE_OPTIONS,
  PLATFORM_OPTIONS,
  resolveAudienceTargeting,
} from "@/lib/audience-filters";
import type { Category, Country } from "@/lib/types";
import {
  formatAudienceReachI18n,
  translateAudienceLangLabel,
  translateAudienceTag,
  translateBidLabel,
  translateGenderLabel,
  translateIncomeLabel,
  translateParentalLabel,
  translatePlacementLabel,
  translatePlatformLabel,
} from "@/lib/translate-audience";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

interface AudienceFiltersPanelProps {
  country: Country | null;
  category: Category | null;
  targeting: AudienceTargeting;
  onChange: (targeting: AudienceTargeting) => void;
}

export function AudienceFiltersPanel({
  country,
  category,
  targeting,
  onChange,
}: AudienceFiltersPanelProps) {
  const { t, tn } = useLanguage();
  const [activeTab, setActiveTab] = useState("audience");
  const [showFilters, setShowFilters] = useState(false);
  const aiDecided = isAiDecidedTargeting(targeting);
  const effectiveTargeting = resolveAudienceTargeting(targeting, category, country);
  const reach = estimateAudienceReach(country, effectiveTargeting);
  const google = targeting.google;

  const updateGoogle = (patch: Partial<GoogleAdsTargeting>) => {
    onChange({ ...targeting, google: { ...google, ...patch }, aiDecided: false });
  };

  const handleAiDecideChange = (checked: boolean) => {
    if (checked) {
      setShowFilters(false);
      onChange({ ...targeting, aiDecided: true });
      return;
    }
    onChange({ ...targeting, aiDecided: false });
  };

  const togglePlatform = (platform: AudienceTargeting["platforms"][number]) => {
    const platforms = targeting.platforms.includes(platform)
      ? targeting.platforms.filter((p) => p !== platform)
      : [...targeting.platforms, platform];
    onChange({ ...targeting, platforms: platforms.length ? platforms : [platform], aiDecided: false });
  };

  const toggleList = (
    key: keyof Pick<GoogleAdsTargeting, "placements" | "keywords" | "inMarket" | "affinity" | "customIntent" | "remarketing" | "lifeEvents">,
    value: string,
    minOne = false
  ) => {
    const current = google[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    if (minOne && next.length === 0) return;
    updateGoogle({ [key]: next });
  };

  const toggleInterest = (interest: string) => {
    const interests = targeting.interests.includes(interest)
      ? targeting.interests.filter((i) => i !== interest)
      : [...targeting.interests, interest];
    onChange({ ...targeting, interests, aiDecided: false });
  };

  const toggleBehavior = (behavior: string) => {
    const behaviors = targeting.behaviors.includes(behavior)
      ? targeting.behaviors.filter((b) => b !== behavior)
      : [...targeting.behaviors, behavior];
    onChange({ ...targeting, behaviors, aiDecided: false });
  };

  if (!country) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
            <SlidersHorizontal className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t("audience.title")}</p>
            <p className="text-xs text-white/40">{t("audience.market", { country: tn(country) })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/[0.06] px-3 py-2">
          <Users className="h-4 w-4 text-gold" />
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">{t("audience.estReach")}</p>
            <p className="text-sm font-semibold text-gold">{formatAudienceReachI18n(reach, t)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <label className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 cursor-pointer hover:border-gold/20 transition-colors">
          <Checkbox
            checked={aiDecided}
            onCheckedChange={(checked) => handleAiDecideChange(checked === true)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-sm font-medium">{t("audience.aiCheckbox")}</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              {t("audience.aiDescription")}
            </p>
          </div>
        </label>

        {aiDecided && (
          <div className="rounded-xl border border-gold/15 bg-gold/[0.04] px-4 py-3">
            <p className="text-xs text-gold/90">{t("audience.aiActive")}</p>
          </div>
        )}

        {!aiDecided && (
          <div className="space-y-4">
            <ButtonLikeToggle
              open={showFilters}
              onClick={() => setShowFilters((open) => !open)}
              label={t("audience.advanced")}
            />

            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
                    <TabsList className="mb-6">
                      <TabsTrigger value="audience">{t("audience.tab.profile")}</TabsTrigger>
                      <TabsTrigger value="google">{t("audience.tab.channels")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="audience" className="space-y-6 mt-0">
                      <FilterSection title={t("audience.sec.demographics")}>
                        <div className="space-y-3">
                          <Label className="text-xs text-white/50">{t("audience.field.age")}</Label>
                          <ChipRow>
                            {AGE_PRESETS.map((preset) => {
                              const active = targeting.ageMin === preset.min && targeting.ageMax === preset.max;
                              return (
                                <FilterChip
                                  key={preset.label}
                                  active={active}
                                  onClick={() =>
                                    onChange({
                                      ...targeting,
                                      ageMin: preset.min,
                                      ageMax: preset.max,
                                      aiDecided: false,
                                    })
                                  }
                                >
                                  {preset.label}
                                </FilterChip>
                              );
                            })}
                          </ChipRow>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label className="text-xs text-white/50">{t("audience.field.gender")}</Label>
                          <ChipRow>
                            {GENDER_OPTIONS.map((opt) => (
                              <FilterChip
                                key={opt.value}
                                active={targeting.gender === opt.value}
                                onClick={() =>
                                  onChange({ ...targeting, gender: opt.value, aiDecided: false })
                                }
                              >
                                {translateGenderLabel(opt.value, t)}
                              </FilterChip>
                            ))}
                          </ChipRow>
                        </div>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.platforms")}>
                        <ChipRow>
                          {PLATFORM_OPTIONS.map((opt) => (
                            <FilterChip
                              key={opt.value}
                              active={targeting.platforms.includes(opt.value)}
                              onClick={() => togglePlatform(opt.value)}
                            >
                              {translatePlatformLabel(opt.value, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.interests")}>
                        <ChipRow pill>
                          {INTEREST_OPTIONS.map((interest) => (
                            <FilterChip
                              key={interest}
                              active={targeting.interests.includes(interest)}
                              onClick={() => toggleInterest(interest)}
                              pill
                            >
                              {translateAudienceTag(interest, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.behaviors")}>
                        <ChipRow pill>
                          {BEHAVIOR_OPTIONS.map((behavior) => (
                            <FilterChip
                              key={behavior}
                              active={targeting.behaviors.includes(behavior)}
                              onClick={() => toggleBehavior(behavior)}
                              pill
                            >
                              {translateAudienceTag(behavior, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <SelectField
                          label={t("audience.sec.income")}
                          value={targeting.incomeLevel}
                          options={INCOME_OPTIONS.map((o) => ({
                            value: o.value,
                            label: translateIncomeLabel(o.value, t),
                          }))}
                          onChange={(v) => onChange({ ...targeting, incomeLevel: v, aiDecided: false })}
                        />
                        <SelectField
                          label={t("audience.sec.language")}
                          value={targeting.language}
                          options={LANGUAGE_OPTIONS.map((o) => ({
                            value: o.value,
                            label: translateAudienceLangLabel(o.value, t),
                          }))}
                          onChange={(v) => onChange({ ...targeting, language: v, aiDecided: false })}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="google" className="space-y-6 mt-0">
                      <FilterSection title={t("audience.sec.placements")}>
                        <ChipRow>
                          {GOOGLE_PLACEMENT_OPTIONS.map((opt) => (
                            <FilterChip
                              key={opt.value}
                              active={google.placements.includes(opt.value)}
                              onClick={() => toggleList("placements", opt.value, true)}
                            >
                              {translatePlacementLabel(opt.value, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.keywords")}>
                        <ChipRow pill>
                          {GOOGLE_KEYWORD_OPTIONS.map((kw) => (
                            <FilterChip
                              key={kw}
                              active={google.keywords.includes(kw)}
                              onClick={() => toggleList("keywords", kw)}
                              pill
                            >
                              {translateAudienceTag(kw, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.inMarket")}>
                        <ChipRow pill>
                          {GOOGLE_IN_MARKET_OPTIONS.map((item) => (
                            <FilterChip
                              key={item}
                              active={google.inMarket.includes(item)}
                              onClick={() => toggleList("inMarket", item)}
                              pill
                            >
                              {translateAudienceTag(item, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.affinity")}>
                        <ChipRow pill>
                          {GOOGLE_AFFINITY_OPTIONS.map((item) => (
                            <FilterChip
                              key={item}
                              active={google.affinity.includes(item)}
                              onClick={() => toggleList("affinity", item)}
                              pill
                            >
                              {translateAudienceTag(item, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.customIntent")}>
                        <ChipRow pill>
                          {GOOGLE_CUSTOM_INTENT_OPTIONS.map((item) => (
                            <FilterChip
                              key={item}
                              active={google.customIntent.includes(item)}
                              onClick={() => toggleList("customIntent", item)}
                              pill
                            >
                              {translateAudienceTag(item, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.remarketing")}>
                        <ChipRow pill>
                          {GOOGLE_REMARKETING_OPTIONS.map((item) => (
                            <FilterChip
                              key={item}
                              active={google.remarketing.includes(item)}
                              onClick={() => toggleList("remarketing", item)}
                              pill
                            >
                              {translateAudienceTag(item, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <FilterSection title={t("audience.sec.lifeEvents")}>
                        <ChipRow pill>
                          {GOOGLE_LIFE_EVENT_OPTIONS.map((item) => (
                            <FilterChip
                              key={item}
                              active={google.lifeEvents.includes(item)}
                              onClick={() => toggleList("lifeEvents", item)}
                              pill
                            >
                              {translateAudienceTag(item, t)}
                            </FilterChip>
                          ))}
                        </ChipRow>
                      </FilterSection>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <SelectField
                          label={t("audience.sec.bidStrategy")}
                          value={google.bidStrategy}
                          options={GOOGLE_BID_STRATEGY_OPTIONS.map((o) => ({
                            value: o.value,
                            label: translateBidLabel(o.value, t),
                          }))}
                          onChange={(v) => updateGoogle({ bidStrategy: v })}
                        />
                        <SelectField
                          label={t("audience.sec.parental")}
                          value={google.parentalStatus}
                          options={GOOGLE_PARENTAL_OPTIONS.map((o) => ({
                            value: o.value,
                            label: translateParentalLabel(o.value, t),
                          }))}
                          onChange={(v) => updateGoogle({ parentalStatus: v })}
                        />
                      </div>

                      {(google.keywords.length > 0 ||
                        google.inMarket.length > 0 ||
                        google.affinity.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                          {google.placements.map((p) => (
                            <Badge key={p} variant="gold" className="text-[10px]">
                              {translatePlacementLabel(p, t)}
                            </Badge>
                          ))}
                          {google.keywords.map((k) => (
                            <Badge key={k} variant="outline" className="text-[10px]">
                              {translateAudienceTag(k, t)}
                            </Badge>
                          ))}
                          {google.inMarket.map((i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {translateAudienceTag(i, t)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ButtonLikeToggle({
  open,
  onClick,
  label,
}: {
  open: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all",
        open
          ? "border-gold/30 bg-gold/[0.05] text-gold"
          : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/[0.12]"
      )}
    >
      <span className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        {label}
      </span>
      <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
    </button>
  );
}

function FilterSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        {subtitle && (
          <p className="text-[10px] text-white/30 uppercase tracking-wider">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function ChipRow({ children, pill }: { children: ReactNode; pill?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-2", pill && "gap-1.5")}>{children}</div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  pill,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  pill?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border font-medium transition-all",
        pill
          ? "rounded-full px-3 py-1 text-[11px]"
          : "rounded-lg px-3 py-1.5 text-xs",
        active
          ? "border-gold/40 bg-gold/10 text-gold"
          : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.12]"
      )}
    >
      {children}
    </button>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-white/50">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
