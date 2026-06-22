"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES_WITH_CUSTOM_ICONS = [
  {
    name: "الكل",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <rect x="27" y="9" width="12" height="12" rx="2" />
        <rect x="9" y="27" width="12" height="12" rx="2" />
        <rect x="27" y="27" width="12" height="12" rx="2" />
      </svg>
    ),
  },

  {
    name: "عناية بالبشرة",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M28.5 7.5c-6.8.4-12.2 5.9-12.2 12.9 0 3.4 1.2 6.1 3.1 8.3" />
        <path d="M27.8 7.8c4.8 1.3 8.3 5.7 8.3 11 0 3.6-1.6 6.7-4.1 8.8-1.6 1.4-2.2 2.9-2 4.7" />
        <path d="M19.4 29.1c-1.5 1.8-2.1 3.8-1.7 6 .6 3.4 3.9 5.7 8.4 5.7 2.9 0 5.3-.9 7.2-2.6" />
        <path d="M24.1 17.4c1.2-1.1 3.1-1.4 4.6-.6" />
        <circle cx="27.8" cy="18.2" r="0.75" fill="currentColor" stroke="none" />
        <path d="M25 22.5c-1 1-1.4 2-.9 2.9.4.8 1.6 1.1 2.8.7" />
        <path d="M22.4 30.4c1.8 1.2 4.5 1.4 6.5.3" />
        <path d="M15.6 14.2c-2.2 2.2-3.4 5.1-3.4 8.3 0 2.8.9 5.3 2.6 7.3" />
      </svg>
    ),
  },

  {
    name: "عناية بالجسم",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.2 7.5c1.2 3.5 1.4 6.7.5 9.6-.6 1.9-1.7 3.5-2.8 5.5-1.7 3.1-2.2 6.4-1.5 10.2" />
        <path d="M29.8 7.5c-1.2 3.5-1.4 6.7-.5 9.6.6 1.9 1.7 3.5 2.8 5.5 1.7 3.1 2.2 6.4 1.5 10.2" />
        <path d="M20.2 10.8c1.1 1.2 2.4 1.8 3.8 1.8s2.7-.6 3.8-1.8" />
        <path d="M20.5 20.5c.9.7 2.1 1 3.5 1s2.6-.3 3.5-1" />
        <path d="M20.7 34c.4 2.8 1.3 5.2 3.3 7.1" />
        <path d="M27.3 34c-.4 2.8-1.3 5.2-3.3 7.1" />
        <path d="M24 22v18" opacity="0.45" />
      </svg>
    ),
  },

  {
    name: "عناية بالشعر ",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M29.5 7.8c-7.8-1.7-14.8 3.7-15.3 11.4-.3 4.6 1.8 8.1 5.2 10.2" />
        <path d="M29.3 8c4.8 2.1 7.3 6.6 6.5 12.2-.4 3.1-1.9 5.8-4 8.1-2.7 3-3.4 6.4-2.1 10.1" />
        <path d="M24.6 9.1c3.4 2.2 5.3 5.6 5.1 9.7-.2 3.8-2 6.8-4.3 9.6-2.4 2.9-3 6.2-1.7 9.9" />
        <path d="M20.5 10.8c2.4 2.6 3.4 5.8 2.9 9.5-.5 3.5-2.2 6.3-4.2 9-2.1 2.8-2.5 5.8-1.3 9.1" />
        <path d="M15.5 18.5c-1.9 4.4-1.5 8.6 1.4 12.2" />
        <path d="M23.3 15.7c2.2-1 4.3-.8 6.1.6" />
      </svg>
    ),
  },

  {
    name: "عطور",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 17h10c3.3 0 6 2.7 6 6v13.5c0 2.2-1.8 4-4 4H17c-2.2 0-4-1.8-4-4V23c0-3.3 2.7-6 6-6z" />
        <path d="M20 17v-5.5h8V17" />
        <path d="M18.5 11.5h11" />
        <path d="M21 7.5h6" />
        <path d="M19 27.5c2.6-2.3 7.4-2.3 10 0" />
        <path d="M19.5 32.5h9" />
        <path d="M35 14.5c2.2.4 3.8 1.6 4.8 3.4" />
        <path d="M36.2 10.5c2.2.1 4.3.9 5.8 2.4" />
      </svg>
    ),
  },

  {
    name: "مجموعة الهدايا",
    icon: ({ className }: { className: string }) => (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="11" y="18" width="26" height="20" rx="1.8" />
        <path d="M9 18h30v7H9z" />
        <path d="M24 18v20" />
        <path d="M11 25h26" />
        <path d="M24 18c-4.8-7.4-8.9-9.2-11.1-7-1.9 1.9-.9 5.6 11.1 7z" />
        <path d="M24 18c4.8-7.4 8.9-9.2 11.1-7 1.9 1.9.9 5.6-11.1 7z" />
        <path d="M14.5 38h19" opacity="0.45" />
      </svg>
    ),
  },
];

