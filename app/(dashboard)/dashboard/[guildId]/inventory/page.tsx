import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InventoryManager from "./InventoryManager";

export default async function InventoryPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h1 className="text-2xl font-black italic">USER GAK KETEMU BANG!</h1>
                    <p className="text-muted-foreground mt-2">Coba login ulang deh.</p>
                </div>
            </div>
        );
    }

    const inventory = (user.inventory as any) || {};
    const skins = inventory.csSkins || [];

    // Filter out skins and only keep items (Record<string, number>)
    const items = { ...inventory };
    delete items.csSkins;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/0 rounded-[60px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative glass-card p-8 sm:p-12 rounded-[50px] border-white/10 flex flex-col gap-8 overflow-hidden rotate-[-1deg] hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(239,68,68,0.1)] hover:shadow-[0_0_80px_rgba(239,68,68,0.2)]">
                    {/* Chaotic Background Lines */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-1 bg-gradient-to-r from-red-500/50 to-transparent -rotate-45" />

                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                            GUDANG <span className="text-red-500 tracking-normal underline decoration-dashed underline-offset-8">HARTA KARUN</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs opacity-40 max-w-lg leading-relaxed border-l-4 border-red-500 pl-4">
                            Semua hasil nyuri dan nambang lu ada di sini, jangan dipamerin ke polisi ya bang.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-[32px] p-6 backdrop-blur-3xl relative overflow-hidden group/item hover:bg-red-500/10 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-2">TOTAL KEKAYAAN HARAM</span>
                            <span className="text-2xl sm:text-4xl font-black italic text-emerald-400 group-hover:scale-110 transition-transform">
                                Rp {skins.reduce((acc: number, s: any) => acc + (s.marketPrice || 0), 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-3xl relative overflow-hidden hover:border-white/20 transition-colors rotate-1 hover:rotate-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">KOLEKSI TUMBAL</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl sm:text-3xl font-black italic text-white">{skins.length} <small className="text-[10px] font-bold uppercase opacity-50">SKINS</small></span>
                                <span className="text-sm font-black text-amber-500">{Object.keys(items).length} <small className="text-[8px] opacity-50">ITEMS</small></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InventoryManager skins={skins} items={items} userId={session.user.id} />
        </div>
    );
}
