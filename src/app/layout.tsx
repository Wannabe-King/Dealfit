import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dealfit | Priyanshu Sidar",
    template: "%s | Dealfit",
  },
  description:
    "Dealfit is a full SaaS platform offering localized discounts and empowering businesses with analytics, subscription tiers, and customizable banners.",
  authors: [{ name: "Priyanshu Sidar", url: "https://priyanshu-sidar.me" }],
  icons: {
    icon: "/dealfit.svg",
  },
  keywords: [
    "Dealfit",
    "SaaS discounts",
    "localized discounts",
    "country specific discounts",
    "purchasing power parity discounts",
    "business analytics platform",
    "subscription management",
    "Stripe payments",
    "Clerk authentication",
    "Next.js SaaS",
    "Drizzle ORM",
    "PostgreSQL SaaS",
    "customizable banners",
    "multi country pricing",
    "SaaS for small business",
    "SaaS subscription tiers",
    "discount management platform",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-backgroud`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
