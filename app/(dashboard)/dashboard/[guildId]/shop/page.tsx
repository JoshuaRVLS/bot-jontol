import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShoppingBag, Coins } from "lucide-react";
import ShopClient from "./ShopClient";

export default async function ShopPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) redirect("/");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative glass-card p-10 rounded-[40px] border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                            Pasar <span className="text-primary tracking-normal">Jontol</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 font-medium max-w-lg leading-relaxed">
                            Pusat belanja barang-barang haram dan perlengkapan pro buat dukung karir kriminal lu bang.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl p-6 min-w-[200px] backdrop-blur-xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Duit Lu Sekarang</span>
                        <div className="flex items-center gap-2">
                            <Coins className="text-yellow-400" size={20} />
                            <span className="text-3xl font-black italic text-emerald-400">
                                Rp {user.wallet.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <ShopClient userWallet={user.wallet} />
        </div>
    );
}
