"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Droplets, Leaf, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase"; // استيراد اتصال قاعدة البيانات

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 حالات الإعلانات الشاملة للموقع
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [discountTitle, setDiscountTitle] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      
      // 1. جلب المنتجات الأكثر مبيعاً من Supabase
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('is_best_seller', true)
        .limit(3);

      if (productsData) {
        setBestSellers(productsData);
      }

      // 2. 🌟 جلب الخصم العام ونص المناسبة للموقع من الـ site_settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('global_discount, discount_title')
        .eq('id', 1)
        .single();

      if (settingsData) {
        setGlobalDiscount(settingsData.global_discount || 0);
        setDiscountTitle(settingsData.discount_title || "");
      }

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      
      {/* 🌟 شريط الإعلانات الفاخر للمناسبات والأعياد (معدل ليعرض النص المكتوب ديناميكياً) */}
      {globalDiscount > 0 && (
        <div className="w-full bg-gradient-to-r from-[#b38f2e] via-gold to-[#b38f2e] text-black text-center py-2.5 px-4 text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg animate-fade-in relative z-50 select-none">
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          <span>
            {discountTitle ? `${discountTitle} ` : "عرض خاص من ELOR: "} 
            بنسبة {globalDiscount}% يطبق تلقائياً عند السلة على جميع المنتجات الفاخرة! ✨
          </span>
        </div>
      )}

      <Navbar />

      {/* 1. قسم الهيرو (Hero) */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col justify-center px-6 md:px-16 pt-20 overflow-hidden group">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
          <Image
            src="/images/hero/10.jpg"
            alt="ELOR Luxury UAE"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_70%] opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[10000ms] ease-out"
          />
        </div>

        <div className="relative z-10 w-full md:w-1/2 text-center md:text-right mt-10 md:mt-0">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fff5d1] text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-2">
            ELOR
          </h2>
          <p className="text-white text-lg md:text-2xl tracking-[0.3em] mb-6 uppercase">
            Luxury You Can Feel
          </p>
          <p className="text-gray-300 mb-10 max-w-sm mx-auto md:mx-0 text-base md:text-lg leading-relaxed">
            اكتشفي سر الجمال الإماراتي الفاخر - منتجات مختارة بعناية لتمنح بشرتك العناية التي تستحقها بخلاصات طبيعية نادرة.
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center bg-gold text-black px-10 md:px-14 py-4 rounded-full font-bold hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 active:scale-95">
            ابدئي رحلة الجمال
          </Link>
        </div>
      </section>

      {/* 2. قسم الميزات */}
      <section className="bg-black py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32 border-b border-white/5 pb-20">
            <div className="flex flex-col items-center text-center group">
              <ShieldCheck className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-1">تسوق آمن</h3>
              <p className="text-gray-500 text-xs">دفع إلكتروني مشفر وموثوق</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <Truck className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-1">توصيل سريع</h3>
              <p className="text-gray-500 text-xs">خلال 24-48 ساعة في الإمارات</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <Droplets className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-1">نتائج فورية</h3>
              <p className="text-gray-500 text-xs">نضارة تلاحظينها من أول استخدام</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <Leaf className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-1">مكونات عضوية</h3>
              <p className="text-gray-500 text-xs">خالية من المواد الكيميائية الضارة</p>
            </div>
          </div>

          {/* التصنيفات */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 mb-20 relative z-30">
            {[
              { name: "عناية بالجسم", img: "/images/products/1.jpg" },
              { name: "عناية بالبشرة", img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=400" },
              { name: "عناية بالشعر", img: "/images/products/2.jpg" },
              { name: "مجموعة الهدايا", img: "/images/products/3.jpg" }
            ].map((cat) => (
              <Link key={cat.name} href={`/shop?category=${cat.name}`} className="flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 border border-white/10 group-hover:border-gold transition-all duration-500 mb-4 overflow-hidden">
                  <div className="w-full h-full relative rounded-full overflow-hidden">
                    <Image 
                      src={cat.img} 
                      alt={cat.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 150px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                </div>
                <span className="text-white text-sm font-medium group-hover:text-gold transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. قسم الأكثر مبيعاً - ديناميكي من Supabase */}
      <section className="bg-black py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute w-full h-[1px] bg-white/5"></div>
            <h2 className="relative bg-black px-8 text-2xl md:text-4xl font-bold">
              الأكثر <span className="text-gold">مبيعاً</span> في الإمارات
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-2xl">
              لا توجد منتجات مميزة حالياً. قم بتمييز منتجات من لوحة التحكم لتظهر هنا.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <div key={product.id} className="animate-in fade-in duration-700">
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    subtitle={product.subtitle}
                    discount_percentage={product.discount_percentage}
                    is_coming_soon={product.is_coming_soon}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. قسم التغليف الفاخر */}
      <section className="bg-[#050505] py-24 border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl shadow-gold/5">
              <Image 
                src="/images/products/3.jpg" 
                alt="تغليف فاخر من ELOR" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2 text-center md:text-right">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">فخامة <span className="text-gold">التغليف</span></h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              لأننا نعلم أن التفاصيل هي ما يصنع الفرق، تصلك منتجات ELOR في تغليف مخملي فاخر يعكس قيمة ما بداخله. مثالي كهدية لنفسك أو لمن تحبين، مع خدمة التوصيل السريع لجميع مناطق الدولة.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gold transition-colors active:scale-95">
              استكشفي المجموعات الفاخرة
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}