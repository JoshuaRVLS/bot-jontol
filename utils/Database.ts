import { PrismaClient, User } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const db = globalForPrisma.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}

export const addNewUser = async (id: string): Promise<User | null> => {
  try {
    return await db.user.create({
      data: {
        id,
        wallet: 0,
        bank: 0,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const isUserExists = async (id: string): Promise<boolean> => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return !!user; // Convert to boolean
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};

export const getUserData = async (id: string): Promise<User> => {
  try {
    let user = await db.user.findUnique({ where: { id } });
    if (!user) {
      user = await addNewUser(id);
    }
    return user!;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const addWallet = async (id: string, amount: number) => {
  try {
    await getUserData(id); // Ensure user exists
    return await db.user.update({
      where: { id },
      data: {
        wallet: { increment: amount }
      }
    });
  } catch (error) {
    console.error("Error adding wallet:", error);
    throw error;
  }
}

export const addBank = async (id: string, amount: number) => {
  try {
    await getUserData(id); // Ensure user exists
    return await db.user.update({
      where: { id },
      data: {
        bank: { increment: amount }
      }
    });
  } catch (error) {
    console.error("Error adding bank:", error);
    throw error;
  }
}

export const removeWallet = async (id: string, amount: number) => {
  try {
    await getUserData(id);
    // Add check if balance sufficient? logic usually handled in command but good to have safety
    return await db.user.update({
      where: { id },
      data: {
        wallet: { decrement: amount }
      }
    });
  } catch (error) {
    console.error("Error removing wallet:", error);
    throw error;
  }
}

export const removeBank = async (id: string, amount: number) => {
  try {
    await getUserData(id);
    return await db.user.update({
      where: { id },
      data: {
        bank: { decrement: amount }
      }
    });
  } catch (error) {
    console.error("Error removing bank:", error);
    throw error;
  }
}

export default db;
