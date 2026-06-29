"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const router = useRouter();

  // ✅ إذا المستخدم مسجل دخول من قبل، حوله مباشرة للبروفايل
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("خطأ في فحص الجلسة:", error.message);
          setCheckingSession(false);
          return;
        }

        if (data.session?.user) {
          router.replace("/profile");
          return;
        }

        setCheckingSession(false);
      } catch (err) {
        console.error("خطأ غير متوقع في فحص الجلسة:", err);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
  if (
    error.message.includes("Email not confirmed") ||
    error.message.includes("email_not_confirmed")
  ) {
    alert("يرجى تأكيد بريدك الإلكتروني أولاً من الرسالة التي وصلتك.");
  } else {
    alert("عذراً، الإيميل أو كلمة المرور غير صحيحة!");
  }

  setLoading(false);
  return;
}

      console.log("تم الدخول بنجاح:", data);

      // ✅ بعد تسجيل الدخول يروح مباشرة للبروفايل
      router.replace("/profile");
      router.refresh();
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      alert("حدث خطأ في النظام، يرجى المحاولة لاحقاً.");
      setLoading(false);
    }
  };

  // ✅ شاشة تحميل احترافية أثناء فحص تسجيل الدخول
  if (checkingSession) {
    return (
      <main
        className="min-h-screen bg-black text-white flex items-center justify-center"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-gray-300">جاري التحقق من الحساب...</p>
        </div>
      </main>
    );
  }

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
          <h2 className="text-5xl font-bold mb-6 text-gold tracking-widest">
            ELOR
          </h2>

          <p className="text-xl text-gray-200 max-w-md leading-relaxed">
            مرحباً بكِ في عالم الجمال الإماراتي الفاخر. سجل دخولك لمتابعة
            طلباتك واستكشاف أحدث مجموعاتنا الحصرية.
          </p>
        </div>
      </div>

      {/* القسم الأيسر - نموذج تسجيل الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold mb-12 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>

          <h1 className="text-3xl font-bold mb-2">تسجيل الدخول</h1>
          <p className="text-gray-400 mb-10">أدخل تفاصيل حسابك للمتابعة</p>

          <form onSubmit={handleLogin} className="space-y-6">
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
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-300">
      كلمة المرور
    </label>

    <Link href="#" className="text-sm text-gold hover:underline">
      نسيت كلمة المرور؟
    </Link>
  </div>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-12 outline-none focus:border-gold transition-colors text-white"
      placeholder="••••••••"
    />

    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold transition-colors"
      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
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
              className={`w-full font-bold text-lg py-4 rounded-xl transition-colors mt-8 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gold text-black hover:bg-gold-light"
              }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-gold font-bold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}