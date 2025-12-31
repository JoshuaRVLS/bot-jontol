"use client";

import { useState } from "react";
import { Wallet, Landmark, ArrowRightLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { manageBalanceAction } from "@/app/actions/economy";
import { motion, AnimatePresence } from "framer-motion";

interface BalanceManagerProps {
    initialWallet: number;
    initialBank: number;
}

const BalanceManager = ({ initialWallet, initialBank }: BalanceManagerProps) => {
    const [wallet, setWallet] = useState(initialWallet);
    const [bank, setBank] = useState(initialBank);
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleAction = async (type: "deposit" | "withdraw") => {
        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setStatus({ type: "error", message: "Masukin angka saldo yang bener bang!" });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            const res = await manageBalanceAction(type, numAmount);
            if (res.error) {
                setStatus({ type: "error", message: res.error });
            } else {
                setStatus({
                    type: "success",
                    message: `Berhasil ${type === "deposit" ? "pindah ke Bank" : "tarik ke Wallet"} sebesar Rp ${numAmount.toLocaleString()}!`
                });

                // Optimistic update
                if (type === "deposit") {
                    setWallet(prev => prev - numAmount);
                    setBank(prev => prev + numAmount);
                } else {
                    setBank(prev => prev - numAmount);
                    setWallet(prev => prev + numAmount);
                }
                setAmount("");
            }
        } catch (err) {
            setStatus({ type: "error", message: "Server hubunganya lagi gak baik bang." });
        } finally {
            setIsLoading(false);
            // Clear status after 5s
            setTimeout(() => setStatus(null), 5000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Wallet Card */}
                    <div className="glass-card p-6 rounded-[32px] border-emerald-500/10 bg-emerald-500/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <Wallet size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cash on Hand</span>
                        </div>
                        <h4 className="text-2xl font-black font-mono tracking-tighter">
                            Rp {wallet.toLocaleString()}
                        </h4>
                    </div>

                    {/* Bank Card */}
                    <div className="glass-card p-6 rounded-[32px] border-blue-500/10 bg-blue-500/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                        <div className="flex items-center gap-3 text-blue-400 mb-4">
                            <Landmark size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Bank Savings</span>
                        </div>
                        <h4 className="text-2xl font-black font-mono tracking-tighter">
                            Rp {bank.toLocaleString()}
                        </h4>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[40px] space-y-8 relative overflow-hidden border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <ArrowRightLeft size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight">Transfer Saldo</h3>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">Manage your liquidity bang.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm">Rp</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xl font-black font-mono focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAction("deposit")}
                                disabled={isLoading}
                                className="py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Deposit"}
                            </button>
                            <button
                                onClick={() => handleAction("withdraw")}
                                disabled={isLoading}
                                className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Withdraw"}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === "success"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}
                            >
                                {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <p className="text-xs font-bold">{status.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="glass-card p-8 rounded-[40px] border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
                    <Landmark size={32} className="text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Finansial Lu Aman</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px] mx-auto opacity-70">
                        Simpan uang di bank biar gak kena rampok/begal di command Discord bang! Pajak bank cuma 0%.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BalanceManager;
