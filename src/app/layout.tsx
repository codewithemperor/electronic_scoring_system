import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electronic Scoring and Screening System - Adeseun Ogundoyin Polytechnic",
  description: "Comprehensive electronic scoring and screening system for candidate evaluation and admission processing",
  keywords: ["Adeseun Ogundoyin Polytechnic", "Screening System", "Admission", "Electronic Scoring", "Education"],
  authors: [{ name: "Adeseun Ogundoyin Polytechnic" }],
  openGraph: {
    title: "Electronic Scoring and Screening System",
    description: "Comprehensive electronic scoring and screening system for candidate evaluation and admission processing",
    siteName: "Adeseun Ogundoyin Polytechnic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electronic Scoring and Screening System",
    description: "Comprehensive electronic scoring and screening system for candidate evaluation and admission processing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
