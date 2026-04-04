import { Manrope, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "A clean personal portfolio website for selected work, services, and contact details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
