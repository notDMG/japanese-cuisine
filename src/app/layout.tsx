import type { Metadata } from "next";
import { Geist_Mono, Arimo } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/layout/Header";
import { siteConf } from "@/config/site.conf";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/auth";
import { AppLoader } from "@/hoc/app-loader";

const arimo = Arimo({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConf.title,
  description: siteConf.description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="min-h-full"> 
      <body
        className={`${arimo.className} ${geistMono.variable} antialiased min-h-full bg-white text-black`}
      >
        <SessionProvider session={session}>
          <AppLoader>
            <Header />
            <main className="w-full min-h-[calc(100vh-4rem)] flex items-start justify-center bg-white p-4">
              {children}
            </main>
          </AppLoader>
        </SessionProvider>
      </body>
    </html>
  );
}