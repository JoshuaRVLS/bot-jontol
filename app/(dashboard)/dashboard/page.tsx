import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchUserGuilds, hasAdminPermission } from "@/lib/discord";
import { redirect } from "next/navigation";
import { Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardMain() {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const allGuilds = await fetchUserGuilds(session.accessToken);
    const adminGuilds = allGuilds.filter((g) => hasAdminPermission(g.permissions));

    const TARGET_GUILD_ID = "757231069043884042";
    if (adminGuilds.some(g => g.id === TARGET_GUILD_ID)) {
        redirect(`/dashboard/${TARGET_GUILD_ID}`);
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-10">
                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter italic">Absen Server Abangku 🔥</h2>
                        <p className="text-muted-foreground mt-1 text-xs font-bold uppercase tracking-widest opacity-50">Silahkan pilih habitat judi abang hari ini.</p>
                    </div>
                    <div className="flex items-center gap-4 p-2 pr-4 bg-muted/30 rounded-full border border-border">
                        <img src={session.user.image} className="w-10 h-10 rounded-full" alt="avatar" />
                        <span className="font-medium">{session.user.name}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminGuilds.map((guild) => (
                        <Link key={guild.id} href={`/dashboard/${guild.id}`}>
                            <div className="glass-card group p-6 rounded-3xl hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-border group-hover:border-primary/30 transition-colors">
                                        {guild.icon ? (
                                            <img
                                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                                alt={guild.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-muted-foreground">
                                                {guild.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg truncate">{guild.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1 bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit">
                                            <ShieldCheck size={12} />
                                            ADMINISTRATOR
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                                        <Settings size={20} />
                                    </div>
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>

                {adminGuilds.length === 0 && (
                    <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border text-muted-foreground">
                        Lu gak punya akses admin di server manapun bang. <br />Ajak bot-nya masuk ke server baru dulu!
                    </div>
                )}
            </div>
        </div>
    );
}
