import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const heading = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL ?? "https://rentworx-client.vercel.app";
const description =
  "RentWorx connects equipment owners and customers through a transparent, secure rental marketplace.";

export const metadata: Metadata = {
  title: {
    default: "RentWorx | Equipment Rental Platform",
    template: "%s | RentWorx",
  },
  description,
  applicationName: "RentWorx",
  openGraph: {
    type: "website",
    siteName: "RentWorx",
    title: "RentWorx | Equipment Rental Platform",
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "RentWorx | Equipment Rental Platform",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
