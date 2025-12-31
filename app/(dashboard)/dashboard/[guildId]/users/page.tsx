import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkIsDeveloper } from "@/app/actions/developer";
import UserManagementClient from "./UserManagementClient";

export default async function UsersPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session) redirect("/");

    const isDeveloper = await checkIsDeveloper();
    if (!isDeveloper) {
        redirect(`/dashboard/${guildId}`);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase">
                    User <span className="text-primary">Management</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                    Developer-only panel untuk manage data user.
                </p>
            </header>

            <UserManagementClient guildId={guildId} />
        </div>
    );
}
