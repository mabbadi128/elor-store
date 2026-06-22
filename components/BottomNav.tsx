"use client";

import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // عشان نعرف الصفحة الحالية
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // جلب الأعداد من الستورز
  const cartCount = useCartStore((state) => state.cartCount?.() || 0);
  const favoritesCount = useFavoriteStore((state) => state.favorites.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // دالة بسيطة للتحقق إذا كان الرابط نشطاً
  const isActive = (path: string) => pathname === path;

  if (!isMounted) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-gold/10 px-6 py-3 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        
        {/* الرئيسية */}
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-gold' : 'text-gray-500'}`}>
          <Home className={`w-6 h-6 ${isActive('/') ? 'fill-gold/20' : ''}`} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>

        {/* المتجر / التصنيفات */}
        <Link href="/shop" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/shop') ? 'text-gold' : 'text-gray-500'}`}>
          <LayoutGrid className={`w-6 h-6 ${isActive('/shop') ? 'fill-gold/20' : ''}`} />
          <span className="text-[10px] font-medium">المتجر</span>
        </Link>

        {/* السلة مع عداد */}
        <Link href="/cart" className={`relative flex flex-col items-center gap-1 transition-colors ${isActive('/cart') ? 'text-gold' : 'text-gray-500'}`}>
          <ShoppingBag className={`w-6 h-6 ${isActive('/cart') ? 'fill-gold/20' : ''}`} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">السلة</span>
        </Link>

        {/* المفضلة مع عداد */}
        <Link href="/favorites" className={`relative flex flex-col items-center gap-1 transition-colors ${isActive('/favorites') ? 'text-gold' : 'text-gray-500'}`}>
          <Heart className={`w-6 h-6 ${isActive('/favorites') ? 'fill-gold' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <span className="text-[10px] font-medium">المفضلة</span>
        </Link>

        {/* الحساب */}
        <Link href="/login" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/login') ? 'text-gold' : 'text-gray-500'}`}>
          <User className={`w-6 h-6 ${isActive('/login') ? 'fill-gold/20' : ''}`} />
          <span className="text-[10px] font-medium">حسابي</span>
        </Link>

      </div>
    </div>
  );
}