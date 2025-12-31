"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Zap, TrendingUp, MousePointer2, Sparkles, Crown, Flame, Star, Gift } from "lucide-react";
import { processClick } from "@/app/actions/clicker";
import { formatRupiah, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface FloatingNumber {
    id: string;
    value: number;
    x: number;
    y: number;
    isCrit: boolean;
    isJackpot: boolean;
}

interface ClickerClientProps {
    guildId: string;
    initialWallet: number;
}

const MILESTONES = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

export default function ClickerClient({ guildId, initialWallet }: ClickerClientProps) {
    const [wallet, setWallet] = useState(initialWallet);
    const [totalClicks, setTotalClicks] = useState(0);
    const [sessionEarnings, setSessionEarnings] = useState(0);
    const [clicksPerSecond, setClicksPerSecond] = useState(0);
    const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
    const [isClicking, setIsClicking] = useState(false);
    const [combo, setCombo] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [critStreak, setCritStreak] = useState(0);
    const [showJackpot, setShowJackpot] = useState(false);
    const [jackpotAmount, setJackpotAmount] = useState(0);
    const [feverMode, setFeverMode] = useState(false);
    const [feverProgress, setFeverProgress] = useState(0);
    const [milestone, setMilestone] = useState<number | null>(null);
    const [particles, setParticles] = useState<{ id: string, x: number, y: number, targetX: number, targetY: number }[]>([]);
    const [clickRotation, setClickRotation] = useState(0);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const clickTimestamps = useRef<number[]>([]);
    const comboTimeout = useRef<NodeJS.Timeout | null>(null);
    const idCounter = useRef(0);

    const generateId = () => {
        idCounter.current += 1;
        return `${Date.now()}-${idCounter.current}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 1000);
            setClicksPerSecond(clickTimestamps.current.length);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (combo >= 100) { setMultiplier(5); setFeverMode(true); }
        else if (combo >= 50) setMultiplier(3);
        else if (combo >= 25) setMultiplier(2);
        else if (combo >= 10) setMultiplier(1.5);
        else { setMultiplier(1); setFeverMode(false); }

        setFeverProgress(Math.min(combo / 100, 1) * 100);
    }, [combo]);

    useEffect(() => {
        const nextMilestone = MILESTONES.find(m => sessionEarnings >= m && sessionEarnings < m * 1.1);
        if (nextMilestone && milestone !== nextMilestone) {
            setMilestone(nextMilestone);
            setTimeout(() => setMilestone(null), 3000);
        }
    }, [sessionEarnings, milestone]);

    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 50);

        clickTimestamps.current.push(Date.now());

        if (comboTimeout.current) clearTimeout(comboTimeout.current);
        setCombo(prev => prev + 1);
        comboTimeout.current = setTimeout(() => { setCombo(0); setCritStreak(0); }, 800);

        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        for (let i = 0; i < 3; i++) {
            const particleId = generateId();
            setParticles(prev => [...prev, {
                id: particleId,
                x: e.clientX - rect.left + (Math.random() - 0.5) * 50,
                y: e.clientY - rect.top,
                targetX: (Math.random() - 0.5) * 100,
                targetY: -80 + Math.random() * 40
            }]);
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== particleId));
            }, 500);
        }

        setClickRotation(Math.random() * 10 - 5);

        const result = await processClick(multiplier);

        if (result.success && result.earned) {
            const isCrit = result.isCrit || false;
            const isJackpot = result.isJackpot || false;
            const finalEarned = result.earned;

            if (isJackpot && result.jackpotAmount) {
                setJackpotAmount(result.jackpotAmount);
                setShowJackpot(true);
                setTimeout(() => setShowJackpot(false), 2000);
            }

            if (isCrit) {
                setCritStreak(prev => prev + 1);
            } else {
                setCritStreak(0);
            }

            setWallet(result.newWallet || wallet + finalEarned);
            setTotalClicks(prev => prev + 1);
            setSessionEarnings(prev => prev + finalEarned);

            const floatId = generateId();
            const randomX = (Math.random() - 0.5) * 80;
            setFloatingNumbers(prev => [...prev, {
                id: floatId,
                value: finalEarned,
                x: e.clientX - rect.left + randomX,
                y: e.clientY - rect.top - 20,
                isCrit,
                isJackpot,
            }]);

            setTimeout(() => {
                setFloatingNumbers(prev => prev.filter(n => n.id !== floatId));
            }, 800);
        }
    }, [multiplier, wallet]);

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 pt-32 pb-20 ${feverMode ? "bg-gradient-to-b from-orange-950/30 to-transparent" : ""}`}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse transition-colors duration-500 ${feverMode ? "bg-orange-500/40" : "bg-primary/20"}`} />
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse delay-1000 transition-colors duration-500 ${feverMode ? "bg-red-500/40" : "bg-amber-500/20"}`} />
            </div>

            {/* Jackpot Overlay */}
            <AnimatePresence>
                {showJackpot && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                            >
                                <Gift size={80} className="mx-auto text-amber-400 mb-4" />
                            </motion.div>
                            <p className="text-5xl font-black text-amber-400 mb-2">🎰 JACKPOT! 🎰</p>
                            <p className="text-3xl font-bold text-white">+{formatRupiah(jackpotAmount)}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Milestone Toast */}
            <AnimatePresence>
                {milestone && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 rounded-2xl shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <Crown size={24} className="text-white" />
                            <div>
                                <p className="text-white font-black">MILESTONE TERCAPAI!</p>
                                <p className="text-white/80 text-sm">Dapatkan {formatRupiah(milestone)}!</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-20">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ rotate: -2 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="glass-card p-4 rounded-3xl border-red-500/20 bg-red-500/5 text-center shadow-xl hover:border-red-500/50"
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Coins size={14} className="text-amber-400 animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wallet</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-black text-amber-400 italic tracking-tighter">{formatRupiah(wallet)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ rotate: 1 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="glass-card p-4 rounded-3xl border-white/5 bg-white/5 text-center shadow-xl hover:border-white/20"
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <MousePointer2 size={14} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Klik</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-black italic tracking-tighter">{formatNumber(totalClicks)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ rotate: -1 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="glass-card p-4 rounded-3xl border-emerald-500/20 bg-emerald-500/5 text-center shadow-xl hover:border-emerald-500/50"
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <TrendingUp size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hasil Kerja</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-black text-emerald-400 italic tracking-tighter">+{formatRupiah(sessionEarnings)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ rotate: 2 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        className="glass-card p-4 rounded-3xl border-purple-500/20 bg-purple-500/5 text-center shadow-xl hover:border-purple-500/50"
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Zap size={14} className="text-purple-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Speed</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-black text-purple-400 italic tracking-tighter">{clicksPerSecond} G/S</p>
                    </motion.div>
                </div>
            </div>

            {/* Main Click Area */}
            <div className="relative z-10 flex flex-col items-center mt-16 sm:mt-0">
                {/* Fever Progress Bar */}
                <div className="w-64 sm:w-80 mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Flame size={10} className={feverMode ? "text-orange-400 animate-pulse" : ""} />
                            GILA KERJA (FEVER)
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">{combo}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full transition-colors duration-300 ${feverMode ? "bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse" : "bg-gradient-to-r from-amber-400 to-orange-500"}`}
                            animate={{ width: `${feverProgress}%` }}
                            transition={{ type: "spring", stiffness: 100 }}
                        />
                    </div>
                </div>

                {/* Combo & Multiplier */}
                <AnimatePresence>
                    {combo > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-4 text-center"
                        >
                            <p className={`text-3xl sm:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r ${feverMode ? "from-orange-400 via-red-500 to-yellow-400 animate-pulse" : "from-amber-400 via-orange-500 to-red-500"}`}>
                                {combo}x GEPLAKAN!
                            </p>
                            {multiplier > 1 && (
                                <motion.p
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.3, repeat: Infinity }}
                                    className="text-base font-bold text-amber-400 flex items-center justify-center gap-2 mt-1"
                                >
                                    <Sparkles size={14} />
                                    {multiplier}x MULTIPLIER
                                    <Sparkles size={14} />
                                </motion.p>
                            )}
                            {critStreak >= 3 && (
                                <p className="text-xs text-red-400 font-bold mt-1 flex items-center justify-center gap-1">
                                    <Star size={12} className="animate-spin" />
                                    {critStreak}x CRIT STREAK!
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Click Button */}
                <div className="relative">
                    <motion.button
                        ref={buttonRef}
                        onClick={handleClick}
                        animate={{
                            scale: isClicking ? 0.9 : 1,
                            rotate: isClicking ? clickRotation : 0,
                            boxShadow: feverMode
                                ? "0 0 100px rgba(249, 115, 22, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)"
                                : "0 30px 60px -12px rgba(249, 115, 22, 0.4)",
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 600, damping: 10 }}
                        className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-[60px] bg-gradient-to-br shadow-2xl flex items-center justify-center cursor-pointer select-none transition-all ${feverMode
                            ? "from-red-500 via-orange-500 to-yellow-500 animate-[bounce_0.5s_infinite]"
                            : "from-amber-400 via-orange-500 to-red-500"
                            }`}
                        aria-label="Click to earn money"
                        tabIndex={0}
                    >
                        <div className={`absolute inset-3 rounded-[50px] bg-gradient-to-br flex items-center justify-center ${feverMode
                            ? "from-red-400 via-orange-400 to-yellow-300"
                            : "from-amber-300 via-orange-400 to-red-400"
                            }`}>
                            <div className="text-center relative">
                                <Coins size={50} className={cn("mx-auto mb-2 text-white drop-shadow-2xl sm:w-16 sm:h-16", feverMode && "animate-spin")} />
                                <p className="text-white font-black text-2xl sm:text-3xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] italic uppercase tracking-tighter">
                                    {feverMode ? "FEVER!" : "CLICK!"}
                                </p>
                            </div>
                        </div>

                        <motion.div
                            animate={{
                                scale: isClicking ? [1, 1.3, 1] : 1,
                                opacity: isClicking ? [0.6, 0] : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 rounded-full border-4 border-white/60"
                        />
                    </motion.button>

                    {/* Particles */}
                    <AnimatePresence>
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                animate={{
                                    opacity: 0,
                                    scale: 0,
                                    y: p.targetY,
                                    x: p.targetX,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute w-2 h-2 rounded-full bg-amber-400"
                                style={{ left: p.x, top: p.y }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Floating Numbers */}
                    <AnimatePresence>
                        {floatingNumbers.map((float) => (
                            <motion.div
                                key={float.id}
                                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                animate={{ opacity: 0, y: -80, scale: float.isJackpot ? 1.5 : float.isCrit ? 1.3 : 1.1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`absolute pointer-events-none font-black text-lg sm:text-xl drop-shadow-lg ${float.isJackpot
                                    ? "text-amber-300 text-2xl"
                                    : float.isCrit
                                        ? "text-red-400"
                                        : "text-emerald-400"
                                    }`}
                                style={{ left: float.x, top: float.y }}
                            >
                                {float.isCrit && "💥 "}
                                +{formatRupiah(float.value, false)}
                                {float.isCrit && " CRIT!"}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Instructions */}
                <p className="mt-6 text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest text-center max-w-xs opacity-50">
                    Klik terus untuk mengumpulkan Rp! 🔥 Peluang CRIT (2x) 15%, JACKPOT 0.5%! 🎰
                </p>

                {/* Multiplier Tiers */}
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    {[
                        { combo: 10, mult: "1.5x", color: "amber" },
                        { combo: 25, mult: "2x", color: "orange" },
                        { combo: 50, mult: "3x", color: "red" },
                        { combo: 100, mult: "5x FEVER!", color: "rose" },
                    ].map((tier) => (
                        <div
                            key={tier.combo}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${combo >= tier.combo
                                ? `bg-${tier.color}-500/30 text-${tier.color}-400 scale-105`
                                : "bg-white/5 text-muted-foreground"
                                }`}
                        >
                            {tier.combo}+ = {tier.mult}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
