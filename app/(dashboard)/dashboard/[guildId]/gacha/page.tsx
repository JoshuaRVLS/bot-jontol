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
                <p className="text-muted-foreground font-bold">Data pengguna tidak ditemukan. Silakan berinteraksi dengan bot di Discord terlebih dahulu!</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                {/* Decorative chaotic lines */}
                <div className="absolute -top-10 -right-20 w-64 h-1 bg-gradient-to-l from-red-500/30 to-transparent rotate-12 blur-sm" />

                <div className="relative">
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic flex items-center gap-4 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        <div className="p-4 bg-red-500 rounded-[30px] shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                            <Zap size={40} className="text-white fill-white" />
                        </div>
                        GACHA <span className="text-red-500">CENTER</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] opacity-40 ml-2 border-l-2 border-red-500 pl-4">
                        Uji keberuntungan Anda di sini. Dapatkan berbagai item langka dan eksklusif!
                    </p>
                </div>

                <div className="flex items-center gap-6 px-10 py-5 rounded-[40px] bg-red-500/10 border-2 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)] rotate-[-2deg] hover:rotate-0 transition-transform">
                    <div className="p-3 bg-red-500 rounded-2xl shadow-lg">
                        <Wallet size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">SALDO ANDA</p>
                        <p className="text-2xl font-black italic tracking-tighter text-white">Rp {userData.wallet.toLocaleString()}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Object.values(CASE_CONFIGS).map((config) => (
                    <CaseCard key={config.id} config={config} guildId={guildId} />
                ))}
            </div>

            <section className="relative glass-card p-10 rounded-[50px] border-emerald-500/20 bg-emerald-500/5 overflow-hidden group hover:border-emerald-500/40 transition-all rotate-1 hover:rotate-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
                <div className="flex items-center gap-5 mb-6 text-emerald-400">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl rotate-6 group-hover:rotate-0 transition-transform">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">SISTEM PITY</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Jaminan item langka setelah akumulasi gacha tertentu</p>
                    </div>
                </div>
                <div className="relative inline-block px-8 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[24px]">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">
                        JUMLAH PITY SAAT INI
                    </p>
                    <span className="text-4xl font-black italic text-emerald-400 tracking-tighter">
                        {(userData as any).scPity}
                    </span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                </div>
            </section>
        </div>
    );
}
