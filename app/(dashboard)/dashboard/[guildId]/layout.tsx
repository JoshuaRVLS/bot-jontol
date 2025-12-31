import { Sidebar } from "@/components/Sidebar";
import { TrollChaos } from "@/components/TrollChaos";
import { checkIsDeveloper } from "@/app/actions/developer";

export default async function GuildLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ guildId: string }>;
}) {
    const { guildId } = await params;
    const isDeveloper = await checkIsDeveloper();

    return (
        <div className="flex bg-background min-h-screen relative overflow-hidden">
            <TrollChaos />
            <Sidebar guildId={guildId} isDeveloper={isDeveloper} />
            <main className="flex-1 p-4 md:p-8 pt-24 lg:pt-8 overflow-y-auto relative z-10">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
