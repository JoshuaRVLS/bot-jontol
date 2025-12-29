import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../types/type";
import { addWallet, getUserData } from "../../utils/Database";
import db from "../../utils/Database";
import { formatRupiah } from "../../utils/format";
import { getPlayerModifiers, applyBonus, applyCooldown } from "../../utils/economyHelper";
import { generateEconomyResponse } from "../../utils/aiHelper";

interface JobData {
    id: string;
    name: string;
    emoji: string;
    minSalary: number;
    maxSalary: number;
    levelRequired: number;
    description: string;
}

const JOBS: JobData[] = [
    {
        id: "kuli",
        name: "Kuli Bangunan",
        emoji: "🧱",
        minSalary: 150000,
        maxSalary: 250000,
        levelRequired: 1,
        description: "Kerja berat, hasil sepadan"
    },
    {
        id: "kasir",
        name: "Kasir Indomaret",
        emoji: "🏪",
        minSalary: 200000,
        maxSalary: 350000,
        levelRequired: 3,
        description: "Shift panjang, bonus senyum"
    },
    {
        id: "ojol",
        name: "Driver Ojol",
        emoji: "🏍️",
        minSalary: 250000,
        maxSalary: 400000,
        levelRequired: 5,
        description: "Keliling kota, dapet tips"
    },
    {
        id: "programmer",
        name: "Programmer",
        emoji: "💻",
        minSalary: 500000,
        maxSalary: 800000,
        levelRequired: 10,
        description: "Ngoding sampe subuh, gaji gede"
    },
    {
        id: "dokter",
        name: "Dokter",
        emoji: "🩺",
        minSalary: 800000,
        maxSalary: 1200000,
        levelRequired: 15,
        description: "Selamatkan nyawa, duit mengalir"
    },
    {
        id: "pengacara",
        name: "Pengacara",
        emoji: "⚖️",
        minSalary: 1000000,
        maxSalary: 1500000,
        levelRequired: 20,
        description: "Bicara dengan hukum, bayaran mahal"
    },
    {
        id: "ceo",
        name: "CEO Startup",
        emoji: "🚀",
        minSalary: 2000000,
        maxSalary: 3000000,
        levelRequired: 30,
        description: "Pimpin perusahaan, untung besar"
    },
    {
        id: "konglomerat",
        name: "Konglomerat",
        emoji: "💎",
        minSalary: 5000000,
        maxSalary: 8000000,
        levelRequired: 50,
        description: "Sultan sejati, duit gak masalah"
    }
];

const getJobById = (id: string): JobData | undefined => JOBS.find(j => j.id === id);

