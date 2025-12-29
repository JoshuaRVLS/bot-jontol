"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function manageBalanceAction(type: "deposit" | "withdraw", amount: number) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;

    if (amount <= 0 || isNaN(amount)) {
        return { error: "Jumlahnya yang bener dong bang!" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return { error: "User gak ketemu!" };

        if (type === "deposit") {
            if (user.wallet < amount) return { error: "Duit di wallet gak cukup bang!" };

            await prisma.user.update({
                where: { id: userId },
                data: {
                    wallet: { decrement: amount },
                    bank: { increment: amount }
                }
            });
        } else {
            if (user.bank < amount) return { error: "Duit di bank gak cukup bang!" };

            await prisma.user.update({
                where: { id: userId },
                data: {
                    wallet: { increment: amount },
                    bank: { decrement: amount }
                }
            });
        }

        revalidatePath("/dashboard/[guildId]/economy", "page");
        return { success: true };
    } catch (error) {
        console.error("[Economy Action Error]", error);
        return { error: "Gagal memproses transaksi ekonomi." };
    }
}
