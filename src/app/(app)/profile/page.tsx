"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, LogOut, MapPin, Phone, Shield, User } from "lucide-react";
import { CrestImage } from "@/components/ui/crest-image";
import { AVATAR_IMAGE } from "@/lib/images";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crestStore } from "@/lib/data/store";
import { type LanguageCode } from "@/lib/i18n";
import { maskAddress, maskEmail, maskPhone } from "@/lib/mask";
import { useCrestData } from "@/hooks/use-crest-data";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useTheme, type ThemeMode } from "@/providers/theme-provider";
import { useToast } from "@/providers/toast-provider";

const DOC_NAME_KEYS: Record<string, string> = {
  Passport: "profile.doc.passport",
  "Business License": "profile.doc.license",
  "Tax Certificate": "profile.doc.tax",
};

const DOC_STATUS_KEYS: Record<string, string> = {
  Verified: "profile.docStatus.verified",
  Pending: "profile.docStatus.pending",
  Rejected: "profile.docStatus.rejected",
};

const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-AE",
  de: "de-DE",
};

export default function ProfilePage() {
  const { data: appData } = useCrestData();
  const { logout } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const profile = appData?.profile;
  const dateLocale = DATE_LOCALES[language] ?? "en-US";

  const translateDocName = (name: string) =>
    DOC_NAME_KEYS[name] ? t(DOC_NAME_KEYS[name]) : name;
  const translateDocStatus = (status: string) =>
    DOC_STATUS_KEYS[status] ? t(DOC_STATUS_KEYS[status]) : status;

  const [name, setName] = useState(profile?.name ?? "");
  const [emailNotif, setEmailNotif] = useState(profile?.settings.emailNotifications ?? true);
  const [pushNotif, setPushNotif] = useState(profile?.settings.pushNotifications ?? true);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (profile?.settings) {
      setEmailNotif(profile.settings.emailNotifications);
      setPushNotif(profile.settings.pushNotifications);
    }
  }, [profile]);

  const handleSave = () => {
    crestStore.updateProfile({ name });
    queryClient.invalidateQueries({ queryKey: ["crest"] });
    toast({ title: t("profile.updated"), variant: "success" });
  };

  const handleSettingsSave = () => {
    crestStore.updateSettings({
      emailNotifications: emailNotif,
      pushNotifications: pushNotif,
      language,
    });
    queryClient.invalidateQueries({ queryKey: ["crest"] });
    toast({ title: t("profile.settingsSaved"), variant: "success" });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">{t("profile.title")}</h1>
      </motion.div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/[0.06]">
          <CrestImage src={profile?.avatar ?? AVATAR_IMAGE} alt={t("profile.avatarAlt")} fill className="object-cover" />
        </div>
        <div>
          <p className="text-lg font-semibold">{profile?.name}</p>
          <p className="text-sm text-white/50 font-mono tracking-wide">
            {maskEmail(profile?.email)}
          </p>
        </div>
        <Badge variant="live" className="ml-auto">{t("profile.verified")}</Badge>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal"><User className="h-3.5 w-3.5 mr-1.5" />{t("profile.personal")}</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-3.5 w-3.5 mr-1.5" />{t("profile.documents")}</TabsTrigger>
          <TabsTrigger value="kyc"><Shield className="h-3.5 w-3.5 mr-1.5" />{t("profile.kyc")}</TabsTrigger>
          <TabsTrigger value="settings">{t("profile.settings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label>{t("profile.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <MaskedField
              label={t("profile.email")}
              value={maskEmail(profile?.email)}
              hint={t("profile.masked")}
            />
            <MaskedField
              label={t("profile.phone")}
              value={maskPhone(profile?.phone)}
              hint={t("profile.masked")}
              icon={<Phone className="h-3.5 w-3.5 text-white/30" />}
            />
            <MaskedField
              label={t("profile.address")}
              value={maskAddress(profile?.address)}
              hint={t("profile.masked")}
              icon={<MapPin className="h-3.5 w-3.5 text-white/30" />}
            />

            <p className="text-xs text-white/35 leading-relaxed">
              {t("profile.privacyNote")}
            </p>
            <Button onClick={handleSave}>{t("common.save")}</Button>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
            <p className="text-sm text-white/50 mb-2">{t("profile.businesses")}</p>
            <p className="text-2xl font-semibold">{appData?.dashboardStats.businesses ?? 0}</p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden">
            {profile?.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-white/40" />
                  <div>
                    <p className="text-sm font-medium">{translateDocName(doc.name)}</p>
                    <p className="text-xs text-white/40">
                      {new Date(doc.uploadedAt).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                </div>
                <Badge variant="live">{translateDocStatus(doc.status)}</Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="mt-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">{t("profile.identity")}</h3>
            <p className="text-sm text-white/50">{t("profile.identityDesc")}</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-card p-6 space-y-6">
            <div className="space-y-2">
              <Label>{t("common.language")}</Label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as LanguageCode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native} · {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("profile.theme")}</Label>
              <Select
                value={theme}
                onValueChange={(v) => setTheme(v as ThemeMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                  <SelectItem value="light">{t("theme.light")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("profile.emailNotif")}</p>
                <p className="text-xs text-white/40">{t("profile.emailNotifDesc")}</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("profile.pushNotif")}</p>
                <p className="text-xs text-white/40">{t("profile.pushNotifDesc")}</p>
              </div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
            <Button onClick={handleSettingsSave}>{t("profile.saveSettings")}</Button>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-card p-6">
            <h3 className="font-medium mb-2">{t("support.title")}</h3>
            <p className="text-sm text-white/50 mb-4">{t("support.available")}</p>
            <Button variant="secondary" onClick={() => router.push("/support")}>
              {t("profile.openSupport")}
            </Button>
          </div>

          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" /> {t("profile.logout")}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MaskedField({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        {icon}
        <span className="flex-1 text-sm font-mono tracking-wide text-white/70">{value}</span>
        <Badge variant="outline" className="text-[10px] shrink-0">{hint}</Badge>
      </div>
    </div>
  );
}
