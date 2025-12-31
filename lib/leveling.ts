import { prisma } from "./prisma";

export const getLevelXp = (level: number) => level * 1000;

export const addXp = async (userId: string, xpAmount: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true }
    });

    if (!user) return { success: false, error: "User not found" };

    let newXp = (user.xp || 0) + xpAmount;
    let newLevel = user.level || 1;
    let leveledUp = false;

    let nextLevelXp = getLevelXp(newLevel);
    while (newXp >= nextLevelXp) {
        newXp -= nextLevelXp;
        newLevel++;
        leveledUp = true;
        nextLevelXp = getLevelXp(newLevel);
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            xp: newXp,
            level: newLevel
        }
    });

    return { success: true, leveledUp, newLevel, newXp };
};
