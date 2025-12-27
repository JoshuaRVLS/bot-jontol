import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData, removeWallet } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Lakukan kejahatan (High Risk High Reward)"),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const userId = interaction.user.id;
        const now = new Date();

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);

            // Cooldown 30 mins
            const lastCrimeCheck = userData.lastCrime ? new Date(userData.lastCrime).getTime() : 0;
            const cooldown = 30 * 60 * 1000;

            if (now.getTime() - lastCrimeCheck < cooldown) {
                const timeLeft = Math.ceil((cooldown - (now.getTime() - lastCrimeCheck)) / 1000 / 60);
                return interaction.followUp(`🚫 **COOLDOWN!** Polisi masih nyariin lu. Sembunyi dulu **${timeLeft} menit**.`);
            }

            const success = Math.random() < 0.45; // 45% chance

            const crimes = [
                { text: "rampok bank", reward: 50000, fine: 20000 },
                { text: "jual barang ilegal", reward: 25000, fine: 10000 },
                { text: "hack ATM", reward: 35000, fine: 15000 },
                { text: "nyolong motor", reward: 15000, fine: 5000 },
            ];

            const scenario = crimes[Math.floor(Math.random() * crimes.length)];

            // Update cooldown
            await prisma.user.update({
                where: { id: userId },
                data: { lastCrime: now }
            });

            if (success) {
                const reward = scenario.reward;
                await addWallet(userId, reward);
                await interaction.followUp(`😈 **SUKSES!** Lu berhasil **${scenario.text}** dan dapet **${formatRupiah(reward)}**!`);
            } else {
                const fine = scenario.fine;
                // Check if user has enough to pay fine, if not, wallet becomes 0 (or negative? let's stick to 0 min)
                const actualFine = userData.wallet < fine ? userData.wallet : fine;

                await removeWallet(userId, actualFine);
                await interaction.followUp(`🚔 **GAGAL!** Pas lu mau **${scenario.text}**, polisi dateng. Lu didenda **${formatRupiah(actualFine)}**.`);
            }

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: "Gagal berbuat jahat.", ephemeral: true });
        }
    },
} as Command;
