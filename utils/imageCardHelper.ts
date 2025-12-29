import { createCanvas, loadImage, GlobalFonts, SKRSContext2D } from "@napi-rs/canvas";
import { User as DiscordUser } from "discord.js";
import { formatCompactRupiah } from "./format";

// Register fonts if needed, for now we use system sans-serif
// GlobalFonts.registerFromPath("./assets/fonts/Inter-Bold.ttf", "Inter");

export const createBalanceCard = async (user: DiscordUser, userData: { wallet: number, bank: number, investment: number }) => {
    const width = 800;
    const height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 1. Background - Premium Dark Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative elements (subtle glowing circles)
    drawGlowCircle(ctx, 700, 100, 150, "#4ecca333");
    drawGlowCircle(ctx, 100, 350, 200, "#4534af33");

    // 3. Card Base (Glassmorphism effect)
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.roundRect(40, 40, width - 80, height - 80, 25);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    // 4. User Avatar
    try {
        const avatarUrl = user.displayAvatarURL({ extension: "png", size: 256 });
        const avatarImage = await loadImage(avatarUrl);

        ctx.save();
        ctx.beginPath();
        ctx.arc(130, 140, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 70, 80, 120, 120);
        ctx.restore();

        // Avatar border glow
        ctx.beginPath();
        ctx.arc(130, 140, 60, 0, Math.PI * 2);
        ctx.strokeStyle = "#4ecca3";
        ctx.lineWidth = 3;
        ctx.stroke();
    } catch (e) {
        console.warn("Could not load user avatar for balance card", e);
    }

    // 5. Text - Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(user.username.toUpperCase(), 210, 135);

    const netWorth = userData.wallet + userData.bank + userData.investment;
    const { status, color } = getEconomyStatus(netWorth);

    ctx.fillStyle = color;
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`STATUS: ${status}`, 210, 170);

    // 6. Balance Sections
    const startY = 240;

    // Wallet
    drawBalanceRow(ctx, "CASH ON HAND", formatCompactRupiah(userData.wallet), 80, startY, "#ffffff");

    // Bank
    drawBalanceRow(ctx, "BANK SAVINGS", formatCompactRupiah(userData.bank), 310, startY, "#ffffff");

    // Stocks
    drawBalanceRow(ctx, "STOCKS & ASSETS", formatCompactRupiah(userData.investment), 540, startY, "#4ecca3");

    // Total Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.moveTo(80, 320);
    ctx.lineTo(width - 80, 320);
    ctx.stroke();

    ctx.fillStyle = "#4ecca3";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("NET WORTH", 80, 365);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    const totalText = formatCompactRupiah(netWorth);
    const totalWidth = ctx.measureText(totalText).width;
    ctx.fillText(totalText, width - 80 - totalWidth, 365);

    // 7. Watermark
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.font = "italic 16px sans-serif";
    ctx.fillText("JONTOL BOT ECONOMY", 80, 400);

    return canvas.toBuffer("image/png");
};

const drawBalanceRow = (ctx: SKRSContext2D, label: string, value: string, x: number, y: number, color: string) => {
    ctx.fillStyle = "#a2a2a2";
    ctx.font = "18px sans-serif";
    ctx.fillText(label, x, y);

    ctx.fillStyle = color;
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(value, x, y + 45);
};

const drawGlowCircle = (ctx: SKRSContext2D, x: number, y: number, radius: number, color: string) => {
    const radial = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radial.addColorStop(0, color);
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
};

const getEconomyStatus = (total: number): { status: string, color: string } => {
    if (total >= 100000000) return { status: "KASTA SULTAN", color: "#FFD700" }; // Gold
    if (total >= 10000000) return { status: "KASTA TINGGI", color: "#00E5FF" };  // Cyan
    if (total >= 1000000) return { status: "KASTA MENENGAH", color: "#4ecca3" }; // Green
    return { status: "KASTA RENDAH", color: "#a2a2a2" }; // Gray
};
