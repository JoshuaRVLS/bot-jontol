import dotenv from "dotenv";
import path from "path";

// Coba load .env dari root folder
const result = dotenv.config({ path: path.join(process.cwd(), ".env") });

if (result.error) {
    console.warn("Gagal load file .env:", result.error);
}

interface Config {
    TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    DATABASE_URL: string;
    OPENROUTER_KEY: string;
}

const requiredEnvVars = [
    "TOKEN",
    "CLIENT_ID",
    "GUILD_ID",
    "DATABASE_URL",
    "OPENROUTER_KEY",
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar} (Cek file .env nya bang, pastikan ada valuenya)`);
    }
}

export const config: Config = {
    TOKEN: process.env.TOKEN!,
    CLIENT_ID: process.env.CLIENT_ID!,
    GUILD_ID: process.env.GUILD_ID!,
    DATABASE_URL: process.env.DATABASE_URL!,
    OPENROUTER_KEY: process.env.OPENROUTER_KEY!,
};
