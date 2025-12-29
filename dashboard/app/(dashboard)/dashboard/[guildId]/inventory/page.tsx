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
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative glass-card p-10 rounded-[40px] border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                            Koleksi <span className="text-primary tracking-normal">Aset & Barang</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 font-medium max-w-lg leading-relaxed">
                            Simpenan skin-skin mewah dan barang-barang haram lu ada di sini bang. Cek total aset lu di samping.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl p-6 min-w-[200px] backdrop-blur-xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Aset Skin</span>
                        <span className="text-3xl font-black italic text-emerald-400">
                            Rp {skins.reduce((acc: number, s: any) => acc + (s.marketPrice || 0), 0).toLocaleString()}
                        </span>
                        <div className="h-px w-full bg-white/5 my-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Koleksi</span>
                        <span className="text-xl font-black">{skins.length} SKINS | {Object.keys(items).length} ITEMS</span>
                    </div>
                </div>
            </div>

            <InventoryManager skins={skins} items={items} userId={session.user.id} />
        </div>
    );
}
