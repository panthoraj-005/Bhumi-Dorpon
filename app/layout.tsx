import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import { DemoBanner } from "@/components/DemoBanner";
import { AppSidebar } from "@/components/AppSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BhumiDorpon | Bangladesh Land-Change Records Dashboard",
  description:
    "Cadastral land-change monitoring dashboard covering river erosion, flood, landslide, char formation, and coastal shifts across Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg text-ink min-h-screen antialiased flex flex-col font-sans">
        <QueryProvider>
          {/* Top Demo Banner across every page */}
          <DemoBanner />

          {/* App Shell Container */}
          <div className="flex-1 flex w-full">
            {/* 72px Fixed Icon Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 pl-[72px] flex flex-col">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
