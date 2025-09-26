import { PrismaClient, User } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

const createExtendedPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

const globalForPrisma = globalThis as unknown as {
  db: ExtendedPrismaClient | undefined;
};

const db = globalForPrisma.db ?? createExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}

export const addNewUser = async (id: string) => {
  try {
    await db.user.create({
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const isUserExists = async (id: string): Promise<boolean> => {
  try {
    if (!(await db.user.findFirst({ where: { id } }))) {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

export const getUserData = async (id: string): Promise<User> => {
  try {
    if (!(await isUserExists(id))) await addNewUser(id);
    const user = await db.user.findUnique({ where: { id } });
    return user!;
  } catch (error) {
    console.log(error);
    return {} as User;
  }
};

export default db;
