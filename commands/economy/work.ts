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
        .setName("work")
        .setDescription("Kerja rodhi biar dapet duit!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN = 60 * 60 * 1000; // 60 minutes in ms
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

        if (user.lastWork) {
            const lastWork = new Date(user.lastWork);
            const diffTime = now.getTime() - lastWork.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const minutesLeft = Math.ceil(timeLeftMs / (1000 * 60));

                // Optional: AI for cooldown messages too?
                const aiMsg = await generateEconomyResponse("work-cooldown", `Player needs to wait ${minutesLeft} minutes more.`);

                await interaction.followUp({
                    content: aiMsg || `Lu capek bang, istirahat dulu! Bisa kerja lagi dalam **${minutesLeft} menit**.`,
                });
                return;
            }
        }

        // Base Salary 20k - 100k
        const baseSalary = Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000;
        const salary = applyBonus(baseSalary, mods.workBonus || 0);

        try {
            await addWallet(userId, salary);
            await db.user.update({
                where: { id: userId },
                data: { lastWork: now }
            });

            const aiResponse = await generateEconomyResponse("work", `Salary is ${formatRupiah(salary)}. Any random job like cleaning windows, coding, or street parking.`);

            let finalMsg = aiResponse || `Lu dapet gaji **${formatRupiah(salary)}**!`;

            // Add technical breakdown if mods exist
            if (mods.workBonus && mods.workBonus > 0) {
                finalMsg += `\n✨ (Bonus Item: +${Math.round(mods.workBonus * 100)}%)`;
            }

            await interaction.followUp(finalMsg);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal kerja, bos lari bawa duit.", ephemeral: true });
        }
    },
} as Command;
