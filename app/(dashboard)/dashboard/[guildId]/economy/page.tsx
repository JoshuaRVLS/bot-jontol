import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Wallet, Landmark, BarChart3, Coins } from "lucide-react";
import BalanceManager from "@/components/economy/BalanceManager";

export default async function EconomyPage({ params }: { params: Promise<{ guildId: string }> }) {
    await params; // consume params
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    // Fetch user data for balance manager
    const userData = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    // Fetch economy stats
    const [totalUsers, economyStats, topUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.aggregate({
            _sum: {
                bank: true,
                wallet: true
            }
        }),
        prisma.user.findMany({
            take: 5,
            orderBy: [
                { bank: 'desc' },
                { wallet: 'desc' }
            ]
        })
    ]);

    const totalMoney = (economyStats._sum.bank || 0) + (economyStats._sum.wallet || 0);

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                        <Coins size={32} className="text-primary fill-primary/20" />
                        Economy Hub
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring & managing your server assets.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[38px] relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 size={60} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Global Circulation</p>
                    <h4 className="text-2xl font-black font-mono tracking-tighter">Rp {totalMoney.toLocaleString()}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-widest">Active Economy</p>
                </div>

                <div className="glass-card p-8 rounded-[38px] relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={60} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Total Participants</p>
                    <h4 className="text-2xl font-black font-mono tracking-tighter">{totalUsers.toLocaleString()} Users</h4>
                    <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">Growing Daily</p>
                </div>

                <div className="glass-card p-8 rounded-[38px] relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Landmark size={60} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Bank Reserves</p>
                    <h4 className="text-2xl font-black font-mono tracking-tighter">Rp {(economyStats._sum.bank || 0).toLocaleString()}</h4>
                    <p className="text-[10px] text-blue-400 font-bold mt-2 uppercase tracking-widest">Stored Wealth</p>
                </div>
            </div>

            {userData && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Your Balance</h3>
                    </div>
                    <BalanceManager
                        initialWallet={userData.wallet}
                        initialBank={userData.bank}
                    />
                </section>
            )}

            <section className="space-y-6 mt-12">
                <div className="flex items-center gap-3 px-2">
                    <span className="w-1.5 h-6 bg-amber-400 rounded-full" />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Top 5 Richest</h3>
                </div>

                <div className="glass-card p-2 sm:p-4 rounded-[24px] sm:rounded-[40px] border-white/5">
                    <div className="space-y-2">
                        {topUsers.map((user: any, index: number) => (
                            <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-white/5 rounded-[20px] sm:rounded-[32px] transition-all group gap-3">
                                <div className="flex items-center gap-3 sm:gap-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-muted/50 flex items-center justify-center font-black text-base sm:text-lg text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                                        #{index + 1}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-black text-base sm:text-lg uppercase tracking-tight group-hover:translate-x-1 transition-transform truncate">
                                            {user.name || `User ${user.id.slice(0, 5)}...`}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-50">
                                            Member since {new Date(user.createdAt).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right pl-13 sm:pl-0">
                                    <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase mb-0.5 sm:mb-1 tracking-widest">Total Wealth</p>
                                    <p className="font-mono font-black text-lg sm:text-xl text-emerald-400">
                                        Rp {(user.bank + user.wallet).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
