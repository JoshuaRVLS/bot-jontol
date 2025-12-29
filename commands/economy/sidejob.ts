import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getPlayerModifiers, applyBonus, applyCooldown } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("sidejob")
        .setDescription("Kerja sampingan biar dapet duit tambahan!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN = 60 * 60 * 1000;
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

        if (user.lastWork) {
            const lastWork = new Date(user.lastWork);
            const diffTime = now.getTime() - lastWork.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const minutesLeft = Math.ceil(timeLeftMs / (1000 * 60));

                const aiMsg = await generateEconomyResponse("sidejob-cooldown", `Player needs to wait ${minutesLeft} minutes more.`);

                await interaction.followUp({
                    content: aiMsg || `Lu capek, istirahat dulu. Bisa kerja sampingan lagi dalam **${minutesLeft} menit**.`,
                });
                return;
            }
        }

        const jobs = [
            "cuci motor",
            "jaga parkir",
            "bersih-bersih rumah",
            "antar paket",
            "jadi fotografer",
            "ngamen di lampu merah",
            "jual gorengan",
            "service AC"
        ];

        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const baseSalary = Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000;
        const salary = applyBonus(baseSalary, mods.workBonus || 0);

        try {
            await addWallet(userId, salary);
            await db.user.update({
                where: { id: userId },
                data: { lastWork: now }
            });

            const aiResponse = await generateEconomyResponse("sidejob", `Side job: ${randomJob}. Gaji: ${formatRupiah(salary)}.`);

            const finalMsg = aiResponse || `Lu kerja sampingan **${randomJob}** dan dapet **${formatRupiah(salary)}**!`;

            await interaction.followUp(finalMsg);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal kerja sampingan, coba lagi nanti.", ephemeral: true });
        }
    },
} as Command;
