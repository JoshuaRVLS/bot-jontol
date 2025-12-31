import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SlotsClient from "./SlotsClient";
import { redirect } from "next/navigation";

export default async function SlotsPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) return <div>User not found</div>;

    return <SlotsClient guildId={guildId} initialWallet={user.wallet} />;
}
