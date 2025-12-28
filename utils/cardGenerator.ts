import { createCanvas, loadImage, GlobalFonts, Image } from "@napi-rs/canvas";
import { GuildMember } from "discord.js";
import path from "path";

// Register fonts if needed (default ones are usually okay, but a custom one looks better)
// GlobalFonts.registerFromPath(path.join(process.cwd(), "assets/fonts/Inter-Bold.ttf"), "Inter");

export const generateCard = async (member: GuildMember, type: "welcome" | "leave") => {
    const canvas = createCanvas(1080, 400);
    const ctx = canvas.getContext("2d");

    // 1. Load Background
    const backgroundPath = path.join(process.cwd(), "assets", `${type}.png`);
    const background = await loadImage(backgroundPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // 2. Add Overlay (Darken slightly for readability)
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw Avatar
    const avatarSize = 180;
    const x = canvas.width / 2 - avatarSize / 2;
    const y = 50;

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatarUrl = member.user.displayAvatarURL({ extension: "png", size: 256 });
    const avatar = await loadImage(avatarUrl);
    ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
    ctx.restore();

    // 4. Add Border to Avatar
    ctx.strokeStyle = type === "welcome" ? "#a855f7" : "#06b6d4"; // Purple for welcome, Cyan for leave
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, y + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2, true);
    ctx.stroke();

    // 5. Draw Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    // Header
    ctx.font = "bold 50px sans-serif";
    ctx.fillText(type === "welcome" ? "WELCOME" : "GOODBYE", canvas.width / 2, 280);

    // Username
    ctx.font = "40px sans-serif";
    ctx.fillStyle = type === "welcome" ? "#e9d5ff" : "#cffafe"; // Lighter tints
    ctx.fillText(member.user.tag.toUpperCase(), canvas.width / 2, 335);

    // Subtext
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    const subtext = type === "welcome"
        ? `You are member #${member.guild.memberCount}`
        : "Hope to see you again soon!";
    ctx.fillText(subtext, canvas.width / 2, 375);

    return canvas.toBuffer("image/png");
};
