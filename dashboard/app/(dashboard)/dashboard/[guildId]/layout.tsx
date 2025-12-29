import { Sidebar } from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkGuildPermissions } from "@/lib/discord";

export default async function GuildLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ guildId: string }>;
}) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);

    let isAdmin = false;
    if (session?.accessToken) {
        const permissions = await checkGuildPermissions(session.accessToken, guildId);
        isAdmin = permissions.isAdmin;
    }

    return (
        <div className="flex bg-background min-h-screen">
            <Sidebar guildId={guildId} isAdmin={isAdmin} />
            <main className="flex-1 p-4 md:p-8 pt-24 lg:pt-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
