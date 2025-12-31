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
        budget: "from-slate-500 via-slate-700 to-black border-slate-500/20 shadow-slate-500/10",
        classic: "from-blue-500 via-indigo-600 to-black border-blue-500/20 shadow-blue-500/10",
        highroller: "from-purple-500 via-pink-600 to-black border-purple-500/30 shadow-purple-500/10",
        elite: "from-red-600 via-rose-700 to-black border-red-500/40 shadow-red-500/20",
        sultan: "from-amber-400 via-orange-500 to-black border-amber-400/50 shadow-amber-400/30",
    };

    const gradientClass = colors[config.id] || colors.classic;

    return (
        <>
            <div
                style={{ rotate: `${(config.id.charCodeAt(0) % 4 - 2)}deg` }}
                className="glass-card group p-1 rounded-[48px] transition-all duration-500 hover:scale-[1.05] hover:rotate-0 relative overflow-hidden flex flex-col h-full border-white/5 hover:border-red-500/30 shadow-2xl"
            >
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
                        className="mt-auto w-full py-5 rounded-[28px] bg-red-500 text-white text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(239,68,68,0.3)] hover:bg-red-400 transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        <ShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        GASKEUN BANG!
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
