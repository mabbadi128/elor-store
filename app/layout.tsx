import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "sonner"; // 1. استيراد المكتبة

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "ELOR | متجر مستحضرات التجميل الفاخرة",
  description: "جمالك يستحق الأفضل - منتجات فاخرة للعناية متكاملة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-black text-white antialiased pb-16 md:pb-0`}>
        {children}
        
        {/* 2. إضافة التوستر هنا ليظهر في كامل الموقع */}
        <Toaster 
          position="bottom-center" 
          richColors 
          toastOptions={{
            style: {
              background: '#000',
              border: '1px solid #D4AF37', // لون ذهبي ليتناسب مع هوية ELOR
              color: '#fff',
            },
          }}
        />
        
        <BottomNav />
      </body>
    </html>
  );
}