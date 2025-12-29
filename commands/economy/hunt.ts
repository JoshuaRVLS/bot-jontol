import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { applyCooldown, getPlayerModifiers } from "../../utils/economyHelper";

interface AnimalData {
    name: string;
    emoji: string;
    price: number;
    rarity: number;
    dangerous: boolean;
}

const ANIMAL_LIST: AnimalData[] = [
    { name: "Tikus Got", emoji: "🐀", price: 5000, rarity: 0.20, dangerous: false },
    { name: "Ayam Hutan", emoji: "🐔", price: 10000, rarity: 0.20, dangerous: false },
    { name: "Kelinci", emoji: "🐰", price: 15000, rarity: 0.15, dangerous: false },
    { name: "Rusa", emoji: "🦌", price: 30000, rarity: 0.12, dangerous: false },
    { name: "Babi Hutan", emoji: "🐗", price: 40000, rarity: 0.10, dangerous: true },
    { name: "Buaya", emoji: "🐊", price: 60000, rarity: 0.08, dangerous: true },
    { name: "Harimau", emoji: "🐅", price: 100000, rarity: 0.05, dangerous: true },
    { name: "Komodo", emoji: "🦎", price: 150000, rarity: 0.03, dangerous: true },
    { name: "Naga Legendaris", emoji: "🐲", price: 500000, rarity: 0.01, dangerous: true }
];

const huntAnimal = (): AnimalData | null => {
    const missChance = 0.06;
    if (Math.random() < missChance) return null;

    const roll = Math.random();
    let cumulative = 0;

    for (const animal of ANIMAL_LIST) {
        cumulative += animal.rarity;
        if (roll <= cumulative) {
            return animal;
        }
    }

    return ANIMAL_LIST[0];
};

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("hunt")
        .setDescription("Berburu binatang di hutan!"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const userId = interaction.user.id;
        const user = await getUserData(userId);
        const mods = await getPlayerModifiers(userId);
        const now = new Date();

        const BASE_COOLDOWN = 30 * 60 * 1000;
        const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

        if (user.lastHunt) {
            const lastHunt = new Date(user.lastHunt);
            const diffTime = now.getTime() - lastHunt.getTime();

            if (diffTime < actualCooldownMs) {
                const timeLeftMs = actualCooldownMs - diffTime;
                const minutesLeft = Math.ceil(timeLeftMs / (1000 * 60));

                await interaction.followUp({
                    content: `🏹 Lu masih capek habis berburu. Istirahat dulu **${minutesLeft} menit**.`
                });
                return;
            }
        }

        await db.user.update({
            where: { id: userId },
            data: { lastHunt: now }
        });

        const animal = huntAnimal();

        if (!animal) {
            const embed = new EmbedBuilder()
                .setTitle("🏹 Hasil Berburu")
                .setDescription("Lu gak nemu binatang apapun... hutan lagi sepi.")
                .setColor(0x95A5A6);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        if (animal.dangerous && Math.random() < 0.25) {
            const damage = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
            const actualDamage = Math.min(damage, user.wallet);

            if (actualDamage > 0) {
                await removeWallet(userId, actualDamage);
            }

            const embed = new EmbedBuilder()
                .setTitle("🏹 Berburu Gagal!")
                .setDescription(`Lu diserang sama **${animal.emoji} ${animal.name}**!`)
                .addFields({ name: "💸 Biaya Pengobatan", value: formatRupiah(actualDamage) })
                .setColor(0xE74C3C);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        await addWallet(userId, animal.price);

        let rarityText = "⚪ Common";
        if (animal.rarity <= 0.01) rarityText = "🟡 Legendary";
        else if (animal.rarity <= 0.05) rarityText = "🟣 Epic";
        else if (animal.rarity <= 0.10) rarityText = "🔵 Rare";
        else if (animal.rarity <= 0.15) rarityText = "🟢 Uncommon";

        const embed = new EmbedBuilder()
            .setTitle("🏹 Hasil Berburu")
            .setDescription(`Lu berhasil berburu **${animal.emoji} ${animal.name}**!`)
            .addFields(
                { name: "💰 Nilai Jual", value: formatRupiah(animal.price), inline: true },
                { name: "✨ Rarity", value: rarityText, inline: true },
                { name: "⚠️ Bahaya", value: animal.dangerous ? "Ya" : "Tidak", inline: true }
            )
            .setColor(animal.rarity <= 0.05 ? 0xF1C40F : 0x2ECC71);

        await interaction.followUp({ embeds: [embed] });
    },
} as Command;
