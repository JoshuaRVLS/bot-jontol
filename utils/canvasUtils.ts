import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import { User } from "discord.js";

// Register fonts if needed, or rely on system fonts
// GlobalFonts.registerFromPath('./path/to/font.ttf', 'MyFont');

export async function createRankCard(user: User, level: number, currentXp: number, requiredXp: number): Promise<Buffer> {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    // Background - Dark Gradient
    const gradient = ctx.createLinearGradient(0, 0, 700, 250);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#2b2b2b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 700, 250);

    // Decorative shapes (Glassmorphism effect)
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(650, -50, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 300, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Progress Bar Background
    const barX = 220;
    const barY = 160;
    const barWidth = 450;
    const barHeight = 30;
    const radius = 15;

    ctx.fillStyle = "#404040";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, radius);
    ctx.fill();

    // Progress Bar Fill
    const progress = Math.min(Math.max(currentXp / requiredXp, 0), 1);
    const fillWidth = Math.max(progress * barWidth, 30); // Min width for visibility

    ctx.fillStyle = "#00bfff"; // Deep Sky Blue
    ctx.beginPath();
    ctx.roundRect(barX, barY, fillWidth, barHeight, radius);
    ctx.fill();

    // Avatar Circle
    const avatarSize = 180;
    const avatarX = 25;
    const avatarY = 35;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const avatarURL = user.displayAvatarURL({ extension: "png", size: 256 });
    try {
        const avatar = await loadImage(avatarURL);
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    } catch (e) {
        console.error("Failed to load avatar:", e);
        // Fallback color
        ctx.fillStyle = "#7289da";
        ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
    ctx.restore();

    // Avatar Border
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#00bfff";
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Text: Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial"; // Using system font Arial
    ctx.fillText(user.username, barX, 80);

    // Text: Level & XP
    ctx.fillStyle = "#cccccc";
    ctx.font = "24px Arial";
    ctx.fillText(`Level: ${level}`, barX, 130);

    // XP Text aligned right
    const xpText = `${currentXp} / ${requiredXp} XP`;
    ctx.textAlign = "right";
    ctx.fillText(xpText, barX + barWidth, 130);

    // Watermark
    ctx.save();
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.2;
    ctx.textAlign = "right";
    ctx.fillText("JONTOL", 680, 230);
    ctx.restore();

    return canvas.toBuffer("image/png");
}
