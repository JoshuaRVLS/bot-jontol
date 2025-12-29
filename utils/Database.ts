import { PrismaClient } from "@prisma/client";

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

export const updatePity = async (userId: string, amount: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { scPity: amount }
  });
};

export const incrementPity = async (userId: string, amount: number = 1) => {
  return prisma.user.update({
    where: { id: userId },
    data: { scPity: { increment: amount } }
  });
};

export const resetPity = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { scPity: 0 }
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
  if (!user.inventory || typeof user.inventory !== 'object') {
    return {};
  }

  // Filter out non-item keys like csSkins
  const inv = { ...(user.inventory as any) };
  delete inv.csSkins;

  return inv as Record<string, number>;
};

export const addItem = async (userId: string, itemId: string, amount: number = 1) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };
  const currentAmount = (inv as any)[itemId] || 0;
  (inv as any)[itemId] = currentAmount + amount;

  return prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });
};

export const removeItem = async (userId: string, itemId: string, amount: number = 1) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };

  if (!(inv as any)[itemId] || (inv as any)[itemId] < amount) return false;

  (inv as any)[itemId] -= amount;
  if ((inv as any)[itemId] <= 0) delete (inv as any)[itemId];

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });
  return true;
};

// --- CS:GO Skin System ---
export const addCSGOSkin = async (userId: string, skin: any) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };

  if (!Array.isArray(inv.csSkins)) {
    inv.csSkins = [];
  }

  // Add a unique instance ID for each skin so we can sell specific ones
  const skinInstance = {
    ...skin,
    instanceId: `${skin.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    obtainedAt: new Date()
  };

  inv.csSkins.push(skinInstance);

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });

  return skinInstance;
};

export const addCSGOSkins = async (userId: string, skins: any[]) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };

  if (!Array.isArray(inv.csSkins)) {
    inv.csSkins = [];
  }

  const newInstances = skins.map(skin => ({
    ...skin,
    instanceId: `${skin.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    obtainedAt: new Date()
  }));

  inv.csSkins.push(...newInstances);

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });

  return newInstances;
};

export const removeCSGOSkin = async (userId: string, instanceId: string) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };

  if (!Array.isArray(inv.csSkins)) return null;

  const skinIndex = inv.csSkins.findIndex((s: any) => s.instanceId === instanceId);
  if (skinIndex === -1) return null;

  const [removedSkin] = inv.csSkins.splice(skinIndex, 1);

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });

  return removedSkin;
};

export const clearCSGOSkins = async (userId: string) => {
  const user = await getUserData(userId);
  const inv = { ...(user.inventory as any) || {} };

  if (!Array.isArray(inv.csSkins)) return [];

  const removedSkins = [...inv.csSkins];
  inv.csSkins = [];

  await prisma.user.update({
    where: { id: userId },
    data: { inventory: inv }
  });

  return removedSkins;
};

export const getCSGOSkins = async (userId: string): Promise<any[]> => {
  const user = await getUserData(userId);
  const inv = (user.inventory as any) || {};
  return Array.isArray(inv.csSkins) ? inv.csSkins : [];
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

// --- Investment System ---
export const getInvestments = async (userId: string): Promise<Record<string, number>> => {
  const user = await getUserData(userId);
  if (!user.investments || typeof user.investments !== 'object') {
    return {};
  }
  return user.investments as Record<string, number>;
};

export const updateInvestment = async (userId: string, assetId: string, amount: number) => {
  const investments = await getInvestments(userId);
  const currentAmount = investments[assetId] || 0;
  investments[assetId] = currentAmount + amount;

  if (investments[assetId] <= 0) delete investments[assetId];

  return prisma.user.update({
    where: { id: userId },
    data: { investments: investments }
  });
};

export const getMarketAssets = async () => {
  return prisma.marketAsset.findMany();
};

export const getTotalInvestmentValue = async (userId: string) => {
  const investments = await getInvestments(userId);
  const assets = await getMarketAssets();

  let totalValue = 0;
  for (const [assetId, amount] of Object.entries(investments)) {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      totalValue += (amount as number) * asset.price;
    }
  }
  return totalValue;
};

export const getMarketAsset = async (assetId: string) => {
  return prisma.marketAsset.findUnique({
    where: { id: assetId }
  });
};

export const updateMarketAsset = async (assetId: string, data: { price: number, lastPrice: number }) => {
  return prisma.marketAsset.update({
    where: { id: assetId },
    data: {
      ...data,
      updatedAt: new Date()
    }
  });
};

export const initMarketAsset = async (assetId: string, name: string, type: string, price: number) => {
  return prisma.marketAsset.upsert({
    where: { id: assetId },
    update: {},
    create: {
      id: assetId,
      name,
      type,
      price,
      lastPrice: price
    }
  });
};

// --- Bounty System ---
export const setBounty = async (targetId: string, rewardValue: number, placedBy: string) => {
  return (prisma as any).bounty.upsert({
    where: { targetId },
    update: {
      reward: { increment: rewardValue },
      placedBy: placedBy
    },
    create: {
      targetId,
      reward: rewardValue,
      placedBy
    }
  });
};

export const getBounty = async (targetId: string) => {
  return (prisma as any).bounty.findUnique({
    where: { targetId }
  });
};

export const claimBounty = async (targetId: string) => {
  const bounty = await getBounty(targetId);
  if (!bounty) return null;

  await (prisma as any).bounty.delete({
    where: { targetId }
  });

  return bounty;
};

// --- Daily Streak ---
export const updateStreak = async (userId: string, reset: boolean = false) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      dailyStreak: reset ? 1 : { increment: 1 }
    }
  });
};

// --- Guild Configuration ---
export const getGuildConfig = async (guildId: string) => {
  return (prisma as any).guildConfig.findUnique({
    where: { guildId }
  });
};

export const setGuildConfig = async (guildId: string, data: any) => {
  return (prisma as any).guildConfig.upsert({
    where: { guildId },
    update: { ...data, updatedAt: new Date() },
    create: { guildId, ...data }
  });
};
