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
    Wallet,
    ArrowRight,
    Trophy,
    Sparkles
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
            <div className="flex flex-col items-center justify-center py-20 casino-card rounded-3xl">
                <p className="text-gray-400 font-bold">Data pengguna tidak ditemukan.</p>
            </div>
        );
    }

    const games = [
        {
            title: "Gacha Center",
            description: "Buka case CS:GO dengan sistem pity terjamin.",
            icon: Zap,
            href: `/dashboard/${guildId}/gacha`,
            gradient: "from-amber-400 to-orange-600",
            glow: "shadow-amber-500/20"
        },
        {
            title: "Gacha Battle",
            description: "Duel buka case melawan player lain.",
            icon: Swords,
            href: `/dashboard/${guildId}/battle`,
            gradient: "from-red-500 to-rose-700",
            glow: "shadow-red-500/20",
            badge: "PVP"
        },
        {
            title: "Blackjack",
            description: "Main kartu melawan dealer.",
            icon: Coins,
            href: `/dashboard/${guildId}/blackjack`,
            gradient: "from-emerald-400 to-teal-600",
            glow: "shadow-emerald-500/20"
        },
        {
            title: "Slots Machine",
            description: "Putar mesin slot dan coba keberuntungan.",
            icon: Dices,
            href: `/dashboard/${guildId}/slots`,
            gradient: "from-purple-500 to-violet-700",
            glow: "shadow-purple-500/20"
        },
        {
            title: "Typing Race",
            description: "Lomba ketik cepat melawan pemain lain.",
            icon: Keyboard,
            href: `/dashboard/${guildId}/typing`,
            gradient: "from-blue-500 to-indigo-700",
            glow: "shadow-blue-500/20",
            badge: "MULTIPLAYER"
        },
        {
            title: "Suit",
            description: "Gunting Batu Kertas multiplayer.",
            icon: Gamepad2,
            href: `/dashboard/${guildId}/suit`,
            gradient: "from-slate-400 to-slate-600",
            glow: "shadow-slate-500/20"
        }
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <header className="relative p-8 md:p-12 rounded-[40px] casino-card overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 blur-[80px] rounded-full" />

                {/* Card Symbols Decoration */}
                <div className="absolute top-4 right-8 text-amber-500/10 text-6xl hidden md:block">♠</div>
                <div className="absolute bottom-4 right-20 text-red-500/10 text-4xl hidden md:block">♦</div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <Dices size={28} className="text-black" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Premium</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                                    Casino
                                </h1>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium max-w-md">
                            Pilih game favorit dan mulai bermain
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/40 border border-amber-500/20">
                            <Wallet className="text-amber-400" size={24} />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Wallet</p>
                                <p className="text-xl font-black text-white">Rp {userData.wallet.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-black/40 border border-amber-500/20">
                            <Trophy className="text-amber-400" size={24} />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pity</p>
                                <p className="text-xl font-black text-white">{userData.scPity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {games.map((game) => (
                    <Link
                        key={game.href}
                        href={game.href}
                        className="group"
                    >
                        <div className={`casino-card h-full p-8 rounded-3xl group-hover:border-amber-500/30 transition-all duration-300 group-hover:-translate-y-1 flex flex-col ${game.glow}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <game.icon size={28} className="text-white" />
                                </div>
                                {game.badge && (
                                    <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        {game.badge}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors mb-2">
                                    {game.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {game.description}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-gray-600 text-xs font-bold uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                                Main Sekarang
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Leaderboard CTA */}
            <div className="casino-card p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <Trophy size={36} className="text-amber-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black uppercase text-white mb-2">Leaderboard</h3>
                    <p className="text-gray-500 text-sm">Lihat peringkat dan statistik pemain.</p>
                </div>
                <Link
                    href={`/dashboard/${guildId}/leaderboard`}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-wider text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                >
                    Lihat Leaderboard
                </Link>
            </div>
        </div>
    );
}
