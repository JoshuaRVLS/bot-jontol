"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const checkIsDeveloper = async (): Promise<boolean> => {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) return false;

    const developer = await prisma.developer.findUnique({
        where: { id: session.user.id }
    });

    return !!developer;
};

export const getDevelopers = async () => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const isDev = await checkIsDeveloper();
    if (!isDev) return { error: "Bukan developer!" };

    const developers = await prisma.developer.findMany({
        orderBy: { addedAt: "desc" }
    });

    return { success: true, developers };
};

export const addDeveloper = async (userId: string, name?: string) => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const isDev = await checkIsDeveloper();
    if (!isDev) return { error: "Bukan developer!" };

    try {
        await prisma.developer.upsert({
            where: { id: userId },
            update: { name },
            create: { id: userId, name }
        });

        return { success: true };
    } catch (error) {
        console.error("[Add Developer Error]", error);
        return { error: "Gagal tambah developer!" };
    }
};

export const removeDeveloper = async (userId: string) => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const isDev = await checkIsDeveloper();
    if (!isDev) return { error: "Bukan developer!" };

    if (userId === session.user.id) {
        return { error: "Gabisa hapus diri sendiri bang!" };
    }

    try {
        await prisma.developer.delete({
            where: { id: userId }
        });

        return { success: true };
    } catch (error) {
        console.error("[Remove Developer Error]", error);
        return { error: "Gagal hapus developer!" };
    }
};
