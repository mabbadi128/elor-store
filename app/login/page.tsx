"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🌟 استدعاء الموجه
import { Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 🌟 تفعيل الموجه

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("جاري التحقق من البيانات...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("خطأ في تسجيل الدخول:", error.message);
        alert("عذراً، الإيميل أو كلمة المرور غير صحيحة!");
      } else {
        console.log("تم الدخول بنجاح:", data);
        
        // 🌟 التوجيه الذكي: فحص الصلاحية
        if (data.user?.user_metadata?.role === 'admin') {
          // alert("أهلاً بك يا مدير النظام!"); // يمكنك إخفاء هذه لاحقاً ليكون الدخول أسرع
          router.push("/admin"); // توجيه للوحة التحكم
        } else {
          // alert("تم تسجيل الدخول بنجاح!");
          router.push("/"); // توجيه للصفحة الرئيسية للمستخدم العادي
        }
      }
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      alert("حدث خطأ في النظام، يرجى المحاولة لاحقاً.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-black text-white" dir="rtl">
      {/* القسم الأيمن - الصورة */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="/images/hero/10.jpg" 
          alt="ELOR Luxury"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16">
          <h2 className="text-5xl font-bold mb-6 text-gold tracking-widest">ELOR</h2>
          <p className="text-xl text-gray-200 max-w-md leading-relaxed">
            مرحباً بكِ في عالم الجمال الإماراتي الفاخر. سجلي دخولكِ لمتابعة طلباتكِ واستكشاف أحدث مجموعاتنا الحصرية.
          </p>
        </div>
      </div>

      {/* القسم الأيسر - نموذج تسجيل الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold mb-12 transition-colors">
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Link>

          <h1 className="text-3xl font-bold mb-2">تسجيل الدخول</h1>
          <p className="text-gray-400 mb-10">أدخلي تفاصيل حسابكِ للمتابعة</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-4 outline-none focus:border-gold transition-colors text-white"
                  placeholder="name@example.com"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
                <Link href="#" className="text-sm text-gold hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-4 outline-none focus:border-gold transition-colors text-white"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold text-lg py-4 rounded-xl transition-colors mt-8 ${loading ? 'bg-gray-600 text-gray-300' : 'bg-gold text-black hover:bg-gold-light'}`}
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            ليس لديكِ حساب؟ <Link href="/register" className="text-gold font-bold hover:underline">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </main>
  );
}