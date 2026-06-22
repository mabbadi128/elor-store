"use client";

import { Search, ShoppingBag, Menu, User, X, Heart, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; 

export default function Navbar() {
  const cartCount = useCartStore((state) => state.cartCount());
  const favoritesCount = useFavoriteStore((state) => state.favorites.length);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);

    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);
      
      if (currentUser && currentUser.user_metadata?.role === 'admin') {
        setIsAdmin(true);
      }
    };

    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      setIsAdmin(currentUser?.user_metadata?.role === 'admin');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gold/10 px-4 md:px-12 py-4 flex items-center justify-between">
        
        {/* الجزء الأيمن: التنقل */}
        <div className="flex items-center gap-4 w-1/4 md:w-1/3">
          <Menu 
            className="text-white w-6 h-6 md:hidden cursor-pointer hover:text-gold transition" 
            onClick={() => setIsMenuOpen(true)}
          />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-widest text-gray-400">
            <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
            <Link href="/shop" className="hover:text-gold transition">المتجر</Link>
            <Link href="/about" className="hover:text-gold transition">من نحن</Link>
          </div>
        </div>

        {/* الجزء الأوسط: الشعار */}
        <div className="flex flex-col items-center justify-center w-1/2 md:w-1/3 text-center">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-gold cursor-pointer">ELOR</h1>
          </Link>
        </div>

        {/* الجزء الأيسر: الأدوات */}
        <div className="flex items-center gap-4 md:gap-6 w-1/4 md:w-1/3 justify-end">
          <Search className="text-white w-5 h-5 cursor-pointer hover:text-gold transition hidden sm:block" />
          
          {/* زر لوحة التحكم (يظهر للأدمن فقط) */}
          {isAdmin && (
            <Link href="/admin" title="لوحة التحكم" className="hidden sm:flex items-center text-gold hover:text-white transition group">
              <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
          )}
          
          {/* المفضلة */}
          <Link href="/favorites" className="relative group hidden sm:block">
            <Heart className="text-white w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-gold transition" />
            {isMounted && favoritesCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-gold text-black text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* 🌟 أيقونة الحساب / الدخول اللي بتاخد الزبون لصفحة طلباته */}
          {user ? (
             <Link href="/profile" className="flex items-center gap-2 text-white hover:text-gold transition group">
               <User className="w-5 h-5 md:w-6 md:h-6" />
               <span className="hidden lg:block text-xs font-bold tracking-wider">
                 {user.user_metadata?.full_name?.split(' ')[0] || 'حسابي'}
               </span>
             </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-white hover:text-gold transition group">
              <User className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">دخول</span>
            </Link>
          )}

          {/* السلة */}
          <Link href="/cart" className="relative group">
            <ShoppingBag className="text-white w-5 h-5 md:w-6 md:h-6 cursor-pointer group-hover:text-gold transition" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-gold text-black text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* المنيو الخاصة بالجوال */}
      <div className={`fixed inset-0 z-[60] bg-black transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"} ${!isMenuOpen ? "invisible pointer-events-none" : "visible"} md:hidden`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-gold text-xl font-bold tracking-widest">ELOR</h2>
            <X className="text-white w-8 h-8 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
          </div>
          
          <div className="flex flex-col items-start w-full gap-8 text-2xl font-bold text-white mt-4" dir="rtl">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="w-full text-right hover:text-gold">الرئيسية</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="w-full text-right hover:text-gold">جميع المنتجات</Link>
            
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-start gap-4 text-gold hover:text-white">
                <LayoutDashboard className="w-6 h-6" />
                <span>لوحة التحكم</span>
              </Link>
            )}

            {/* 🌟 إضافة رابط حسابي للموبايل */}
            {user && (
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-start gap-4 hover:text-gold">
                <span>حسابي وطلباتي</span>
              </Link>
            )}

            <Link href="/favorites" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-start gap-4 hover:text-gold">
              <span>المفضلة</span>
              {isMounted && favoritesCount > 0 && (
                <span className="bg-gold text-black text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-start gap-4 hover:text-gold">
              <span>سلة المشتريات</span>
              {isMounted && cartCount > 0 && (
                <span className="bg-gold text-black text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="w-full text-right hover:text-gold">قصتنا</Link>
          </div>

          <div className="mt-auto border-t border-gold/10 pt-8">
            {user ? (
               <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 bg-white/10 text-white py-4 rounded-sm font-bold active:scale-95 transition-transform hover:bg-gold hover:text-black">
                 <User className="w-5 h-5" />
                 مرحباً، {user.user_metadata?.full_name?.split(' ')[0] || 'العميل'}
               </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 bg-gold text-black py-4 rounded-sm font-bold active:scale-95 transition-transform">
                <User className="w-5 h-5" />
                تسجيل الدخول / حسابي
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}