"use client";

import { motion } from "framer-motion";

interface LevelProgressViewProps {
    userLevel: number;
    userXp: number;
    nextLevelXp: number;
    xpProgress: number;
}

export const LevelProgressView = ({ userLevel, userXp, nextLevelXp, xpProgress }: LevelProgressViewProps) => {
    return (
        <div className="lg:col-span-2 glass-card p-10 rounded-[48px] border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">LEVEL PROGRESS</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Kumpulkan XP untuk naik kasta</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-primary italic">LVL {userLevel}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Pangkat Saat Ini</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Progress Ke Level {userLevel + 1}</span>
                    <span className="text-primary">{userXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
                </div>

                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_2s_infinite]" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">XP Kurang</p>
                        <p className="text-sm font-black text-white italic">{(nextLevelXp - userXp).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Efisiensi</p>
                        <p className="text-sm font-black text-emerald-400 italic">100%</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Buff Aktif</p>
                        <p className="text-sm font-black text-amber-400 italic">None</p>
                    </div>
                </div>

                {/* Troll Withdraw Button */}
                <button
                    onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1", "_blank")}
                    className="w-full mt-6 py-5 rounded-[24px] bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-black uppercase tracking-[0.15em] shadow-[0_20px_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(16,185,129,0.5)] transition-all active:scale-95 relative overflow-hidden group"
                    aria-label="Withdraw funds"
                    tabIndex={0}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        💰 WITHDRAW KE REKENING
                    </span>
                </button>
            </div>
        </div>
    );
};
