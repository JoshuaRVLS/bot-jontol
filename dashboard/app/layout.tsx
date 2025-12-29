import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import { SocketProvider } from "@/components/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jontol Bot | Dashboard",
  description: "Manage your Jontol Bot instances and economy stats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
