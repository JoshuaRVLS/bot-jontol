import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GuideClient from "./GuideClient";

export default async function GuidePage({
    params
}: {
    params: Promise<{ guildId: string }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    await params; // consume params

    return <GuideClient />;
}
