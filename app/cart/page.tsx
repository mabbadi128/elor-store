"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from "lucide-react"; 
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); 

  // استدعاء الدالات المحدثة والجديدة من الستور
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubTotalPrice = useCartStore((state) => state.getSubTotalPrice); // مجموع المنتجات
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);     // رسوم التوصيل الـ 20 درهم
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);       // Mجموع النهائي الشامل
  const formatCurrency = useCartStore((state) => state.formatCurrency);

  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoadingAuth(false);
    };

    checkUser();
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black flex flex-col relative z-10">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-gold/20 mb-6" />
          <h2 className="text-white text-xl md:text-2xl font-bold mb-4">سلة المشتريات فارغة</h2>
          <p className="text-gray-400 mb-8 text-center text-sm md:text-base">يبدو أنكِ لم تضفي أي منتجات لجمالك بعد.</p>
          <Link href="/shop" className="bg-gold text-black px-10 py-3 md:px-12 md:py-4 rounded-sm font-bold hover:bg-gold-light transition-all active:scale-95">
            ابدئي التسوق
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center justify-between mb-10 border-r-4 border-gold pr-4">
            <h1 className="text-3xl font-bold text-gold">سلة المشتريات</h1>
            <span className="text-gray-400 text-sm">{items.length} منتجات</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* قائمة المنتجات - الجزء الأيمن */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: any) => {
              // حساب ما إذا كان المنتج يحتوي على سعر أصلي قديم (قبل الخصم) مخزن بالستور
              const hasDiscount = item.originalPrice && item.originalPrice > item.price;

              return (
                <div key={item.id} className="bg-card border border-gold/10 p-4 rounded-lg flex items-center gap-4 md:gap-6 hover:border-gold/30 transition-all">
                  {/* صورة المنتج */}
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-black rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  
                  {/* تفاصيل المنتج */}
                  <div className="flex-1">
                    <h3 className="text-gold font-bold text-lg mb-1 tracking-wide">ELOR</h3>
                    <h4 className="text-white text-sm md:text-base mb-3">{item.name}</h4>
                    
                    <div className="flex items-center gap-6">
                      {/* أزرار التحكم بالكمية */}
                      <div className="flex items-center border border-gold/20 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, 'plus')}
                          className="px-3 py-1 hover:text-gold transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 border-x border-gold/20 text-sm font-bold text-gold">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 'minus')}
                          className="px-3 py-1 hover:text-gold transition-colors disabled:text-gray-700"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* زر الحذف */}
                      <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:block">حذف</span>
                      </button>
                    </div>
                  </div>

                  {/* 🌟 تعديل عرض السعر: إظهار السعر القديم والجديد بناءً على الكمية المحددة */}
                  <div className="text-left flex flex-col items-end justify-center">
                    <span className="font-bold text-gold md:text-xl">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through mt-1">
                        {formatCurrency(item.originalPrice * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ملخص الطلب المحدث - الجزء الأيسر */}
          <div className="relative">
            <div className="bg-card border border-gold/20 p-8 rounded-lg sticky top-32">
                <h2 className="text-xl font-bold mb-6 border-b border-gold/10 pb-4">ملخص الطلب</h2>
                
                <div className="space-y-4 mb-8 text-gray-400">
                <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span className="text-white">{formatCurrency(getSubTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة</span>
                    <span className="text-white">مشمولة</span>
                </div>
                <div className="flex justify-between">
                    <span>التوصيل في الإمارات</span>
                    <span className="text-white font-medium">{formatCurrency(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-gold/10">
                    <span>الإجمالي الكلي</span>
                    <span className="text-gold">{formatCurrency(getTotalPrice())}</span>
                </div>
                </div>
                
                {/* شرط تسجيل الدخول والتوجيه */}
                {loadingAuth ? (
                  <div className="flex justify-center py-4 mb-4">
                    <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  </div>
                ) : user ? (
                  <Link 
                    href="/checkout" 
                    className="w-full flex items-center justify-center bg-gold text-black py-4 rounded-sm font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/10 active:scale-95 mb-4"
                  >
                    التقدم لإتمام الطلب
                  </Link>
                ) : (
                  <button 
                    onClick={() => router.push('/login?redirect=/checkout')}
                    className="w-full flex items-center justify-center border border-gold text-gold py-4 rounded-sm font-bold hover:bg-gold hover:text-black transition-all active:scale-95 mb-4"
                  >
                    تسجيل الدخول للمتابعة
                  </button>
                )}
                
                <Link href="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gold transition-all text-sm group">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> العودة للتسوق
                </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}