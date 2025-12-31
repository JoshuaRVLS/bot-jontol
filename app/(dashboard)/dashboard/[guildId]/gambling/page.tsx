import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    Zap,
    Swords,
    Coins,
    Dices,
    Keyboard,
    Gamepad2,
    TrendingUp,
    Wallet,
    ArrowRight,
    Trophy
} from "lucide-react";
import Link from "next/link";

export default async function GamblingPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const userData = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-bold">Data pengguna tidak ditemukan.</p>
            </div>
        );
    }

    const games = [
        {
            title: "Gacha Center",
            description: "Buka case skin CS:GO terkeren dengan jaminan Pity.",
            icon: Zap,
            href: `/dashboard/${guildId}/gacha`,
            color: "from-amber-400 to-orange-600",
            shadow: "shadow-orange-500/20",
            badge: "HOT"
        },
        {
            title: "Gacha Battle",
            description: "Duel buka case lawan player lain. Pemenang ambil semua!",
            icon: Swords,
            href: `/dashboard/${guildId}/battle`,
            color: "from-red-500 to-rose-700",
            shadow: "shadow-red-500/20",
            badge: "DUEL"
        },
        {
            title: "Blackjack",
            description: "Lawan Dealer dan menangin taruhan lo di meja kartu.",
            icon: Coins,
            href: `/dashboard/${guildId}/blackjack`,
            color: "from-emerald-400 to-teal-700",
            shadow: "shadow-emerald-500/20",
        },
        {
            title: "Slots Machine",
            description: "Putar slot-nya dan cari Jackpot Gacor hari ini.",
            icon: Dices,
            href: `/dashboard/${guildId}/slots`,
            color: "from-indigo-500 to-blue-700",
            shadow: "shadow-indigo-500/20",
        },
        {
            title: "Typing Race",
            description: "Adu cepat ketik lawan kawan-kawan. Jari lo lincah?",
            icon: Keyboard,
            href: `/dashboard/${guildId}/typing`,
            color: "from-purple-500 to-violet-800",
            shadow: "shadow-purple-500/20",
            badge: "MULTIPLAYER"
        },
        {
            title: "Suit Multiplayer",
            description: "Game klasik Gunting Batu Kertas lawan player lain.",
            icon: Gamepad2,
            href: `/dashboard/${guildId}/suit`,
            color: "from-slate-500 to-slate-800",
            shadow: "shadow-slate-500/20",
        }
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header section with stats */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative p-10 rounded-[60px] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Gamepad2 size={24} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                            GAMBLING <span className="text-red-500">CENTER</span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-xs opacity-40 border-l-2 border-red-500 pl-4 py-1">
                        Pusat hiburan dan adu nasib Habitat Jontol
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 relative z-10">
                    <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                        <Wallet className="text-emerald-400" size={24} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DOMPET</p>
                            <p className="text-xl font-black text-white">Rp {userData.wallet.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                        <Trophy className="text-amber-400" size={24} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SC PITY</p>
                            <p className="text-xl font-black text-white">{userData.scPity}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {games.map((game, i) => (
                    <Link
                        key={game.href}
                        href={game.href}
                        className="group relative"
                    >
                        <div className={`glass-card h-full p-8 rounded-[48px] border-white/5 group-hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden flex flex-col shadow-2xl ${game.shadow}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all" />

                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <game.icon size={32} className="text-white drop-shadow-md" />
                                </div>
                                {game.badge && (
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${game.badge === 'HOT' ? 'bg-orange-500 text-white shadow-orange-500/20' :
                                            game.badge === 'DUEL' ? 'bg-red-500 text-white shadow-red-500/20' :
                                                'bg-purple-500 text-white shadow-purple-500/20'
                                        }`}>
                                        {game.badge}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors text-white">
                                    {game.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {game.description}
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest group-hover:text-white transition-colors">
                                MAIN SEKARANG
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Secondary CTA or Info */}
            <div className="glass-card p-10 rounded-[50px] bg-gradient-to-r from-red-500/10 to-indigo-500/10 border-white/5 flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all hover:bg-white/[0.05]">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                    <TrendingUp size={40} className="text-red-500" />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black uppercase italic text-white tracking-widest">SIAP JADI SULTAN HARI INI?</h3>
                    <p className="text-muted-foreground text-sm font-medium">Setiap kemenangan bakal langsung masuk ke dalam dompet global bot abang.</p>
                </div>
                <Link
                    href={`/dashboard/${guildId}/leaderboard`}
                    className="px-10 py-5 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-white/10"
                >
                    LIHAT LEADERBOARD
                </Link>
            </div>
        </div>
    );
}
