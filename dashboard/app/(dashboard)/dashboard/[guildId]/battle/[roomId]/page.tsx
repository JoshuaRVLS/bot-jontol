import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { BattleRoomView } from "./BattleRoomView";

export default async function BattleRoomPage({
    params,
}: {
    params: Promise<{ guildId: string; roomId: string }>;
}) {
    const session: any = await getServerSession(authOptions);
    const { guildId, roomId } = await params;

    if (!session) redirect("/api/auth/signin");

    const room = await prisma.battleRoom.findUnique({
        where: { id: roomId }
    });

    if (!room) notFound();

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wallet: true }
    });

    return (
        <BattleRoomView
            room={room as any}
            guildId={guildId}
            currentUser={{
                id: session.user.id,
                name: session.user.name || "Anonymous",
                avatar: session.user.image,
                wallet: user?.wallet || 0
            }}
        />
    );
}