export default {
    type: "command",
    data: new SlashCommandBuilder()
        .setName("job")
        .setDescription("Sistem karir - kerja dengan gaji jutaan!")
        .addSubcommand(sub =>
            sub.setName("list")
                .setDescription("Lihat daftar karir yang tersedia")
        )
        .addSubcommand(sub =>
            sub.setName("apply")
                .setDescription("Melamar pekerjaan")
                .addStringOption(opt =>
                    opt.setName("karir")
                        .setDescription("Pilih karir yang mau dilamar")
                        .setRequired(true)
                        .addChoices(
                            ...JOBS.map(j => ({ name: `${j.emoji} ${j.name}`, value: j.id }))
                        )
                )
        )
        .addSubcommand(sub =>
            sub.setName("work")
                .setDescription("Kerja di pekerjaan saat ini")
        )
        .addSubcommand(sub =>
            sub.setName("resign")
                .setDescription("Resign dari pekerjaan saat ini")
        )
        .addSubcommand(sub =>
            sub.setName("info")
                .setDescription("Lihat info pekerjaan saat ini")
        ),
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const user = await getUserData(userId);

        if (subcommand === "list") {
            const embed = new EmbedBuilder()
                .setTitle("📋 Daftar Karir")
                .setDescription("Pilih karir yang sesuai dengan level kamu!")
                .setColor(0x5865F2);

            for (const job of JOBS) {
                const canApply = user.level >= job.levelRequired;
                const status = canApply ? "✅" : "🔒";
                embed.addFields({
                    name: `${job.emoji} ${job.name} ${status}`,
                    value: `💰 ${formatRupiah(job.minSalary)} - ${formatRupiah(job.maxSalary)}\n📊 Level ${job.levelRequired}+\n${job.description}`,
                    inline: true
                });
            }

            embed.setFooter({ text: `Level kamu: ${user.level}` });

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        if (subcommand === "apply") {
            const jobId = interaction.options.getString("karir", true);
            const job = getJobById(jobId);

            if (!job) {
                await interaction.followUp({ content: "Karir tidak ditemukan!", ephemeral: true });
                return;
            }

            if (user.job) {
                const currentJob = getJobById(user.job);
                await interaction.followUp({
                    content: `Lu udah kerja sebagai **${currentJob?.name || user.job}**. Resign dulu kalau mau pindah!`,
                    ephemeral: true
                });
                return;
            }

            if (user.level < job.levelRequired) {
                await interaction.followUp({
                    content: `Level lu belum cukup! Butuh **Level ${job.levelRequired}** untuk jadi **${job.name}**. Level lu sekarang: **${user.level}**`,
                    ephemeral: true
                });
                return;
            }

            await db.user.update({
                where: { id: userId },
                data: { job: jobId }
            });

            const embed = new EmbedBuilder()
                .setTitle(`${job.emoji} Selamat Bergabung!`)
                .setDescription(`Lu sekarang kerja sebagai **${job.name}**!`)
                .addFields(
                    { name: "💰 Gaji", value: `${formatRupiah(job.minSalary)} - ${formatRupiah(job.maxSalary)}`, inline: true },
                    { name: "⏰ Cooldown Kerja", value: "4 jam", inline: true }
                )
                .setColor(0x57F287);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        if (subcommand === "work") {
            if (!user.job) {
                await interaction.followUp({
                    content: "Lu belum punya pekerjaan! Pakai `/job apply` untuk melamar.",
                    ephemeral: true
                });
                return;
            }

            const job = getJobById(user.job);
            if (!job) {
                await interaction.followUp({ content: "Pekerjaan tidak valid!", ephemeral: true });
                return;
            }

            const mods = await getPlayerModifiers(userId);
            const now = new Date();
            const BASE_COOLDOWN = 4 * 60 * 60 * 1000;
            const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

            if (user.lastJobWork) {
                const lastWork = new Date(user.lastJobWork);
                const diffTime = now.getTime() - lastWork.getTime();

                if (diffTime < actualCooldownMs) {
                    const timeLeftMs = actualCooldownMs - diffTime;
                    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
                    const minutesLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

                    await interaction.followUp({
                        content: `Lu baru selesai shift. Istirahat dulu, bisa kerja lagi dalam **${hoursLeft} jam ${minutesLeft} menit**.`
                    });
                    return;
                }
            }

            const baseSalary = Math.floor(Math.random() * (job.maxSalary - job.minSalary + 1)) + job.minSalary;
            const salary = applyBonus(baseSalary, mods.workBonus || 0);

            await addWallet(userId, salary);
            await db.user.update({
                where: { id: userId },
                data: { lastJobWork: now }
            });

            const aiResponse = await generateEconomyResponse("job-work", `Kerja sebagai ${job.name}. Gaji: ${formatRupiah(salary)}.`);

            const embed = new EmbedBuilder()
                .setTitle(`${job.emoji} Shift Selesai!`)
                .setDescription(aiResponse || `Lu selesai kerja sebagai **${job.name}**!`)
                .addFields(
                    { name: "💰 Gaji", value: formatRupiah(salary), inline: true }
                )
                .setColor(0x57F287);

            await interaction.followUp({ embeds: [embed] });
            return;
        }

        if (subcommand === "resign") {
            if (!user.job) {
                await interaction.followUp({
                    content: "Lu gak punya pekerjaan yang bisa diresign!",
                    ephemeral: true
                });
                return;
            }

            const job = getJobById(user.job);

            await db.user.update({
                where: { id: userId },
                data: { job: null, lastJobWork: null }
            });

            await interaction.followUp({
                content: `Lu udah resign dari **${job?.name || user.job}**. Sekarang lu pengangguran! 😢`
            });
            return;
        }

        if (subcommand === "info") {
            if (!user.job) {
                await interaction.followUp({
                    content: "Lu belum punya pekerjaan! Pakai `/job list` untuk lihat daftar karir.",
                    ephemeral: true
                });
                return;
            }

            const job = getJobById(user.job);
            if (!job) {
                await interaction.followUp({ content: "Pekerjaan tidak valid!", ephemeral: true });
                return;
            }

            const mods = await getPlayerModifiers(userId);
            const BASE_COOLDOWN = 4 * 60 * 60 * 1000;
            const actualCooldownMs = applyCooldown(BASE_COOLDOWN, mods.cooldownReduction || 0);

            let workStatus = "✅ Bisa kerja sekarang!";
            if (user.lastJobWork) {
                const lastWork = new Date(user.lastJobWork);
                const diffTime = Date.now() - lastWork.getTime();
                if (diffTime < actualCooldownMs) {
                    const timeLeftMs = actualCooldownMs - diffTime;
                    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
                    const minutesLeft = Math.ceil((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
                    workStatus = `⏳ ${hoursLeft}j ${minutesLeft}m lagi`;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`${job.emoji} Info Pekerjaan`)
                .setDescription(job.description)
                .addFields(
                    { name: "📋 Posisi", value: job.name, inline: true },
                    { name: "💰 Gaji", value: `${formatRupiah(job.minSalary)} - ${formatRupiah(job.maxSalary)}`, inline: true },
                    { name: "⏰ Status Kerja", value: workStatus, inline: true }
                )
                .setColor(0x5865F2);

            await interaction.followUp({ embeds: [embed] });
        }
    },
} as Command;
