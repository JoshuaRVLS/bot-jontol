import DiscordProvider from "next-auth/providers/discord";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: "1419327848660996116",
            clientSecret: "3x82qAodm6LGpVnf2grIkF7_gJaR3EHz",
            authorization: { params: { scope: "identify guilds" } },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (account?.provider === "discord") {
                const { prisma } = await import("@/lib/prisma");
                await prisma.user.upsert({
                    where: { id: user.id },
                    update: {
                        name: profile.username || user.name,
                        avatar: profile.image_url || user.image,
                    },
                    create: {
                        id: user.id,
                        name: profile.username || user.name,
                        avatar: profile.image_url || user.image,
                        bank: 0,
                        wallet: 100000,
                    },
                });
            }
            return true;
        },
        async session({ session, token }: any) {
            session.user.id = token.sub;
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, account }: any) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
    secret: "09071982",
    pages: {
        signIn: "/",
    },
};
