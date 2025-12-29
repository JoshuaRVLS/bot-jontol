import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { applyCooldown, getPlayerModifiers } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

const BEG_RESPONSES = {
    success: [
        "Seorang om-om kasihan dan kasih duit",
        "Anak kecil ngasih uang jajan dia",
        "Turis bule ngasih dollar yang lu tuker",
        "Ibu-ibu dermawan kasih recehan",
        "Pengamen ikutan kasihan dan berbagi"
    ],
    fail: [
        "Orang-orang cuek aja lewat",
        "Satpam ngusir lu dari tempat",
        "Ada yang bilang 'kerja dong!'",
        "Hujan deras, gak ada yang lewat",
        "Lu diketawain sama anak SD"
    ]
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Ngemis di pinggir jalan (no shame!)"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN = 10 * 60 * 1000;
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

        if (user.lastBeg) {
            const lastBeg = new Date(user.lastBeg);
            const diffTime = now.getTime() - lastBeg.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const minutesLeft = Math.ceil(timeLeftMs / (1000 * 60));

                await interaction.followUp({
                    content: `Jangan maruk ngemis! Tunggu **${minutesLeft} menit** lagi.`
                });
                return;
            }
        }

        await db.user.update({
            where: { id: userId },
            data: { lastBeg: now }
        });

        const success = Math.random() < 0.7;

        if (success) {
            const amount = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
            await addWallet(userId, amount);

            const scenario = BEG_RESPONSES.success[Math.floor(Math.random() * BEG_RESPONSES.success.length)];
            const aiMsg = await generateEconomyResponse("beg-success", `${scenario}. Dapat ${formatRupiah(amount)}.`);

            await interaction.followUp({
                content: aiMsg || `🙏 ${scenario} dan lu dapet **${formatRupiah(amount)}**!`
            });
        } else {
            const scenario = BEG_RESPONSES.fail[Math.floor(Math.random() * BEG_RESPONSES.fail.length)];
            const aiMsg = await generateEconomyResponse("beg-fail", `${scenario}. Tidak dapat apa-apa.`);

            await interaction.followUp({
                content: aiMsg || `😔 ${scenario}. Lu gak dapet apa-apa...`
            });
        }
    },
} as Command;
