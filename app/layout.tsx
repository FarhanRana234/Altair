import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALTAIR — AeroPakistan 2027",
  description:
    "ALTAIR is a student-led engineering team from NEDUET and CUST designing, building, and racing a next-generation glider for AeroPakistan 2027.",
  metadataBase: new URL("https://altair-aeropak.vercel.app"),
  openGraph: {
    title: "ALTAIR — AeroPakistan 2027",
    description:
      "ALTAIR is a student-led engineering team from NEDUET and CUST designing, building, and racing a next-generation glider for AeroPakistan 2027.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-space-deep text-platinum antialiased">
        {children}
      </body>
    </html>
  );
}