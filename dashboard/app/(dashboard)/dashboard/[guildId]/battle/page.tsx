import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BattleLobby } from "./BattleLobby";
import { Swords, Info } from "lucide-react";

export default async function BattlePage({
    params,
}: {
    params: Promise<{ guildId: string }>;
}) {
    const session: any = await getServerSession(authOptions);
    const { guildId } = await params;

    if (!session) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wallet: true }
    });

    const initialRooms = await prisma.battleRoom.findMany({
        where: {
            guildId,
            status: "waiting",
            isPrivate: false
        },
        orderBy: { createdAt: "desc" },
        take: 20
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
                        <Swords size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            BATTLE <span className="text-red-500">ARENA</span>
                        </h1>
                        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-2">
                            Adu nasib. Winner takes all. 🎰⚔️
                        </p>
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4 items-start max-w-2xl">
                    <Info className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-bold text-red-200/80 leading-relaxed">
                        Battle adalah mode PVP dengan resiko tinggi. Semua player buka case barengan, dan yang punya total value tertinggi menang.
                        <strong className="text-white"> WINNER TAKES ALL!</strong>
                    </p>
                </div>
            </header>

            <BattleLobby
                guildId={guildId}
                userId={session.user.id}
                userName={session.user.name || "Anonymous"}
                userAvatar={session.user.image}
                userWallet={user?.wallet || 0}
                initialRooms={initialRooms as any}
            />
        </div>
    );
}
