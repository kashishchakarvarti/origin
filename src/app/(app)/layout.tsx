"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CrestIntelligence } from "@/components/intelligence/crest-intelligence";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-[260px]">
          <Header />
          <main className="p-8">{children}</main>
        </div>
        <CrestIntelligence />
      </div>
    </AuthGuard>
  );
}
