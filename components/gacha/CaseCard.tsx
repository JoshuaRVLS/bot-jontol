"use client";

import { useSession } from "next-auth/react";
import { CaseConfig } from "@/lib/csgo";
import { useState } from "react";
import GachaModal from "@/components/gacha/GachaModal";
import { Zap, ShoppingCart } from "lucide-react";

interface CaseCardProps {
    config: CaseConfig;
    guildId: string;
}

const CaseCard = ({ config, guildId }: CaseCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const colors: Record<string, string> = {
        budget: "from-slate-500 to-slate-800 border-slate-500/20 shadow-slate-500/10",
        classic: "from-blue-500 to-blue-900 border-blue-500/20 shadow-blue-500/10",
        highroller: "from-purple-500 to-purple-900 border-purple-500/30 shadow-purple-500/10",
        elite: "from-red-600 to-red-950 border-red-500/40 shadow-red-500/20",
        sultan: "from-amber-400 to-amber-900 border-amber-400/50 shadow-amber-400/30",
    };

    const gradientClass = colors[config.id] || colors.classic;

    return (
        <>
            <div className="glass-card group p-1 rounded-[32px] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 relative overflow-hidden flex flex-col h-full border-white/5 hover:border-white/10 shadow-2xl">
                <div className={`h-48 rounded-[28px] bg-gradient-to-br ${gradientClass} flex items-center justify-center p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Animated background rings */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>

                    <Zap className="absolute top-4 right-4 text-white/10 group-hover:text-white/30 transition-colors" size={20} />

                    <div className="relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-700 ease-out">
                        <div className="w-24 h-24 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-inner">
                            <Zap size={48} className="text-white fill-white/10" />
                        </div>
                    </div>

                    {/* Cost Badge */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-widest text-white uppercase group-hover:bg-white group-hover:text-black transition-all">
                            Rp {config.cost.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-black text-xl tracking-tighter leading-none uppercase italic group-hover:text-primary transition-colors">{config.name}</h3>
                        <p className="text-[11px] font-medium text-muted-foreground mt-2 line-clamp-2 italic opacity-60 leading-relaxed">
                            {config.description}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-auto w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/5 to-primary/0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Buka Case
                    </button>
                </div>
            </div>

            <GachaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                config={config}
                guildId={guildId}
            />
        </>
    );
};

export default CaseCard;
