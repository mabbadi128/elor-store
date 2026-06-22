"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Star, ChevronRight, ShieldCheck, Truck, Loader2, Calendar, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string; 

  const addToCart = useCartStore((state) => state.addToCart);
  const formatCurrency = useCartStore((state) => state.formatCurrency);

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 🌟 حالات معرض الصور والأسهم
  const [activeImage, setActiveImage] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // حالات الخصم العام للموقع وعنوان المناسبة
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [discountTitle, setDiscountTitle] = useState("");

  useEffect(() => {
    const fetchProductAndSettings = async () => {
      if (!productId) return;
      
      setLoading(true);
      
      // 1. جلب تفاصيل المنتج
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (!productError && productData) {
        setProduct(productData);
        setActiveImage(productData.image);
        
        // 🌟 جلب الصور الثلاثة المختلفة المرفوعة، وإذا كانت فارغة نضع تكراراً ذكياً كـ حماية للكود
        const imagesList = productData.images && productData.images.length > 0 
          ? productData.images 
          : [productData.image, productData.image, productData.image];
          
        setProductImages(imagesList);
      }

      // 2. جلب إعدادات الخصم الشامل للموقع
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("global_discount, discount_title")
        .eq("id", 1)
        .single();

      if (settingsData) {
        setGlobalDiscount(settingsData.global_discount || 0);
        setDiscountTitle(settingsData.discount_title || "");
      }
      
      setLoading(false);
    };

    fetchProductAndSettings();
  }, [productId]);

  // 🌟 دالة التنقل عبر الأسهم (السهم التالي والسابق)
  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % productImages.length;
    setCurrentIndex(nextIdx);
    setActiveImage(productImages[nextIdx]);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + productImages.length) % productImages.length;
    setCurrentIndex(prevIdx);
    setActiveImage(productImages[prevIdx]);
  };

  // تحديث المؤشر الرقمي عند ضغط المستخدم على المربعات الصغيرة مباشرة
  const handleThumbnailClick = (imgUrl: string, idx: number) => {
    setActiveImage(imgUrl);
    setCurrentIndex(idx);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-gold gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="tracking-widest animate-pulse">جاري تحضير تفاصيل المنتج الفاخر...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col" dir="rtl">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-gold">المنتج غير موجود</h1>
          <Link href="/shop" className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-[#c5a035] transition-colors">
            العودة للمتجر
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const productDiscount = product.discount_percentage || 0;
  const activeDiscount = Math.max(productDiscount, globalDiscount);
  const hasDiscount = activeDiscount > 0;
  const isGlobalDiscountActive = globalDiscount > 0 && globalDiscount >= productDiscount;

  const finalPrice = hasDiscount 
    ? product.price - (product.price * activeDiscount / 100)
    : product.price;

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* شريط المسار */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-12">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-gold transition-colors">المتجر</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* قسم صور المنتج المطور مع الأسهم */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 group/gallery">
            
            {/* المربع الرئيسي الكبير */}
            <div className="relative aspect-square bg-[#050505] rounded-3xl overflow-hidden flex items-center justify-center border border-white/5 shadow-2xl">
              <Image 
                src={activeImage || product.image} 
                alt={product.name} 
                fill 
                unoptimized
                priority
                className={`object-cover transition-transform duration-700 ease-out ${product.is_coming_soon ? 'opacity-50' : ''}`} 
              />

              {/* 🌟 أسهم التنقل الاحترافية - تظهر عند تمرير الماوس فوق الكامبوننت */}
              <button 
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-3 rounded-full border border-white/10 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-gold hover:text-black hover:scale-110 z-30"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white p-3 rounded-full border border-white/10 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:bg-gold hover:text-black hover:scale-110 z-30"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* شارات زاوية الصورة */}
              <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 pointer-events-none">
                {hasDiscount && !product.is_coming_soon && (
                  <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg shadow-2xl animate-pulse font-mono">
                    -{activeDiscount}% خصم
                  </span>
                )}
                {product.is_coming_soon && (
                  <span className="bg-blue-500 text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg shadow-2xl flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> قريباً جداً
                  </span>
                )}
              </div>

              {/* مؤشر النقط الرقمي أسفل الصورة الكبيرة */}
              <div className="absolute bottom-4 flex gap-1.5 z-30 justify-center w-full">
                {productImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            {/* 🌟 معرض الـ 3 صور المختلفة المرفوعة أسفل الكرت الرئيسي */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(imgUrl, idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-[#050505] border transition-all duration-300 p-1 ${
                    currentIndex === idx 
                      ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-95" 
                      : "border-white/5 hover:border-gold/40"
                  }`}
                >
                  <Image 
                    src={imgUrl} 
                    alt={`زاوية عرض ${idx + 1}`} 
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* تفاصيل المنتج الجانبية */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-gold font-bold tracking-widest uppercase mb-4">{product.category}</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-400 text-lg italic mb-6">{product.subtitle}</p>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold" />)}
              </div>
              <span className="text-gray-500 text-sm">| 100+ زبونة سعيدة في الإمارات</span>
            </div>

            {/* عرض شارة المناسبة */}
            {hasDiscount && !product.is_coming_soon && isGlobalDiscountActive && discountTitle && (
              <div className="inline-flex items-center gap-2 bg-red-500/5 text-red-400 border border-red-500/10 px-4 py-2 rounded-xl text-sm font-medium mb-4 select-none">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{discountTitle}</span>
              </div>
            )}

            {/* عرض السعر الذكي */}
            {product.is_coming_soon ? (
              <div className="text-2xl font-bold text-blue-400 mb-8 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> هذا المنتج سيأتي قريباً لـ ELOR
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency ? formatCurrency(finalPrice) : `${finalPrice} AED`}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through font-medium">
                    {formatCurrency ? formatCurrency(product.price) : `${product.price} AED`}
                  </span>
                )}
              </div>
            )}
            
            <p className="text-gray-300 text-lg leading-relaxed mb-10 whitespace-pre-wrap">{product.desc}</p>

            <div className="flex flex-col sm:flex-row gap-6 mb-12 border-t border-white/10 pt-10">
              
              {/* عداد الكمية المشروط */}
              <div className={`flex items-center justify-between border border-white/10 rounded-2xl px-6 py-4 bg-white/5 sm:w-40 ${product.is_coming_soon ? 'opacity-30 pointer-events-none' : ''}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gold text-2xl font-bold hover:scale-110 transition-transform">-</button>
                <span className="text-xl font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gold text-2xl font-bold hover:scale-110 transition-transform">+</button>
              </div>

              {/* زر الشراء والتفاعل المشروط */}
              {product.is_coming_soon ? (
                <button 
                  disabled
                  className="flex-1 border border-blue-500/20 bg-blue-500/5 text-blue-400 py-4 rounded-2xl font-bold text-xl cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Calendar className="w-6 h-6" /> سيأتي قريباً
                </button>
              ) : (
                <button 
                  onClick={() => {
                    for(let i = 0; i < quantity; i++) {
                      addToCart({ id: product.id, name: product.name, price: finalPrice, image: product.image });
                    }
                    alert("تمت إضافة المنتج لـ حقيبة التسوق بنجاح! ✨");
                  }}
                  className="flex-1 bg-gold text-black py-4 rounded-2xl font-bold text-xl hover:bg-[#c5a035] shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-6 h-6" />
                  أضف للسلة
                </button>
              )}
            </div>

            {/* الميزات */}
            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Truck className="text-gold w-6 h-6" />
                <span className="text-sm text-gray-400">توصيل سريع ومجاني في الإمارات</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-gold w-6 h-6" />
                <span className="text-sm text-gray-400">ضمان جودة ونضارة ELOR الفاخرة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}