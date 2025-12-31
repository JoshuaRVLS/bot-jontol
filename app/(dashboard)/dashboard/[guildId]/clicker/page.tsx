import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClickerClient from "./ClickerClient";

export default async function ClickerPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wallet: true },
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ClickerClient
                guildId={guildId}
                initialWallet={user?.wallet || 0}
            />
        </div>
    );
}
