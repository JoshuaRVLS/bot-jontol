"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Trophy, RotateCw, Plus, Minus, Zap } from "lucide-react";
import { spinSlotsAction } from "@/app/actions/slots";
import { SymbolID, SYMBOLS } from "@/lib/slots";
import { formatRupiah, formatNumber, parseBet } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

import { memo } from "react";

const SymbolIcon = memo(({ id, className }: { id: SymbolID, className?: string }) => {
    const map: Record<SymbolID, string> = {
        0: "🍒", 1: "🍋", 2: "🍊", 3: "🍇", 4: "🔔", 5: "🍫", 6: "7️⃣", 7: "💎", 8: "🃏"
    };
    return (
        <span className={cn("text-4xl sm:text-6xl drop-shadow-md select-none", className)}>
            {map[id]}
        </span>
    );
});
SymbolIcon.displayName = "SymbolIcon";

export default function SlotsClient({ guildId, initialWallet }: { guildId: string; initialWallet: number }) {
    const { toast } = useToast();
    const [wallet, setWallet] = useState(initialWallet);
    const [bet, setBet] = useState(10000);
    const [betInput, setBetInput] = useState("10000");
    const [spinningReels, setSpinningReels] = useState<boolean[]>([false, false, false, false, false]);

    useEffect(() => {
        setBetInput(bet.toString());
    }, [bet]);

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setBetInput(val);
        const parsed = parseBet(val);
        if (parsed > 0) setBet(parsed);
    };
    const [isGameActive, setIsGameActive] = useState(false);
    const [grid, setGrid] = useState<SymbolID[]>(Array(15).fill(6));
    const [lastWin, setLastWin] = useState(0);
    const [isCrazy, setIsCrazy] = useState(false);

    const spinReels = async () => {
        if (wallet < bet) return toast("Saldo gak cukup!", "error");
        if (bet < 1000) return toast("Min bet 1000!", "error");
        if (isGameActive) return;

        setIsGameActive(true);
        setSpinningReels([true, true, true, true, true]);
        setLastWin(0);
        setWallet(prev => prev - bet);

        const result = await spinSlotsAction(bet, isCrazy);
        await new Promise(r => setTimeout(r, 1000));

        if (result.error) {
            toast(result.error, "error");
            setSpinningReels([false, false, false, false, false]);
            setIsGameActive(false);
            return;
        }

        if (result.success && result.grid) {
            setGrid(result.grid);
            for (let i = 0; i < 5; i++) {
                await new Promise(r => setTimeout(r, 400));
                setSpinningReels(prev => {
                    const next = [...prev];
                    next[i] = false;
                    return next;
                });
            }

            await new Promise(r => setTimeout(r, 300));
            setLastWin(result.payout);
            if (result.payout > 0) {
                setWallet(prev => prev + result.payout);
            }
            setIsGameActive(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F13] text-white flex flex-col font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0F0F13] to-[#0F0F13] opacity-60" />

            <div className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-yellow-500">
                    <Trophy className="w-6 h-6" />
                    <span className="font-black italic text-xl tracking-tighter">JONTOL SLOTS</span>
                </div>
                <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-lg font-mono">{formatRupiah(wallet)}</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 gap-8">
                <div className="h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isGameActive && lastWin === 0 ? (
                            <motion.div key="spinning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-purple-300 font-bold text-2xl animate-pulse">
                                SPINNING...
                            </motion.div>
                        ) : lastWin > 0 ? (
                            <motion.div key="win" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.5 }} className="text-yellow-400 font-black text-4xl sm:text-6xl drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                                WIN! {formatNumber(lastWin)}
                            </motion.div>
                        ) : (
                            <div key="ready" className="text-white/20 font-bold uppercase tracking-widest text-sm">Ready to Spin</div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative p-1 rounded-[40px] bg-gradient-to-b from-yellow-600 to-yellow-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_10px_#1a1a20] border-4 border-yellow-400/50">
                    <div className="bg-[#1a1a20] rounded-[36px] overflow-hidden border-[6px] border-[#0F0F13] relative shadow-inner">
                        <div className="grid grid-cols-5 gap-[2px] bg-black p-[2px]">
                            {[0, 1, 2, 3, 4].map(col => {
                                const syms = [grid[col], grid[col + 5], grid[col + 10]];
                                const isSpinning = spinningReels[col];
                                return (
                                    <div key={col} className="bg-[#24242e] h-64 sm:h-80 w-16 sm:w-24 relative overflow-hidden">
                                        <AnimatePresence>
                                            {isSpinning && (
                                                <motion.div
                                                    initial={{ y: 0 }}
                                                    animate={{ y: "-50%" }}
                                                    transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                                                    className="absolute inset-0 flex flex-col items-center opacity-70 blur-[1px]"
                                                >
                                                    {/* Double the list for seamless loop */}
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((sId, i) => (
                                                        <div key={i} className="h-1/3 w-full flex items-center justify-center">
                                                            <SymbolIcon id={sId as any} className="text-3xl sm:text-5xl opacity-40 grayscale" />
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className={cn("absolute inset-0 flex flex-col", isSpinning ? "opacity-0" : "opacity-100 transition-opacity duration-200")}>
                                            {syms.map((sId, r) => (
                                                <div key={r} className="flex-1 flex items-center justify-center border-b border-white/5 last:border-0 relative">
                                                    <SymbolIcon id={sId} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                            <span>Bet Amount</span>
                            <span>{formatNumber(bet)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                            <button onClick={() => setBet(Math.max(1000, bet - 10000))} className="p-3 hover:bg-white/10 rounded-lg transition-colors"><Minus size={16} /></button>
                            <input
                                type="text"
                                value={betInput}
                                onChange={handleBetChange}
                                onBlur={() => setBetInput(bet.toString())}
                                className="flex-1 bg-transparent text-center font-black text-xl text-yellow-400 outline-none w-20"
                            />
                            <button onClick={() => setBet(bet + 10000)} className="p-3 hover:bg-white/10 rounded-lg transition-colors"><Plus size={16} /></button>
                        </div>
                        <div className="flex justify-between gap-2 mt-2">
                            {[1000, 20000, 50000, 100000, 500000].map(val => (
                                <button key={val} onClick={() => setBet(val)} className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] sm:text-xs font-bold transition-colors">{formatNumber(val)}</button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                onClick={() => setBet(prev => prev + 500000)}
                                className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-black text-emerald-400 transition-all border border-emerald-500/10 flex items-center justify-center gap-2"
                            >
                                <Plus size={12} /> 500K
                            </button>
                            <button
                                onClick={() => setBet(prev => prev + 1000000)}
                                className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[10px] font-black text-amber-400 transition-all border border-amber-500/10 flex items-center justify-center gap-2"
                            >
                                <Plus size={12} /> 1JT
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={spinReels}
                        disabled={isGameActive || wallet < bet}
                        className="w-full sm:w-auto px-10 py-6 sm:h-32 rounded-2xl bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] disabled:opacity-50 disabled:grayscale group relative overflow-hidden shrink-0"
                    >
                        <div className="flex flex-col items-center gap-1 relative z-10 text-black">
                            <RotateCw size={32} className={cn(isGameActive && "animate-spin")} />
                            <span className="font-black italic text-2xl tracking-tighter">SPIN</span>
                        </div>
                    </button>

                    {/* Crazy Mode Toggle */}
                    <button
                        disabled={isGameActive}
                        onClick={() => setIsCrazy(!isCrazy)}
                        className={cn(
                            "w-full sm:w-48 p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden",
                            isCrazy ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-white/10 bg-white/5 opacity-50 grayscale",
                            isGameActive && "cursor-not-allowed"
                        )}
                    >
                        <Zap size={24} className={cn(isCrazy ? "text-red-500 fill-red-500 animate-pulse" : "text-white/40")} />
                        <span className="font-black text-[10px] uppercase tracking-widest text-center leading-none">
                            {isCrazy ? "CRAZY MODE ON" : "CRAZY MODE"}
                        </span>
                        <span className="text-[7px] font-bold text-muted-foreground uppercase text-center mt-1">
                            {isCrazy ? "LOW SYMBOLS = BIG WIN!" : "STANDARD PAYOUTS"}
                        </span>
                    </button>
                </div>
            </main>
        </div>
    );
}
