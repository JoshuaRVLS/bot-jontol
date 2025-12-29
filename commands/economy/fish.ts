import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { applyCooldown, getPlayerModifiers } from "../../utils/economyHelper";

interface FishData {
    name: string;
    emoji: string;
    price: number;
    rarity: number;
}

const FISH_LIST: FishData[] = [
    { name: "Sampah Plastik", emoji: "🗑️", price: 0, rarity: 0.15 },
    { name: "Ikan Teri", emoji: "🐟", price: 5000, rarity: 0.25 },
    { name: "Ikan Lele", emoji: "🐟", price: 10000, rarity: 0.20 },
    { name: "Ikan Nila", emoji: "🐟", price: 15000, rarity: 0.15 },
    { name: "Ikan Kakap", emoji: "🐠", price: 25000, rarity: 0.10 },
    { name: "Ikan Salmon", emoji: "🐠", price: 35000, rarity: 0.07 },
    { name: "Ikan Tuna", emoji: "🐟", price: 45000, rarity: 0.05 },
    { name: "Ikan Hiu", emoji: "🦈", price: 100000, rarity: 0.02 },
    { name: "Ikan Legendaris", emoji: "🐉", price: 250000, rarity: 0.01 }
];

const catchFish = (): FishData => {
    const roll = Math.random();
    let cumulative = 0;

    for (const fish of FISH_LIST) {
        cumulative += fish.rarity;
        if (roll <= cumulative) {
            return fish;
        }
    }

    return FISH_LIST[0];
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("fish")
        .setDescription("Mancing ikan buat dijual!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN = 20 * 60 * 1000;
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

        if (user.lastFish) {
            const lastFish = new Date(user.lastFish);
            const diffTime = now.getTime() - lastFish.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const minutesLeft = Math.ceil(timeLeftMs / (1000 * 60));

                await interaction.followUp({
                    content: `🎣 Ikan-ikan lagi istirahat. Coba lagi dalam **${minutesLeft} menit**.`
                });
                return;
            }
        }

        await db.user.update({
            where: { id: userId },
            data: { lastFish: now }
        });

        const fish = catchFish();

        if (fish.price === 0) {
            const embed = new EmbedBuilder()
                .setTitle("🎣 Hasil Mancing")
                .setDescription(`Lu dapet... **${fish.emoji} ${fish.name}**`)
                .addFields({ name: "💰 Nilai Jual", value: "Gak laku bruh 💀" })
                .setColor(0x95A5A6);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        await addWallet(userId, fish.price);

        let rarityText = "⚪ Common";
        if (fish.rarity <= 0.01) rarityText = "🟡 Legendary";
        else if (fish.rarity <= 0.05) rarityText = "🟣 Epic";
        else if (fish.rarity <= 0.10) rarityText = "🔵 Rare";
        else if (fish.rarity <= 0.20) rarityText = "🟢 Uncommon";

        const embed = new EmbedBuilder()
            .setTitle("🎣 Hasil Mancing")
            .setDescription(`Lu dapet **${fish.emoji} ${fish.name}**!`)
            .addFields(
                { name: "💰 Nilai Jual", value: formatRupiah(fish.price), inline: true },
                { name: "✨ Rarity", value: rarityText, inline: true }
            )
            .setColor(fish.rarity <= 0.05 ? 0xF1C40F : 0x3498DB);

        await interaction.followUp({ embeds: [embed] });
    },
} as Command;
