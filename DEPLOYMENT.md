# VPS Deployment Guide

Step-by-step guide to hosting your Discord bot on a VPS.

## 1. Prerequisites
- Node.js (v18+) installed on VPS.
- `pnpm` installed (`npm install -g pnpm`).
- `pm2` installed for process management (`npm install -g pm2`).

## 2. Setup
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd bot-jontol
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Setup Environment Variables:
   Create a `.env` file in the root directory and copy the contents from your local `.env`.
   ```bash
   nano .env
   ```
4. Generate Prisma Client:
   ```bash
   pnpm run build
   ```

## 3. Running the Bot
Use `pm2` to keep the bot running in the background:
```bash
pm2 start pnpm --name "bot-jontol" -- run start
```

### Useful PM2 Commands:
- `pm2 logs bot-jontol`: Check logs.
- `pm2 restart bot-jontol`: Restart the bot.
- `pm2 stop bot-jontol`: Stop the bot.
- `pm2 status`: Show all running processes.

## 4. Keeping it alive after reboot
```bash
pm2 startup
pm2 save
```
