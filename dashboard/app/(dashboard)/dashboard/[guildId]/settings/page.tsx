import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Settings, Info, ShieldAlert } from "lucide-react";
import { getGuildLiveData } from "@/lib/bot";
import { SettingsForm } from "@/components/SettingsForm";
import { checkGuildPermissions } from "@/lib/discord";

export default async function SettingsPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const permissions = await checkGuildPermissions(session.accessToken, guildId);

    if (!permissions.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ShieldAlert size={40} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black uppercase">Akses Ditolak</h2>
                <p className="text-muted-foreground max-w-md">
                    Hanya <b>Administrator Discord</b> yang bisa akses halaman ini.
                    Hubungi admin server kalo butuh akses.
                </p>
            </div>
        );
    }

    const [config, guildLive] = await Promise.all([
        prisma.guildConfig.findUnique({
            where: { guildId }
        }),
        getGuildLiveData(guildId)
    ]);

    const channels = guildLive?.channels || [];

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Settings className="text-primary" />
                    Server Settings
                </h2>
                <p className="text-muted-foreground mt-1">Konfigurasi fitur-fitur otomatis buat server abang.</p>
            </header>

            {!guildLive && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
                    <Info size={18} />
                    <p><b>Bot Offline:</b> Gak bisa ambil daftar channel real-time. Tapi abang tetep bisa edit teks pesannya.</p>
                </div>
            )}

            <SettingsForm
                guildId={guildId}
                channels={channels}
                initialConfig={config}
            />
        </div>
    );
}
