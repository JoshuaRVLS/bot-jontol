import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { getUserData, removeWallet, setBounty, getBounty } from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { generateEconomyResponse } from "../../utils/aiHelper";

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("bounty")
        .setDescription("Pasang harga buat kepala orang (Biar dimaling mampus!)")
        .addUserOption(opt => opt.setName("target").setDescription("Orang yang mau di-bounty").setRequired(true))
        .addNumberOption(opt => opt.setName("reward").setDescription("Jumlah imbalan (Minimal 50rb)").setRequired(true)),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const target = interaction.options.getUser("target", true);
        const reward = interaction.options.getNumber("reward", true);
        const userId = interaction.user.id;

        if (target.id === userId) return interaction.reply({ content: "Ngapain bounty diri sendiri? Stress lu?", ephemeral: true });
        if (target.bot) return interaction.reply({ content: "Bot gak butuh bounty bang.", ephemeral: true });
        if (reward < 50000) return interaction.reply({ content: "Minimal bounty Rp50.000 lah bang biar bergengsi.", ephemeral: true });

        await interaction.deferReply();

        try {
            const userData = await getUserData(userId);
            if (userData.wallet < reward) {
                return interaction.followUp(`Duit lu gak cukup buat pasang bounty segitu! Lu cuma punya **${formatRupiah(userData.wallet)}**.`);
            }

            await removeWallet(userId, reward);
            await setBounty(target.id, reward, userId);

            const aiMsg = await generateEconomyResponse("bounty-place", `Placed a bounty of ${formatRupiah(reward)} on ${target.username}. Hunt them down!`);

            const embed = new EmbedBuilder()
                .setTitle("🎯 BOUNTY PLACED!")
                .setColor(0xFF4500)
                .setDescription(`Seseorang baru saja menaruh harga di kepala **${target.username}**!\n\n> **Reward:** ${formatRupiah(reward)}\n> **Hunting Grounds:** Gunakan \`/rob\` buat klaim bounty ini.\n\n${aiMsg || "Siap-siap dimaling lu bang!"}`)
                .setThumbnail(target.displayAvatarURL())
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.followUp("Gagal pasang bounty. Bandar lagi sibuk.");
        }
    },
} as Command;
