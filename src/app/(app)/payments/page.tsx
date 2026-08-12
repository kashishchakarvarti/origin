"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowDownToLine } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { crestStore } from "@/lib/data/store";
import { formatINR } from "@/lib/format";
import { useCrestData, useTransactions } from "@/hooks/use-crest-data";
import { useToast } from "@/providers/toast-provider";
import { useLanguage } from "@/providers/language-provider";

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { data: appData } = useCrestData();
  const { data: transactions = [] } = useTransactions();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const stats = appData?.dashboardStats;
  const pending = transactions
    .filter((t) => t.status === "pending")
    .reduce((s, t) => s + t.amount, 0);
  const lifetime = stats?.revenue ?? 0;

  const handleWithdraw = () => {
    const num = parseInt(amount.replace(/,/g, ""), 10);
    if (isNaN(num) || num <= 0) {
      toast({ title: "Invalid amount", variant: "error" });
      return;
    }
    const success = crestStore.withdraw(num);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["crest"] });
      toast({ title: "Withdrawal initiated", description: formatINR(num) + " will be transferred.", variant: "success" });
      setShowWithdraw(false);
      setAmount("");
    } else {
      toast({ title: "Insufficient balance", variant: "error" });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight">{t("pay.title")}</h1>
        <p className="text-white/50 mt-2">Manage your earnings and withdrawals</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Withdrawable", value: stats?.withdrawable ?? 0, highlight: true },
          { label: "Pending", value: pending },
          { label: "Lifetime Revenue", value: lifetime },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/[0.06] bg-card p-6"
          >
            <p className="text-sm text-white/50">{stat.label}</p>
            <p className={`text-2xl font-semibold mt-2 ${stat.highlight ? "text-gold" : "text-white"}`}>
              {formatINR(stat.value)}
            </p>
          </motion.div>
        ))}
      </div>

      <Button size="lg" onClick={() => setShowWithdraw(true)}>
        <ArrowDownToLine className="h-4 w-4" />
        Withdraw
      </Button>

      <div className="rounded-2xl border border-white/[0.06] bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold">Transactions</h2>
        </div>
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] last:border-0">
            <div>
              <p className="text-sm font-medium capitalize">{txn.type}</p>
              <p className="text-xs text-white/40">{txn.description}</p>
              <p className="text-[10px] text-white/30 mt-1">{new Date(txn.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${txn.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`}>
                {txn.type === "withdrawal" ? "−" : "+"}{formatINR(txn.amount)}
              </p>
              <Badge variant="outline" className="mt-1">{txn.status}</Badge>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Available: {formatINR(stats?.withdrawable ?? 0)}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowWithdraw(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleWithdraw}>Confirm Withdrawal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
