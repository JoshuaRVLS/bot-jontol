import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "jblog.space",
        "*.jblog.space",
        "localhost",
    ],
};

export default nextConfig;
