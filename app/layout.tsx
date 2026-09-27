import type { Metadata } from "next";
import { Bodoni_Moda, Lekton } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const mono = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALTAIR — wingspans beyond the stars.",
  description:
    "ALTAIR is a student-led engineering team from NEDUET and CUST designing, building, and racing a next-generation glider for AeroPakistan 2027.",
  openGraph: {
    title: "ALTAIR — wingspans beyond the stars.",
    description:
      "ALTAIR is a student-led engineering team from NEDUET and CUST designing, building, and racing a next-generation glider for AeroPakistan 2027.",
    type: "website",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260927-121040-7LkxshNfTORsVLqSgfhV5oXCV2U0Vc.png",
        width: 946,
        height: 394,
        alt: "altair logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-navy-bg text-white antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
