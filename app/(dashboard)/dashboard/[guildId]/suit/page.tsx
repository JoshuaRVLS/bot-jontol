import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SuitClient from "./SuitClient";

export default async function SuitPage({ params }: { params: Promise<{ guildId: string }> }) {
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const { guildId } = await params;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) redirect("/");

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <SuitClient
                guildId={guildId}
                initialWallet={user.wallet}
                userId={session.user.id}
                userName={session.user.name || "Anonymous"}
                userAvatar={session.user.image}
            />
        </div>
    );
}
