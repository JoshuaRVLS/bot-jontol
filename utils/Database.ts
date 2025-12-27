import { PrismaClient } from "../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

// --- User Management ---
export const addNewUser = async (userId: string) => {
  try {
    await prisma.user.create({
      data: {
        id: userId,
      }
    });
  } catch (error) {
    // console.log("Error adding new user:", error);
  }
};

export const isUserExists = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return !!user;
  } catch (error) {
    console.log("Error checking user:", error);
    return false;
  }
};

export const getUserData = async (userId: string) => {
  let user: any = await prisma.user.findUnique({
    where: { id: userId },
    include: { warnings: true }
  });

  if (!user) {
    await addNewUser(userId);
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { warnings: true }
    });
  }

  // Fallback if still null (shouldn't happen unless DB error)
  if (!user) throw new Error("Could not create/fetch user.");

  return user;
};

// --- Economy ---
export const addWallet = async (userId: string, amount: number) => {
  await getUserData(userId); // Ensure user exists
  return prisma.user.update({
    where: { id: userId },
    data: { wallet: { increment: amount } }
  });
};

export const addBank = async (userId: string, amount: number) => {
  await getUserData(userId);
  return prisma.user.update({
    where: { id: userId },
    data: { bank: { increment: amount } }
  });
};

export const removeWallet = async (userId: string, amount: number) => {
  await getUserData(userId);
  return prisma.user.update({
    where: { id: userId },
    data: { wallet: { decrement: amount } }
  });
};

export const removeBank = async (userId: string, amount: number) => {
  await getUserData(userId);
  return prisma.user.update({
    where: { id: userId },
    data: { bank: { decrement: amount } }
  });
};

// --- Moderation (Warnings) ---
export const addWarning = async (userId: string, moderatorId: string, reason: string) => {
  await getUserData(userId); // Ensure user exists
  return prisma.warning.create({
    data: {
      userId,
      moderatorId,
      reason
    }
  });
};

export const getWarnings = async (userId: string) => {
  return prisma.warning.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const clearWarnings = async (userId: string) => {
  return prisma.warning.deleteMany({
    where: { userId }
  });
};

// --- Inventory System ---
export const getInventory = async (userId: string): Promise<Record<string, number>> => {
  const user = await getUserData(userId);
  // Ensure inventory is treated as object
  if (!user.inventory || typeof user.inventory !== 'object') {
    return {};
  }
  return user.inventory as Record<string, number>;
};

export const addItem = async (userId: string, itemId: string, amount: number = 1) => {
  const inv = await getInventory(userId);
  const currentAmount = inv[itemId] || 0;
  inv[itemId] = currentAmount + amount;

  return prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });
};

export const removeItem = async (userId: string, itemId: string, amount: number = 1) => {
  const inv = await getInventory(userId);
  if (!inv[itemId] || inv[itemId] < amount) return false;

  inv[itemId] -= amount;
  if (inv[itemId] <= 0) delete inv[itemId];

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });
  return true;
};

// --- Leveling System ---
export const getLevelXp = (level: number) => level * 1000; // XP needed for next level (Linear/Simple)

export const addXp = async (userId: string, xpAmount: number) => {
  const user = await getUserData(userId);
  let newXp = user.xp + xpAmount;
  let newLevel = user.level;
  let leveledUp = false;

  // Check for level up
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

  return { leveledUp, newLevel };
};
