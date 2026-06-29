"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Sparkles, History, Leaf, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      {/* 1. قسم الهيرو (Hero) - الواجهة الرئيسية للقصة */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image 
            src="/images/products/.jpg" // تأكد من وجود صورة فخمة هنا
            alt="قصة ELOR"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-gold to-gold/50">
            قصتنا
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* 2. قسم البداية (The Vision) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4">
              <History className="text-gold w-8 h-8" />
              من أين بدأنا؟
            </h2>
            <p className="text-gray-400 leading-loose text-lg mb-6">
مرحباً بكم في ELOR
وُلدت ELOR من شغفٍ حقيقي بالعناية الطبيعية والجمال البسيط. نؤمن بأن البشرة تستحق أفضل ما تقدمه الطبيعة، لذلك نحرص على تقديم منتجات عناية بالجسم غنية بالمكونات المختارة بعناية لتمنح بشرتكم الترطيب والتغذية التي تحتاجها كل يوم.            </p>
            <p className="text-gray-400 leading-loose text-lg">
نركز على توفير منتجات عالية الجودة تجمع بين الفعالية والبساطة والتجربة الفاخرة، لتصبح العناية اليومية لحظة مميزة تمنحكم الشعور بالراحة والثقة.
في ELOR، لا نبيع منتجات فحسب، بل نسعى لبناء علامة تجارية ترتكز على الجودة والموثوقية ورضا العملاء، مع التزامنا بتقديم تجربة تسوق سلسة وخدمة متميزة في جميع أنحاء الإمارات العربية المتحدة.
شكراً لثقتكم بنا، ونتطلع لأن نكون جزءاً من روتين العناية الخاص بكم.            </p>
          </div>
          <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-gold/5">
            <Image 
              src="/images/products/3.png" // صورة تعكس المكونات أو المختبر
              alt="رؤية ELOR"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. قيمنا الجوهرية (Our Philosophy) */}
      <section className="py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">فلسفة <span className="text-gold">الجمال</span> لدينا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors border border-white/10 group-hover:border-gold/50">
                <Leaf className="text-gold w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">نقاء الطبيعة</h3>
              <p className="text-gray-500">نعتمد بنسبة 100% على مكونات عضوية مستخلصة من مصادر مستدامة تحترم الأرض وبشرتك.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors border border-white/10 group-hover:border-gold/50">
                <Sparkles className="text-gold w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">فخامة التفاصيل</h3>
              <p className="text-gray-500">من صياغة المنتج إلى التغليف المخملي، كل تفصيلة مصممة لتجعلكِ تشعرين بالتميز.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors border border-white/10 group-hover:border-gold/50">
                <ShieldCheck className="text-gold w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">جودة إماراتية</h3>
              <p className="text-gray-500">نفخر بجذورنا، ونطبق أعلى المعايير العالمية لتقديم منتج يليق باسم الإمارات.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. رسالة أخيرة (Final Message) */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto">
        <Heart className="text-gold w-12 h-12 mx-auto mb-8" />
        <h2 className="text-3xl font-bold mb-8 italic">"جمالك ليس مجرد مظهر، بل هو انعكاس لمدى تقديركِ لذاتك."</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          نحن في ELOR، نعدكِ بأن نكون شريككِ الدائم في رحلة العناية بجمالكِ، مقدمين لكِ دائمًا الأفضل، والأنقى، والأكثر فخامة. لأنكِ ببساطة.. تستحقين الأفضل.
        </p>
      </section>

      <Footer />
    </main>
  );
}