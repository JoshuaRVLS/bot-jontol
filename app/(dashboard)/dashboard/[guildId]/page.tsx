import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    Users,
    MessagesSquare,
    Award,
    Clock,
    ShieldCheck,
    Activity,
    TrendingUp,
    TrendingDown,
    Zap
} from "lucide-react";
import { getBotStats, getGuildLiveData } from "@/lib/bot";
import { cn } from "@/lib/utils";
import MarketRefresh from "@/components/MarketRefresh";
import { StatCard } from "@/components/dashboard/StatCard";
import { LevelProgressView } from "@/components/dashboard/LevelProgressView";
import { CommandCenterHeader } from "@/components/dashboard/CommandCenterHeader";

const formatUptime = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}h ${hours}j ${minutes}m`;
};

export default async function GuildOverview({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) redirect("/");

    // Fetch real stats from shared Prisma database
    const [totalUsers, economyStats, activeGiveaways, botStats, guildLive, latestWarnings, marketAssets, topPlayersRaw] = await Promise.all([
        prisma.user.count(),
        prisma.user.aggregate({
            _sum: {
                bank: true,
                wallet: true
            }
        }),
        prisma.giveaway.count({
            where: { guildId, ended: false }
        }),
        getBotStats(),
        getGuildLiveData(guildId),
        prisma.warning.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        }),
        prisma.marketAsset.findMany({
            take: 3,
            orderBy: { updatedAt: 'desc' }
        }),
        prisma.user.findMany({
            orderBy: { bank: 'desc' },
            take: 10
        }),
        prisma.user.findUnique({
            where: { id: session.user.id }
        })
    ]);

    const currentUserData = topPlayersRaw.find((u: any) => u.id === session.user.id) || await prisma.user.findUnique({ where: { id: session.user.id } });
    const userXp = currentUserData?.xp || 0;
    const userLevel = currentUserData?.level || 1;
    const nextLevelXp = userLevel * 1000;
    const xpProgress = (userXp / nextLevelXp) * 100;

    const topPlayers = topPlayersRaw
        .sort((a: any, b: any) => ((b.bank || 0) + (b.wallet || 0)) - ((a.bank || 0) + (a.wallet || 0)))
        .slice(0, 5);

    const stats = [
        {
            label: "TOTAL MEMBER",
            value: guildLive?.memberCount?.toString() || totalUsers.toLocaleString(),
            iconName: "users",
            color: "text-blue-400"
        },
        {
            label: "TOTAL BANK",
            value: `Rp ${((economyStats._sum.bank || 0) + (economyStats._sum.wallet || 0)).toLocaleString()}`,
            iconName: "award",
            color: "text-amber-400"
        },
        {
            label: "ACTIVE GIVEAWAY",
            value: activeGiveaways.toString(),
            iconName: "messages",
            color: "text-emerald-400"
        },
        {
            label: "BOT UPTIME",
            value: botStats ? formatUptime(botStats.uptime) : "Offline",
            iconName: "clock",
            color: botStats ? "text-purple-400" : "text-red-400"
        },
    ];

    return (
        <div className="space-y-10">
            <MarketRefresh />
            <CommandCenterHeader botOnline={!!botStats} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard
                        key={i}
                        index={i}
                        label={stat.label}
                        value={stat.value}
                        iconName={stat.iconName}
                        color={stat.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <LevelProgressView
                    userLevel={userLevel}
                    userXp={userXp}
                    nextLevelXp={nextLevelXp}
                    xpProgress={xpProgress}
                />

                <div className="space-y-8">
                    {/* Market Pulse */}
                    <div className="glass-card p-8 rounded-[40px] border-primary/20 bg-primary/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-primary">INFO PASAR</h3>
                            <TrendingUp size={24} className="text-primary animate-bounce" />
                        </div>
                        <div className="space-y-4">
                            {marketAssets.map((asset: any) => {
                                const isUp = asset.price >= asset.lastPrice;
                                const change = ((asset.price - asset.lastPrice) / asset.lastPrice * 100) || 0;
                                return (
                                    <div key={asset.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center bg-muted/50",
                                                isUp ? "text-emerald-400" : "text-red-400"
                                            )}>
                                                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black">{asset.id}</p>
                                                <p className="text-[10px] text-muted-foreground">Rp {asset.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "text-xs font-black font-mono",
                                            isUp ? "text-emerald-400" : "text-red-400"
                                        )}>
                                            {isUp ? "+" : ""}{change.toFixed(1)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="w-full mt-8 py-5 rounded-[24px] bg-primary text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-[1.02] hover:bg-primary/80 transition-all active:scale-95 relative overflow-hidden group font-black">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <span className="relative z-10">TERMINAL UTAMA</span>
                        </button>
                    </div>

                    {/* TOP PLAYERS Leaderboard */}
                    <div className="glass-card p-8 rounded-[40px] border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">KAYA RAYA LEADERBOARD</h3>
                            <Award size={24} className="text-amber-500 animate-pulse" />
                        </div>

                        <div className="space-y-4">
                            {topPlayers.map((player: any, idx: number) => (
                                <div
                                    key={player.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:translate-x-1",
                                        idx === 0 && "bg-amber-500/10 border-amber-500/30 scale-[1.02]"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs",
                                            idx === 0 ? "bg-amber-500 text-black" : "bg-white/10 text-white"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black truncate max-w-[120px]">{player.name || "Anonymous"}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                                                Level {player.level}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-amber-400">Rp {((player.bank || 0) + (player.wallet || 0)).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
