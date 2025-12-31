import { getGuildGachaConfig } from "@/app/actions/gacha";
import { GachaConfigEditor } from "@/components/gacha/GachaConfigEditor";
import { UserGachaEditor } from "@/components/gacha/UserGachaEditor";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConfigTabs } from "@/components/gacha/ConfigTabs";

export default async function GachaConfigPage({
    params
}: {
    params: Promise<{ guildId: string }>
}) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const { config, error } = await getGuildGachaConfig(guildId);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Probability Management</h1>

            <ConfigTabs
                guildId={guildId}
                guildConfig={config}
                guildError={error}
            />
        </div>
    );
}
