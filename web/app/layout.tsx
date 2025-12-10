import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@/components/PrivyProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentPay Stream - Micro-Streaming Payments",
  description: "Decentralized micro-streaming payment application on Movement L1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#12121F] text-[#E0E0E0]`}
      >
        <PrivyProvider>
          <Header />
          <main className="pt-20">
            {children}
          </main>
        </PrivyProvider>
      </body>
    </html>
  );
}
