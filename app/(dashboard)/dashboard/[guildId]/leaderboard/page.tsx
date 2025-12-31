import { Trophy } from "lucide-react";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;

    return (
        <div className="space-y-10">
            <header className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary rounded-3xl text-white shadow-[0_20px_40px_rgba(59,130,246,0.2)]">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
                            GLOBAL RANKINGS
                        </h2>
                        <p className="text-muted-foreground mt-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] opacity-40">
                            The hall of fame for the greatest players
                        </p>
                    </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-primary/50 via-white/5 to-transparent" />
            </header>

            <LeaderboardClient />
        </div>
    );
}
