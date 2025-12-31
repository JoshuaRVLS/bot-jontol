import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlackjackClient from "./BlackjackClient";

export default async function BlackjackPage({ params }: { params: Promise<{ guildId: string }> }) {
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const { guildId } = await params;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wallet: true }
    });

    if (!user) redirect("/");

    return <BlackjackClient guildId={guildId} initialWallet={user.wallet} />;
}
