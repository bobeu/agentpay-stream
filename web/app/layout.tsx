import type { Metadata } from "next";
import "./globals.css";
import { PrivyProvider } from "@/components/PrivyProvider";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import OnboardingTrigger from "@/components/Onboarding/OnboardingTrigger";

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
        className={`font-mono antialiased bg-[#0F2A3A] text-[#E0E0E0]`}
      >
        <AnimatedBackground />
        <PrivyProvider>
          <Header />
          <main className="pt-20 relative z-10">
            {children}
          </main>
          <OnboardingTrigger />
        </PrivyProvider>
      </body>
    </html>
  );
}
