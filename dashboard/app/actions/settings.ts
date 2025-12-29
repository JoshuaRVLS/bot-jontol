"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const saveGuildConfig = async (guildId: string, data: {
    welcomeChannelId?: string;
    leaveChannelId?: string;
    welcomeMessage?: string;
    leaveMessage?: string;
}) => {
    try {
        await prisma.guildConfig.upsert({
            where: { guildId },
            update: {
                ...data,
                updatedAt: new Date()
            },
            create: {
                guildId,
                ...data
            }
        });

        revalidatePath(`/dashboard/${guildId}/settings`);
        return { success: true };
    } catch (error) {
        console.error("Failed to save guild config:", error);
        return { success: false, error: "Gagal menyimpan konfigurasi ke database." };
    }
};
