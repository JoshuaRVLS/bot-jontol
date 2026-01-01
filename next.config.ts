import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    allowedDevOrigins: [
        "jblog.space",
        "*.jblog.space",
        "localhost",
    ],
};

export default nextConfig;
