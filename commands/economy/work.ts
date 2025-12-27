import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Kerja rodhi biar dapet duit!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const now = new Date();

        if (user.lastWork) {
            const lastWork = new Date(user.lastWork);
            const diffTime = Math.abs(now.getTime() - lastWork.getTime());
            const diffMinutes = Math.ceil(diffTime / (1000 * 60)); // Minutes

            const COOLDOWN_MINUTES = 60;

            if (diffMinutes < COOLDOWN_MINUTES) {
                const minutesLeft = COOLDOWN_MINUTES - diffMinutes;
                await interaction.followUp({
                    content: `Lu capek bang, istirahat dulu! Bisa kerja lagi dalam ${minutesLeft} menit.`,
                    ephemeral: true
                });
                return;
            }
        }

        // Salary 20k - 100k
        const salary = Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000;

        // Random job messages
        const jobs = [
            "ngelap kaca gedung DPR",
            "jagain parkir Indomaret",
            "jadi badut lamer",
            "open bo (bantu orang)",
            "mulung botol bekas",
            "jadi admin slot",
            "ngoding bot discord"
        ];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

        try {
            await addWallet(userId, salary);
            await db.user.update({
                where: { id: userId },
                data: { lastWork: now }
            });

            await interaction.followUp(`Lu abis **${randomJob}** dan dapet gaji **${formatRupiah(salary)}**! Lumayan buat beli gorengan.`);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal kerja, bos lari bawa duit.", ephemeral: true });
        }
    },
} as Command;
