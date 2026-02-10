import type { Metadata } from "next";
import { Geist_Mono, Arimo } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/layout/Header";
import { SiteConf } from "@/config/site.conf";
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
  title: SiteConf.title,
  description: SiteConf.description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body
        className={`${arimo.className} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <AppLoader>
            <Header/>
              <main className="className='w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-white/95">
                {children}
              </main>
          </AppLoader>   
        </SessionProvider>      
      </body>
    </html>
  );
}