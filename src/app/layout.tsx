import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electronic Scoring and Screening System - Adeseun Ogundoyin Polytechnic Eruwa",
  description: "Modern electronic scoring and screening system for Adeseun Ogundoyin Polytechnic Eruwa. Automate candidate evaluation, reduce processing time, and enhance admission accuracy.",
  keywords: ["Electronic Scoring", "Screening System", "Admission", "Polytechnic", "Education", "AOPE Eruwa"],
  authors: [{ name: "Adeseun Ogundoyin Polytechnic Eruwa" }],
  openGraph: {
    title: "Electronic Scoring and Screening System - AOPE Eruwa",
    description: "Automated candidate evaluation system for Adeseun Ogundoyin Polytechnic Eruwa",
    url: "https://aope.edu.ng",
    siteName: "AOPE Eruwa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electronic Scoring System - AOPE Eruwa",
    description: "Automated candidate evaluation system for Adeseun Ogundoyin Polytechnic Eruwa",
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
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
