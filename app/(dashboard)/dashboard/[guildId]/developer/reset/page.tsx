import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldAlert, RotateCcw } from "lucide-react";
import { checkIsDeveloper } from "@/app/actions/developer";
import ResetDataClient from "./ResetDataClient";

export default async function ResetDataPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const isDev = await checkIsDeveloper();

    if (!isDev) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <ShieldAlert size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">AKSES DITOLAK</h2>
                    <p className="text-muted-foreground max-w-md text-xs font-bold uppercase tracking-widest opacity-60">
                        Halaman ini khusus buat para tetua aka <span className="text-primary">Developer</span>.
                        Kalo lu bukan dev, mending cabut sekarang sebelum kena sepakan gravity.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-red-500 rounded-3xl text-white shadow-[0_20px_40px_rgba(239,68,68,0.2)]">
                        <RotateCcw size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
                            RESET DATA MENU
                        </h2>
                        <p className="text-muted-foreground mt-3 text-[10px] sm:text-ms font-black uppercase tracking-[0.3em] opacity-40">
                            Developer exclusive emergency control
                        </p>
                    </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-red-500/50 via-white/5 to-transparent" />
            </header>

            <ResetDataClient guildId={guildId} />
        </div>
    );
}
