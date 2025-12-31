"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandCenterHeaderProps {
    botOnline: boolean;
}

export const CommandCenterHeader = ({ botOnline }: CommandCenterHeaderProps) => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            {/* Decorative chaotic lines */}
            <div className="absolute -top-10 -left-10 w-40 h-1 bg-gradient-to-r from-red-500/50 to-transparent -rotate-45 blur-sm" />

            <div className="relative">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-4"
                >
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic flex items-center gap-4 text-white">
                        <div className="p-3 bg-red-500 rounded-2xl rotate-3 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        COMMAND CENTER
                    </h2>
                </motion.div>
                <p className="text-muted-foreground mt-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] opacity-40 ml-1">
                    System monitoring & economy control
                </p>
            </div>

            <div className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-[32px] border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                botOnline
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
            )}>
                <Activity size={16} className={cn(botOnline && "animate-pulse")} />
                {botOnline ? "BOT ONLINE" : "BOT OFFLINE"}
            </div>
        </header>
    );
};
