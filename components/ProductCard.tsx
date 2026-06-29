"use client";
import { toast } from "sonner";
import { Heart, ShoppingBag, Calendar, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; 

interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  subtitle: string;
  price: number;
  discount_percentage?: number;
  is_coming_soon?: boolean;
}

export default function ProductCard({ 
  id, image, name, subtitle, price, discount_percentage = 0, is_coming_soon = false 
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const formatCurrency = useCartStore((state) => state.formatCurrency);
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState(0); 
  const [discountTitle, setDiscountTitle] = useState(""); // 🌟 حالة لحفظ عنوان الخصم القادم من الإعدادات

  useEffect(() => {
    setIsMounted(true);

    // جلب الخصم الشامل وعنوان المناسبة للموقع بالكامل
    const fetchGlobalDiscount = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("global_discount, discount_title")
        .eq("id", 1)
        .single();
      
      if (!error && data) {
        setGlobalDiscount(data.global_discount || 0);
        setDiscountTitle(data.discount_title || ""); // 🌟 حفظ نص المناسبة
      }
    };

    fetchGlobalDiscount();
  }, []);

  // المقارنة الذكية: اختيار نسبة الخصم الأعلى
  const activeDiscount = Math.max(discount_percentage, globalDiscount);
  const hasDiscount = activeDiscount > 0;
  
  // هل الخصم المطبق حالياً هو الخصم العام للموقع؟ (عشان نعرض عنوان المناسبة بناءً عليه)
  const isGlobalDiscountActive = globalDiscount > 0 && globalDiscount >= discount_percentage;

  // حساب السعر النهائي بناءً على الخصم الفعال
  const finalPrice = hasDiscount 
    ? price - (price * activeDiscount / 100)
    : price;

  const isLiked = isMounted ? isFavorite(id as any) : false;

  return (
    <div className={`bg-transparent border rounded-2xl p-4 flex flex-col relative group transition-all duration-500 ${is_coming_soon ? 'border-blue-500/10 hover:border-blue-500/30' : 'border-white/5 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] hover:-translate-y-1'}`}>
      
      {/* شارات المنتج الفاخرة (فوق الصورة) */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 pointer-events-none">
        {hasDiscount && !is_coming_soon && (
          <span className="bg-red-500 text-white text-[14px] md:text-xs font-bold px-3 py-2 rounded-md shadow-lg animate-pulse font-mono">
  {activeDiscount}%
</span>
        )}
        
        {is_coming_soon && (
          <span className="bg-blue-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
            <Calendar className="w-3 h-3" /> قريباً
          </span>
        )}
      </div>

      {/* زر المفضلة */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite({ id: id as any, name, price: finalPrice, image, subtitle });
        }}
        aria-label="أضف للمفضلة"
       className={`absolute top-6 left-6 z-30 backdrop-blur-md p-2 rounded-full transition-all duration-300 ${
  isLiked 
    ? "text-gold bg-black/80 opacity-100 translate-y-0 shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
    : "text-gray-300 bg-black/50 opacity-100 translate-y-0 md:opacity-0 md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:text-gold hover:bg-black/80"
}`}
      >
        <Heart className={`w-4 h-4 transition-colors duration-300 ${isLiked ? "fill-gold" : ""}`} />
      </button>

      {/* رابط المنتج */}
      <Link href={`/product/${String(id)}`} className="cursor-pointer block">
        <div className="w-full aspect-square relative rounded-xl mb-5 overflow-hidden flex items-center justify-center bg-[#050505]">
          <Image 
            src={image} 
            alt={name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized 
            className={`object-cover transition-transform duration-700 ease-out ${is_coming_soon ? 'group-hover:scale-105 opacity-60' : 'group-hover:scale-110'}`} 
          />
        </div>

        <div className="text-center mb-4 px-1" dir="rtl" lang="ar">
  <h3 className="text-gold font-bold text-[13px] md:text-sm tracking-normal leading-[1.9] py-1 mb-1 opacity-80">
    {subtitle || "ELOR"}
  </h3>

  <h4 className="text-white text-sm md:text-base leading-[1.9] py-1 mb-3 min-h-[54px] overflow-visible">
    {name}
  </h4>
</div>
</Link>
      {/* قسم السعر وزر الإضافة */}
      <div className="text-center mt-auto">
        
        {/* 🌟 الإضافة الجديدة: عرض نص المناسبة فوق السعر إذا كان الخصم العام فعالاً */}
        {hasDiscount && !is_coming_soon && isGlobalDiscountActive && discountTitle && (
          <div className="text-[11px] text-red-400 font-medium mb-1.5 flex items-center justify-center gap-1 bg-red-500/5 py-1 rounded-md border border-red-500/10">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>{discountTitle}</span>
          </div>
        )}

        {/* عرض الأسعار السليم */}
        <div className="flex items-center justify-center gap-2 mb-4 leading-[1.8] py-1">
  <span className="text-gold font-bold text-lg leading-[1.8]">
    {formatCurrency(finalPrice)}
  </span>

  {hasDiscount && !is_coming_soon && (
    <span className="text-xs md:text-sm text-gray-500 line-through font-medium leading-[1.8]">
      {formatCurrency(price)}
    </span>
  )}
</div>
        {is_coming_soon ? (
          <button 
            disabled
            className="w-full border border-blue-500/20 bg-blue-500/5 text-blue-400 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" /> يأتي قريباً
          </button>
        ) : (
          <button 
  onClick={(e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart({ id: id as any, name, price: finalPrice, image });
    
    // ✅ إضافة التنبيه هنا
    toast.success("تمت الإضافة", {
      description: `تمت إضافة ${name} إلى سلة مشترياتك بنجاح`,
    });
  }}
  className="w-full relative overflow-hidden border border-gold/50 text-gold py-2.5 rounded-lg flex items-center justify-center gap-2 group/btn transition-colors duration-300 active:scale-95 text-sm font-medium hover:border-gold"
>
  <div className="absolute inset-0 w-full h-full bg-gold translate-x-full rtl:-translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out -z-10" />
  
  <ShoppingBag className="w-4 h-4 relative z-10 group-hover/btn:text-black transition-colors duration-300" />
  <span className="relative z-10 group-hover/btn:text-black transition-colors duration-300 font-bold leading-[1.8] py-[2px]">
  أضف للسلة
</span>
</button>
        )}
      </div>
    </div>
  );
}