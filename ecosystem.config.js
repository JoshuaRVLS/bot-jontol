module.exports = {
    apps: [
        {
            name: "jontol-bot",
            script: "npx",
            args: "tsx index.ts",
            cwd: "./",
            env: {
                NODE_ENV: "production",
                BOT_API_PORT: 8000
            }
        },
        {
            name: "jontol-dashboard",
            script: "npm",
            args: "start",
            cwd: "./dashboard",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                BOT_API_URL: "http://localhost:8000"
            }
        }
    ]
};
