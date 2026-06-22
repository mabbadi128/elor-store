import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    // استخدام group لتفعيل تأثيرات الماوس على مستوى القسم بالكامل
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col justify-center px-6 md:px-16 pt-20 overflow-hidden bg-black group">
      
      {/* صورة الخلفية مع تأثير التكبير البطيء */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* تدرج لوني أعمق لضمان وضوح النص */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2000"
          alt="ELOR Luxury Cosmetics"
          fill
          priority // مهم جداً للقسم الأول في الصفحة لسرعة التحميل
          className="object-cover object-center md:object-right-top opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[10000ms] ease-out"
        />
      </div>

      {/* النصوص */}
      <div className="relative z-10 w-full md:w-1/2 text-center md:text-right mt-10 md:mt-0">
        
        {/* تدرج لوني للنص الرئيسي */}
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#fff5d1] text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          ELOR
        </h2>
        
        <p className="text-white text-lg md:text-2xl tracking-[0.3em] mb-6 uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          Luxury You Can Feel
        </p>
        
        <p className="text-gray-300 mb-10 max-w-sm mx-auto md:mx-0 text-base md:text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          جمالك يستحق الأفضل - منتجات فاخرة لعناية متكاملة ببشرتك بخلاصات طبيعية نادرة.
        </p>
        
        {/* زر التسوق مع تأثير التوهج */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-gold text-black px-10 md:px-14 py-4 rounded-full font-bold hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-sm md:text-base w-full sm:w-auto active:scale-95"
          >
            تسوقي الآن
          </Link>
        </div>

      </div>

      {/* ديكورات بصرية (خطوط ذهبية خفيفة) تعطي طابع 3D وتصميم هندسي */}
      <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-gold/40 to-transparent z-10" />
      <div className="absolute top-1/4 right-0 w-[1px] h-32 bg-gradient-to-b from-gold/40 to-transparent z-10" />
    </section>
  );
}