const CATEGORY_NAMES = CATEGORIES_WITH_CUSTOM_ICONS.map((c) => c.name);

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFromUrl && CATEGORY_NAMES.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "الكل") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter((p) => Number(p.price) <= maxPrice);

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, selectedCategory, maxPrice, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gold gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="tracking-widest animate-pulse">
          جاري تحضير المنتجات الفاخرة...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            مجموعة <span className="text-gold">ELOR</span>
          </h1>

          <p className="text-gray-400">
            {selectedCategory === "الكل"
              ? "اكتشفي منتجاتنا الفاخرة التي تبرز جمالك الطبيعي"
              : `استكشفي أفضل منتجات ${selectedCategory}`}{" "}
            ({filteredProducts.length} منتج)
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex-1 flex items-center justify-center gap-2 border border-white/10 bg-white/5 py-3 rounded-lg text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            الفلاتر
          </button>

          <div className="relative flex-1 md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 py-3 px-4 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors cursor-pointer text-white"
            >
              <option value="default" className="bg-black">
                الترتيب الافتراضي
              </option>
              <option value="price-asc" className="bg-black">
                السعر: من الأقل للأعلى
              </option>
              <option value="price-desc" className="bg-black">
                السعر: من الأعلى للأقل
              </option>
            </select>

            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar الفلاتر والتصنيفات */}
        <aside
          className={`fixed inset-0 z-50 bg-black/95 lg:bg-transparent lg:static lg:w-1/4 lg:block transition-transform duration-300 ${
            isMobileFilterOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full overflow-y-auto lg:overflow-visible p-6 lg:p-0">
            <div className="flex justify-between items-center lg:hidden mb-8 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gold" />
                الفلاتر
              </h2>

              <X
                className="w-6 h-6 cursor-pointer hover:text-gold"
                onClick={() => setIsMobileFilterOpen(false)}
              />
            </div>

            {/* قائمة التصنيفات */}
            <div className="mb-10 bg-black border-y border-white/10 lg:border lg:border-white/10 lg:rounded-xl overflow-hidden">
              <div className="flex flex-col">
                {CATEGORIES_WITH_CUSTOM_ICONS.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = selectedCategory === category.name;

                  return (
                    <div
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`flex items-center justify-between px-5 py-4 border-b border-white/10 last:border-b-0 cursor-pointer transition-all duration-300 group ${
                        isActive
                          ? "bg-white/[0.035]"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        {/* الأيقونة */}
                        <div className="w-11 h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <IconComponent
                            className={`w-9 h-9 transition-all duration-300 ${
                              isActive
                                ? "text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.55)]"
                                : "text-[#c8a97e] opacity-90 group-hover:text-[#d4af37]"
                            }`}
                          />
                        </div>

                        {/* الخط الفاصل */}
                        <div
                          className={`h-8 w-px transition-colors duration-300 ${
                            isActive ? "bg-[#d4af37]/45" : "bg-white/15"
                          }`}
                        />

                        {/* اسم التصنيف */}
                        <span
                          className={`text-base tracking-wide transition-colors duration-300 ${
                            isActive
                              ? "text-white font-medium"
                              : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {category.name}
                        </span>
                      </div>

                      {/* السهم */}
                      <ChevronLeft
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive
                            ? "text-[#d4af37] -translate-x-1"
                            : "text-[#c8a97e]/70 group-hover:text-[#d4af37]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-10 px-4 lg:px-0">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold rounded-full"></span>
                نطاق السعر
              </h3>

              <div className="px-2">
                <input
                  type="range"
                  min="5"
                  max="1000"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-sm text-gray-400 mt-4">
                  <span>5 AED</span>
                  <span className="text-gold font-bold">
                    حتى {maxPrice} AED
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 lg:px-0">
              <button
                onClick={() => {
                  setSelectedCategory("الكل");
                  setMaxPrice(1000);
                  setSortBy("default");
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-3 border border-white/10 text-gray-300 rounded-lg hover:border-gold hover:text-gold transition-colors text-sm font-medium"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          </div>
        </aside>

        {/* شبكة المنتجات */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Filter className="w-12 h-12 text-gray-600 mb-4" />

              <h3 className="text-xl font-bold mb-2">
                لم نجد منتجات تطابق بحثك
              </h3>

              <p className="text-gray-500">
                جربي تغيير خيارات الفلترة أو السعر.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gold">
            جاري التحميل...
          </div>
        }
      >
        <ShopContent />
      </Suspense>

      <Footer />
    </main>
  );
}