"use client";

import { useEffect, useState } from "react";
import { useFavoriteStore } from "@/store/favoriteStore";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavoriteStore();
  const [isMounted, setIsMounted] = useState(false);

  // حل مشكلة الـ Hydration لضمان أن البيانات تظهر فقط بعد تحميل الصفحة في المتصفح
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* رأس الصفحة */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">قائمة <span className="text-gold">المفضلة</span></h1>
            <p className="text-gray-400 max-w-md">
              المنتجات التي نالت إعجابك، محفوظة هنا لتتمكن من الوصول إليها واقتنائها في أي وقت.
            </p>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gold hover:text-white transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للتسوق
          </Link>
        </div>

        {/* حالة إذا كانت المفضلة فارغة */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-white/5 rounded-3xl bg-white/[0.02]">
            <div className="relative mb-6">
              <Heart className="w-20 h-20 text-gray-800" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gold/50" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-gray-500 mb-8 text-center max-w-xs">
              لم تقم بإضافة أي منتج للمفضلة بعد. ابدأ باستكشاف مجموعتنا الفاخرة!
            </p>
            <Link 
              href="/" 
              className="bg-gold text-black px-10 py-4 rounded-full font-bold hover:bg-gold-light transition-all active:scale-95"
            >
              اكتشف المنتجات
            </Link>
          </div>
        ) : (
          // عرض المنتجات المفضلة في شبكة (Grid)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  subtitle={product.subtitle}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}