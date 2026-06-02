import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Hamza | Full Stack AI Engineer",
  description:
    "Full Stack AI Engineer specializing in RAG pipelines, scalable SaaS platforms, and zero-knowledge security systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${manrope.variable} dark h-full scroll-smooth antialiased`}
    >
      {/* Disable browser scroll restoration before any JS runs so ScrollTrigger
          always initialises at position 0 on hard refresh (F5). */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
      </head>
      <body className="min-h-full overflow-x-hidden bg-background font-sans text-foreground">
        <Providers>
          <CustomCursor />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
