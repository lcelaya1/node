import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CollectionsProvider } from "@/context/CollectionsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canopi",
  description: "Share Memorable Moments with your Friends",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-100`}>
        <CollectionsProvider>
          <div className="phone-container shadow-2xl bg-white">
            {children}
          </div>
        </CollectionsProvider>
      </body>
    </html>
  );
}
