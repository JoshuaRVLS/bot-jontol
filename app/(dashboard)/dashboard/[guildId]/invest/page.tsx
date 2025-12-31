import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InvestClient } from "./InvestClient";
import { TrendingUp, Info } from "lucide-react";

export default async function InvestPage({
    params,
}: {
    params: Promise<{ guildId: string }>;
}) {
    const session: any = await getServerSession(authOptions);
    const { guildId } = await params;

    if (!session) {
        redirect("/api/auth/signin");
    }

    const [user, marketRes] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                wallet: true,
                investments: true,
            }
        }),
        import("@/app/actions/invest").then(m => m.getMarketDataAction())
    ]);

    if (!user) return redirect("/");
    const marketAssets = marketRes.success ? marketRes.assets : [];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            JSX MARKET <span className="text-primary">& PORTFOLIO</span>
                        </h1>
                        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                            Investasi cerdas, masa depan cerah (atau boncos) 📈
                        </p>
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-4 items-start max-w-2xl">
                    <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-bold text-amber-200/80 leading-relaxed">
                        Peringatan: Investasi di JSX (Jontol Stock Exchange) memiliki resiko tinggi.
                        Harga aset bisa naik 300% atau terjun bebas 90% dalam sekejap.
                        Gunakan duit dingin bang, jangan pake duit bayar kosan.
                    </p>
                </div>
            </header>

            <InvestClient
                initialAssets={marketAssets as any}
                userWallet={user.wallet}
                userInvestments={(user.investments as Record<string, number>) || {}}
            />
        </div>
    );
}
