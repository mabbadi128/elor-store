import type { Metadata } from "next";
import "./globals.css";

import BottomNav from "@/components/BottomNav";
import { Toaster } from "sonner";
import { Cairo, Bodoni_Moda } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo-main",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELOR",
  description: "ELOR Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${bodoni.variable}`}
    >
      <body className="bg-black text-white antialiased pb-16 md:pb-0">
        {children}

        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{
            style: {
              background: "#000",
              border: "1px solid #D4AF37",
              color: "#fff",
            },
          }}
        />

        <BottomNav />
      </body>
    </html>
  );
}