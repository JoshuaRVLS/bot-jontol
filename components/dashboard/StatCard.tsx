"use client";

import { motion } from "framer-motion";
import { LucideIcon, Users, Award, MessagesSquare, Clock, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, LucideIcon> = {
    "users": Users,
    "award": Award,
    "messages": MessagesSquare,
    "clock": Clock,
    "shield": ShieldCheck,
    "activity": Activity
};

interface StatCardProps {
    label: string;
    value: string;
    iconName: string;
    color: string;
    index: number;
}

export const StatCard = ({ label, value, iconName, color, index }: StatCardProps) => {
    const Icon = IconMap[iconName] || Activity;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -2 : 2 }}
            animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
            whileHover={{
                scale: 1.05,
                rotate: 0,
                boxShadow: "0 0 30px rgba(239, 68, 68, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card p-6 rounded-[32px] group relative overflow-hidden border-white/5 hover:border-red-500/30 transition-colors"
        >
            {/* Background Glow */}
            <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full",
                color.includes("blue") && "bg-blue-500",
                color.includes("amber") && "bg-amber-500",
                color.includes("emerald") && "bg-emerald-500",
                color.includes("purple") && "bg-purple-500",
                color.includes("red") && "bg-red-500",
            )} />

            <div className={cn(
                "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:rotate-12",
                color
            )}>
                <Icon size={24} />
            </div>

            <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mb-1 opacity-70">
                    {label}
                </p>
                <h4 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                    {value}
                </h4>
            </div>

            {/* Chaotic Corner Element */}
            <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
        </motion.div>
    );
};
