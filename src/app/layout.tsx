import type { Metadata } from "next";
import { Geist_Mono, Arimo } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/Header";
import { SiteConf } from "@/config/site.conf";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arimo.className} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
