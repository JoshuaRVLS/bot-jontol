import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    Coins,
    Activity,
    Zap,
    BarChart3,
    History
} from "lucide-react";
import { StockChart } from "@/components/StockChart";
import { cn } from "@/lib/utils";
import MarketRefresh from "@/components/MarketRefresh";
import { MarketTicker } from "@/components/MarketTicker";

export default async function MarketPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const assets = await prisma.marketAsset.findMany({
        orderBy: { type: 'desc' }
    }) as any[];

    const tickerItems = assets.map(a => ({ id: a.id, price: a.price, lastPrice: a.lastPrice }));

    const totalVolume = assets.reduce((acc, curr) => acc + curr.price, 0);
    const topGainer = [...assets].sort((a, b) => {
        const changeA = ((a.price - a.lastPrice) / a.lastPrice) * 100 || 0;
        const changeB = ((b.price - b.lastPrice) / b.lastPrice) * 100 || 0;
        return changeB - changeA;
    })[0];

    return (
        <div className="space-y-8 pb-20">
            <MarketRefresh />

            <div className="-mx-8 mb-4">
                <MarketTicker items={tickerItems} />
            </div>

            {/* Pro Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/40 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <TrendingUp className="text-primary w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Trading Terminal</h2>
                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500 animate-pulse" />
                            Live Market Data & Pro Analysis
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Market State</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-sm font-mono font-bold text-emerald-400">OPEN</span>
                        </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5 hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Top Gainer</p>
                        <span className="text-sm font-mono font-bold text-primary">{topGainer?.id || "N/A"}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Market Refresh</p>
                        <span className="text-sm font-mono font-bold text-amber-400">15 SEC</span>
                    </div>
                </div>
            </header>

            {/* Trading Grid */}
            <div className="grid grid-cols-1 gap-6">
                {assets.map((asset) => {
                    const priceChange = asset.price - asset.lastPrice;
                    const changePercent = ((priceChange / asset.lastPrice) * 100) || 0;
                    const isUp = priceChange >= 0;

                    return (
                        <div key={asset.id} className="group relative bg-[#0a0b0d] hover:bg-[#0f1115] border border-white/5 rounded-[2.5rem] transition-all duration-500 overflow-hidden">
                            {/* Accent Glow */}
                            <div className={cn(
                                "absolute left-0 top-0 w-1 h-full transition-colors duration-500",
                                isUp ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            )} />

                            <div className="p-8">
                                <div className="flex flex-col xl:flex-row gap-10">
                                    {/* Asset Info Section */}
                                    <div className="xl:w-1/4 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                                                asset.type === 'crypto' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                            )}>
                                                {asset.type === 'crypto' ? <Coins size={32} /> : <Briefcase size={32} />}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tight">{asset.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-muted-foreground uppercase">{asset.id}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">{asset.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Last Price</p>
                                                <div className="text-3xl font-black font-mono tracking-tighter">
                                                    Rp {asset.price.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm",
                                                isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                            )}>
                                                {isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                                {isUp ? "+" : ""}{changePercent.toFixed(2)}%
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Volatility</p>
                                                    <p className="text-sm font-mono font-bold text-white">{(asset.volatility * 100).toFixed(1)}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Trend</p>
                                                    <p className={cn("text-sm font-mono font-bold", isUp ? "text-emerald-500" : "text-red-500")}>
                                                        {isUp ? "BULLISH" : "BEARISH"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Chart Section */}
                                    <div className="xl:w-3/4 flex flex-col justify-center min-h-[350px]">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full">
                                                <BarChart3 size={14} />
                                                <span className="text-xs font-bold uppercase tracking-widest">Market Performance (50 Ticks)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <History size={14} />
                                                <span className="text-[10px] font-medium tracking-wide">Last Tick: {new Date(asset.updatedAt).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        <StockChart data={asset.priceHistory as number[] || [asset.price]} />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-2xl font-black text-sm tracking-tighter uppercase italic flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                    Analyze <Zap size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {assets.length === 0 && (
                    <div className="glass-card p-20 rounded-[3rem] text-center border-dashed">
                        <Activity size={60} className="mx-auto text-muted-foreground/20 mb-6" />
                        <h4 className="text-2xl font-bold mb-2">Market is Halted</h4>
                        <p className="text-muted-foreground">The bot might be offline or no assets have been listed yet. Check your terminal!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
