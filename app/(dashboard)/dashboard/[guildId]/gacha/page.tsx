import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CASE_CONFIGS } from "@/lib/csgo";
import { prisma } from "@/lib/prisma";
import CaseCard from "@/components/gacha/CaseCard";
import { Zap, Wallet, TrendingUp } from "lucide-react";

export default async function GachaPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const userData = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-bold">Data user gak ketemu bang. Coba interaksi sama bot dulu di Discord!</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                        <Zap className="text-primary fill-primary/20" />
                        Skin Gacha
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Auto-sync with JONTOL Bot Economy. Gacha dari web lebih gacor!</p>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Wallet size={20} className="text-primary" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Your Balance</p>
                        <p className="text-lg font-black font-mono">Rp {userData.wallet.toLocaleString()}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Object.values(CASE_CONFIGS).map((config) => (
                    <CaseCard key={config.id} config={config} guildId={guildId} />
                ))}
            </div>

            <section className="glass-card p-8 rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-4 mb-4 text-emerald-400">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-black uppercase italic">Pity System Active</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    Pity Count lu saat ini: <span className="text-emerald-400 font-black font-mono">{(userData as any).scPity}</span>
                </p>
            </section>
        </div>
    );
}
