import type { Metadata } from "next";
import "./globals.css";

import SiteNavigation from "@/components/SiteNavigation";

export const metadata: Metadata = {
  title: "Dr Nutrition",
  description: "Health and Nutrition Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <SiteNavigation />

        <main className="pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
