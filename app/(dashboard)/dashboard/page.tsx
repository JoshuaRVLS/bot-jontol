import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardMain() {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const TARGET_GUILD_ID = "757231069043884042";
    redirect(`/dashboard/${TARGET_GUILD_ID}`);
}
