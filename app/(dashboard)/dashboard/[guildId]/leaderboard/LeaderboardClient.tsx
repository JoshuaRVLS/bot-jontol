"use client";

import { useState, useEffect } from "react";
import { Trophy, Wallet, TrendingUp, Swords, Crown, Medal, User as UserIcon, Loader2 } from "lucide-react";
import { getWealthLeaderboard, getLevelLeaderboard, getBattleLeaderboard, LeaderboardEntry } from "@/app/actions/leaderboard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Category = "wealth" | "level" | "battle";

export default function LeaderboardClient() {
    const [category, setCategory] = useState<Category>("wealth");
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { id: "wealth", label: "Sultan", icon: Wallet, description: "Kekayaan Bank + Wallet" },
        { id: "level", label: "Grinder", icon: TrendingUp, description: "Level & XP Terbesar" },
        { id: "battle", label: "Battle King", icon: Swords, description: "Kemenangan Duel Terbanyak" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let results: LeaderboardEntry[] = [];
            if (category === "wealth") results = await getWealthLeaderboard();
            else if (category === "level") results = await getLevelLeaderboard();
            else if (category === "battle") results = await getBattleLeaderboard();
            setData(results);
            setIsLoading(false);
        };
        fetchData();
    }, [category]);

    const formatValue = (val: number, cat: Category) => {
        if (cat === "wealth") return `Rp ${val.toLocaleString()}`;
        if (cat === "level") return `LVL ${val}`;
        if (cat === "battle") return `${val} Wins`;
        return val.toString();
    };

    const podium = data.slice(0, 3);
    const rest = data.slice(3);

    // Reorder podium for display: [2, 1, 3]
    const displayPodium = [];
    if (podium[1]) displayPodium.push({ ...podium[1], rank: 2 });
    if (podium[0]) displayPodium.push({ ...podium[0], rank: 1 });
    if (podium[2]) displayPodium.push({ ...podium[2], rank: 3 });

    return (
        <div className="space-y-8 sm:space-y-12 pb-20">
            {/* Category Selector */}
            <div className="flex bg-white/5 p-1.5 sm:p-2 rounded-[24px] sm:rounded-[32px] w-full sm:w-fit mx-auto border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id as Category)}
                        className={cn(
                            "group flex flex-1 sm:flex-none items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-[18px] sm:rounded-[24px] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden whitespace-nowrap",
                            category === cat.id
                                ? "bg-primary text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)] scale-105"
                                : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <cat.icon size={16} className={cn("transition-transform shrink-0", category === cat.id && "animate-pulse")} />
                        <span className="relative z-10">{cat.label}</span>
                        {category === cat.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-40 space-y-4"
                    >
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Menghitung Peringkat...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8 sm:space-y-12"
                    >
                        {/* Podium Section */}
                        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-10 sm:gap-4 md:gap-8 px-4 pt-10">
                            {displayPodium.map((user) => {
                                const isFirst = user.rank === 1;
                                const isSecond = user.rank === 2;
                                return (
                                    <div
                                        key={user.id}
                                        className={cn(
                                            "flex flex-col items-center relative group w-full sm:w-auto",
                                            isFirst ? "z-20 sm:order-2 scale-110 sm:scale-100" : isSecond ? "sm:order-1" : "sm:order-3"
                                        )}
                                    >
                                        <div className="relative mb-4 sm:mb-6">
                                            <div className={cn(
                                                "w-28 h-28 md:w-32 md:h-32 rounded-full p-1 relative z-10",
                                                isFirst ? "bg-gradient-to-t from-yellow-500 to-yellow-200" :
                                                    isSecond ? "bg-gradient-to-t from-slate-400 to-slate-200" :
                                                        "bg-gradient-to-t from-amber-700 to-amber-500"
                                            )}>
                                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name || ""} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon size={40} className="text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Rank Badge */}
                                            <div className={cn(
                                                "absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black z-20 shadow-xl text-sm sm:text-base",
                                                isFirst ? "bg-yellow-500 text-black scale-110" :
                                                    isSecond ? "bg-slate-300 text-black" :
                                                        "bg-amber-600 text-white"
                                            )}>
                                                {user.rank}
                                            </div>
                                            {isFirst && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                                                    <Crown size={32} className="sm:w-10 sm:h-10" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h4 className="font-black uppercase italic tracking-tighter text-base sm:text-lg truncate max-w-[150px]">{user.name || "Unknown"}</h4>
                                            <p className={cn(
                                                "text-[10px] sm:text-xs font-bold uppercase tracking-widest",
                                                isFirst ? "text-yellow-500" : "text-muted-foreground"
                                            )}>
                                                {formatValue(user.value, category)}
                                            </p>
                                        </div>

                                        {/* Podium Base */}
                                        <div className={cn(
                                            "w-32 sm:w-32 md:w-44 mt-4 sm:mt-6 bg-gradient-to-b border-t-2 transition-all",
                                            isFirst
                                                ? "h-16 sm:h-32 bg-yellow-500/10 border-yellow-500/50 rounded-t-[40px]"
                                                : isSecond
                                                    ? "h-12 sm:h-24 bg-slate-400/10 border-slate-400/50 rounded-t-[32px]"
                                                    : "h-8 sm:h-20 bg-amber-700/10 border-amber-700/50 rounded-t-[24px]"
                                        )} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Rest of the rankings */}
                        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 px-2 sm:px-4">
                            {rest.map((user, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={user.id}
                                    className="glass-card p-3 sm:p-5 rounded-[18px] sm:rounded-[24px] border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all hover:translate-x-2"
                                >
                                    <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
                                        <span className="w-6 sm:w-8 text-center text-xs sm:text-base font-black italic text-muted-foreground group-hover:text-primary transition-colors">
                                            #{idx + 4}
                                        </span>
                                        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon size={18} className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h5 className="font-black uppercase italic tracking-tight text-sm sm:text-base truncate">{user.name || "Anonymous"}</h5>
                                                <p className="text-[8px] sm:text-[10px] font-mono opacity-20 sm:opacity-30 group-hover:opacity-60 transition-opacity truncate">{user.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="font-black text-white text-xs sm:text-base">{formatValue(user.value, category)}</p>
                                        {user.subValue !== undefined && (
                                            <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase">{user.subValue.toLocaleString()} XP</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {data.length === 0 && (
                                <div className="text-center py-20 opacity-30 grayscale">
                                    <Trophy size={64} className="mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em]">Belum ada data peringkat bang</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
