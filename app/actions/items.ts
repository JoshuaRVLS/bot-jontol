"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItem } from "@/lib/items";
import { revalidatePath } from "next/cache";

export async function buyItemAction(itemId: string, amount: number = 1) {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;
    const item = getItem(itemId);

    if (!item) return { error: "Itemnya kaga ada bang!" };
    if (amount <= 0) return { error: "Jumlahnya yang bener dong!" };

    const totalCost = item.price * amount;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return { error: "User gak ketemu!" };
        if (user.wallet < totalCost) return { error: "Duit di wallet kaga cukup bang!" };

        const inv = { ...(user.inventory as any) || {} };
        const currentAmount = (inv as any)[itemId] || 0;
        (inv as any)[itemId] = currentAmount + amount;

        await prisma.user.update({
            where: { id: userId },
            data: {
                wallet: { decrement: totalCost },
                inventory: inv
            } as any
        });

        revalidatePath("/dashboard/[guildId]/shop", "page");
        revalidatePath("/dashboard/[guildId]/inventory", "page");

        return { success: true };
    } catch (error) {
        console.error("[Buy Item Error]", error);
        return { error: "Gagal beli item. Coba lagi deh." };
    }
}
