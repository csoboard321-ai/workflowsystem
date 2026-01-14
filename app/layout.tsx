import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import LiffProvider from "../components/LiffProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"], variable: "--font-thai" });

export const metadata: Metadata = {
  title: "Workflow System",
  description: "Tasks forwarding app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansThai.variable} antialiased bg-[#F9FAFB] text-slate-900`}
      >
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
