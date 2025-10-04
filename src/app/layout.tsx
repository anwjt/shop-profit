import type { Metadata } from 'next';
import { Sarabun } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'Shop Profit Calc',
  description: "Calculate your product's selling price for Shopee, Lazada, and TikTok Shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sarabun.variable}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
