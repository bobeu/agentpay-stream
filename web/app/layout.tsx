import type { Metadata } from "next";
import "./globals.css";
// import { PrivyProvider } from "@/components/PrivyProvider";
// import { ClientAptosWalletProvider } from "@/components/ClientAptosWalletProvider";
import { AptosWalletProvider } from "@/components/providers/AptosWalletProvider";
import { Toaster }from "react-hot-toast";
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
        <AptosWalletProvider>
          <Header />
          <main className="pt-20 relative z-10">
            {children}
          </main>
          {/* Custom styled toaster to match your theme */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A3A4A',
                color: '#00FFFF',
                border: '1px solid #00FFFF',
                fontSize: '14px',
                borderRadius: '8px',
              },
              success: {
                iconTheme: { primary: '#00FFFF', secondary: '#1A3A4A' },
              },
              error: {
                style: { border: '1px solid #FF6600', color: '#FF6600' },
                iconTheme: { primary: '#FF6600', secondary: '#1A3A4A' },
              },
            }}
          />
          <OnboardingTrigger />
        </AptosWalletProvider>
      </body>
    </html>
  );
}












