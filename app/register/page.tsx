"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("جاري محاولة الاتصال بـ Supabase...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.warn("خطأ من Supabase:", error.message);
        alert("حدث خطأ: " + error.message);
      } else {
        console.log("تمت العملية بنجاح:", data);
        alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        window.location.href = "/login";
      }
    } catch (err) {
      console.warn("خطأ غير متوقع:", err);
      alert("حدث خطأ في النظام، يرجى المحاولة لاحقاً.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-black text-white" dir="rtl">
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-black/40 z-10" />

        <Image
          src="/images/hero/10.jpg"
          alt="ELOR Luxury"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16">
          <h2 className="text-5xl font-bold mb-6 text-gold">ELOR</h2>

          <p className="text-xl text-gray-200 max-w-md leading-relaxed">
            انضمي إلى نخبة عملاء ELOR. أنشئي حسابكِ الآن لتجربة تسوق لا تُنسى
            وللحصول على عروضنا الحصرية.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold mb-12 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>

          <h1 className="text-3xl font-bold mb-2">حساب جديد</h1>
          <p className="text-gray-400 mb-10">أدخلي تفاصيلكِ للانضمام لعالمنا</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
               الاسم الكامل
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-4 outline-none focus:border-gold transition-colors text-white"
                  placeholder="عميلنا العزيز"
                />

                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                البريد الإلكتروني
              </label>

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
              <label className="text-sm font-medium text-gray-300">
                كلمة المرور يجب أن تكون 6 أحرف على الأقل
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-12 outline-none focus:border-gold transition-colors text-white"
                  placeholder="••••••••"
                />

                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold transition-colors"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-lg py-4 rounded-xl transition-colors mt-8 ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gold text-black hover:bg-gold-light"
              }`}
            >
              {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            لديكِ حساب بالفعل؟{" "}
            <Link href="/login" className="text-gold font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}