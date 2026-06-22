"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  User, Package, Clock, LogOut, CheckCircle, 
  XCircle, Truck, ShoppingBag, ChevronRight, MapPin 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // متغير للتأكد من أن المكون لا يزال في الصفحة

    const initProfile = async () => {
      // 1. جلب بيانات المستخدم
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;

      if (!session?.user) {
        router.push("/login?redirect=/profile");
        return;
      }
      
      setUser(session.user);

      // 2. جلب طلبات هذا المستخدم فقط باستخدام RLS (user_id)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (isMounted) {
        if (!error && data) {
          setOrders(data);
        }
        setLoading(false);
      }
    };

    initProfile();

    // تنظيف العملية عند خروج المستخدم من الصفحة
    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(amount).replace('AED', 'د.إ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-AE", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'تم التوصيل':
        return <span className="flex items-center gap-1 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-bold"><CheckCircle className="w-4 h-4"/> تم التوصيل</span>;
      case 'في الطريق إليك':
        return <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm font-bold"><Truck className="w-4 h-4"/> في الطريق</span>;
      case 'قيد التجهيز':
        return <span className="flex items-center gap-1 bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-bold"><Package className="w-4 h-4"/> قيد التجهيز</span>;
      case 'ملغي':
        return <span className="flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-bold"><XCircle className="w-4 h-4"/> ملغي</span>;
      default:
        return <span className="flex items-center gap-1 bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm font-bold"><Clock className="w-4 h-4"/> قيد الانتظار</span>;
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold font-bold">حسابي</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="w-full lg:w-1/3">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sticky top-32 text-center">
              <div className="w-24 h-24 bg-white/5 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{user.user_metadata?.full_name || "عميلنا العزيز"}</h2>
              <p className="text-gray-400 text-sm mb-8" dir="ltr">{user.email}</p>
              
              <div className="space-y-3 border-t border-white/5 pt-8">
                <button className="w-full flex items-center justify-between bg-white/5 hover:bg-gold/10 text-white hover:text-gold p-4 rounded-xl transition-all group">
                  <span className="flex items-center gap-3 font-bold"><ShoppingBag className="w-5 h-5" /> طلباتي</span>
                  <span className="bg-black text-xs px-2 py-1 rounded font-bold group-hover:text-white">{orders.length}</span>
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 p-4 rounded-xl transition-all font-bold">
                  <LogOut className="w-5 h-5" /> تسجيل الخروج
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl font-bold text-gold mb-8 border-r-4 border-gold pr-4">سجل طلباتي</h1>

            {orders.length === 0 ? (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
                <ShoppingBag className="w-20 h-20 text-gray-700 mb-6" />
                <h3 className="text-xl font-bold mb-3">لا توجد طلبات سابقة</h3>
                <p className="text-gray-400 mb-8 max-w-sm">يبدو أنك لم تقم بأي عملية شراء حتى الآن. اكتشف منتجاتنا الفاخرة وابدأ رحلة الجمال معنا.</p>
                <Link href="/shop" className="bg-gold text-black px-10 py-4 rounded-sm font-bold hover:bg-gold-light transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.15)]">
                  تسوق الآن
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 hover:border-gold/30 transition-colors">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-6">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">رقم الطلب: <span className="text-white font-mono">{order.id.split('-')[0].toUpperCase()}</span></p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-6 text-sm text-gray-400 bg-white/5 p-3 rounded-xl">
                      <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{order.customer_address}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="relative group">
                            <div className="w-16 h-16 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                              <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain" />
                            </div>
                            <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-right w-full sm:w-auto">
                        <p className="text-gray-500 text-xs mb-1">الإجمالي</p>
                        <p className="text-2xl font-extrabold text-gold">{formatCurrency(order.total_price)}</p>
                      </div>
                    </div>

                    {order.status === 'ملغي' && order.cancellation_reason && (
                      <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-300">
                        <span className="font-bold text-red-500">ملاحظة الإلغاء:</span> {order.cancellation_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}