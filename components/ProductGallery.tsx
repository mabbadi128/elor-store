"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  // نستقبل مصفوفة (Array) من روابط الصور
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  // حالة (State) لتخزين الصورة النشطة، القيمة الافتراضية هي الصورة الأولى
  const [activeImage, setActiveImage] = useState(images[0]);

  // حماية في حال لم يتم تمرير صور
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* قسم الصورة الرئيسية */}
      <div className="relative w-full aspect-square bg-black/20 rounded-xl overflow-hidden border border-gold/10 flex items-center justify-center">
        <Image
          src={activeImage}
          alt="صورة المنتج الرئيسية"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 transition-opacity duration-300"
        />
      </div>

      {/* شريط الصور المصغرة (Thumbnails) */}
      {/* استخدمنا overflow-x-auto عشان لو الصور كثيرة يقدر المستخدم يسحبها يمين ويسار */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-black/20 ${
              activeImage === img 
                ? "border-gold" // إذا كانت هي الصورة النشطة، الإطار ذهبي
                : "border-transparent hover:border-gold/50" // إذا لم تكن نشطة
            }`}
          >
            <Image
              src={img}
              alt={`صورة مصغرة ${index + 1}`}
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}