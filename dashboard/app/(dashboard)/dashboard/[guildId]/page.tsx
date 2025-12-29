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

const formatUptime = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}h ${hours}j ${minutes}m`;
};

export default async function GuildOverview({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    // Fetch real stats from shared Prisma database
    const [totalUsers, economyStats, activeGiveaways, botStats, guildLive, latestWarnings, marketAssets] = await Promise.all([
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
        })
    ]);

    const stats = [
        {
            label: "Server Members (Live)",
            value: guildLive?.memberCount?.toString() || totalUsers.toLocaleString(),
            icon: Users,
            color: "text-blue-400"
        },
        {
            label: "Total Currency (Global)",
            value: `Rp ${((economyStats._sum.bank || 0) + (economyStats._sum.wallet || 0)).toLocaleString()}`,
            icon: Award,
            color: "text-amber-400"
        },
        {
            label: "Active Giveaways",
            value: activeGiveaways.toString(),
            icon: MessagesSquare,
            color: "text-emerald-400"
        },
        {
            label: "Bot Uptime",
            value: botStats ? formatUptime(botStats.uptime) : "Offline",
            icon: Clock,
            color: botStats ? "text-purple-400" : "text-red-400"
        },
    ];

    return (
        <div className="space-y-10">
            <MarketRefresh />
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                        <ShieldCheck className="text-primary" />
                        Command Center
                    </h2>
                    <p className="text-muted-foreground mt-1 text-xs font-medium">Monitoring real-time JONTOL system & economy flow.</p>
                </div>

                <div className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-2xl border text-xs font-black transition-all",
                    botStats ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                    <Activity size={14} className={cn(botStats && "animate-pulse")} />
                    {botStats ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl group hover:border-primary/50 transition-all duration-500">
                        <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black font-mono tracking-tighter">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dynamic Activities */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl space-y-6 lg:min-h-[400px]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase italic tracking-tight">Recent Log Entries</h3>
                        <Activity size={20} className="text-muted-foreground/30" />
                    </div>

                    <div className="space-y-4">
                        {latestWarnings.length > 0 ? latestWarnings.map((warn: any) => (
                            <div key={warn.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                                    <Zap size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">User <span className="text-primary">{warn.userId}</span> flagged</p>
                                    <p className="text-xs text-muted-foreground truncate italic opacity-70">"{warn.reason}"</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-mono font-bold text-muted-foreground">{new Date(warn.createdAt).toLocaleTimeString()}</p>
                                    <p className="text-[10px] font-black uppercase text-red-500/50">Security</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-muted-foreground text-center py-20 flex flex-col items-center gap-4">
                                <Activity size={48} className="opacity-10" />
                                <p className="font-bold text-sm tracking-widest uppercase opacity-30">No critical events recorded</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Market Pulse */}
                    <div className="glass-card p-8 rounded-3xl border-primary/20 bg-primary/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black uppercase tracking-tight">Market Pulse</h3>
                            <TrendingUp size={18} className="text-primary" />
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
                        <button className="w-full mt-6 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-primary/80 transition-all">
                            Live Terminal
                        </button>
                    </div>

                    {/* System Health Status */}
                    <div className="glass-card p-8 rounded-3xl space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-tight">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold font-mono text-white">Engine Core</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase">NOMINAL</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-bold font-mono text-white">Economy API</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase">STABLE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
