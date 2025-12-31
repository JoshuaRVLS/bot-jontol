import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedDevelopers = async () => {
    const developers = [
        { id: "1097445155390365726", name: "Joshua Ravael" }
    ];

    for (const dev of developers) {
        await prisma.developer.upsert({
            where: { id: dev.id },
            update: { name: dev.name },
            create: { id: dev.id, name: dev.name }
        });
        console.log(`Added developer: ${dev.name} (${dev.id})`);
    }

    console.log("Seeding complete!");
    await prisma.$disconnect();
};

seedDevelopers().catch(console.error);
