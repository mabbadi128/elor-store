
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { ShieldCheck, CreditCard, MapPin, ChevronRight, Lock, Loader2, CheckCircle2, MessageSquare, Truck, Locate, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation"; 

import dynamic from "next/dynamic";

const LuxuryCheckoutMap = dynamic(() => import("@/components/LuxuryCheckoutMap"), {
  ssr: false, // هذا يمنع تشغيل الخريطة على السيرفر ويحل مشكلة appendChild
  loading: () => <div className="w-full h-64 bg-gray-900 rounded-xl animate-pulse" />
});

export default function CheckoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const cart = useCartStore((state) => state.items);
  const getSubTotalPrice = useCartStore((state) => state.getSubTotalPrice); 
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);    
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);      
  const formatCurrency = useCartStore((state) => state.formatCurrency);
  const clearCart = useCartStore((state) => state.clearCart);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); 
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([25.2048, 55.2708]);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emirate: "دبي",
    address: "",
  });
  
  

  useEffect(() => {
    setIsMounted(true);
    let isSubscribed = true;
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isSubscribed) return;
      
      if (!session?.user) {
        router.push('/login?redirect=/checkout'); 
      } else {
        setUser(session.user);
        setFormData(prev => ({ ...prev, name: session.user.user_metadata?.full_name || "" }));
      }
    };
    checkAuth();
    return () => { isSubscribed = false; };
  }, [router]);

  useEffect(() => {
    if (isMounted && cart.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [isMounted, cart, orderSuccess, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };
  

const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("ميزّة تحديد الموقع غير مدعومة.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        
        try {
          // جرب هذا الرابط (أضفت zoom=18 لزيادة دقة النتائج)
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=ar&zoom=18`;
          const response = await fetch(url);
          const data = await response.json();
          
          console.log("البيانات القادمة من الخريطة:", data); // <--- افتح Console في المتصفح لرؤية البيانات هنا

          if (data && data.address) {
            const road = data.address.road || "";
            const suburb = data.address.suburb || data.address.neighbourhood || data.address.village || "";
            const city = data.address.city || data.address.town || data.address.state || "";
            
            const readableAddress = `${road}${road && suburb ? '، ' : ''}${suburb}${suburb && city ? '، ' : ''}${city}`.trim();
            
            if (readableAddress) {
              setFormData(prev => ({ ...prev, address: readableAddress }));
            } else {
              setFormData(prev => ({ ...prev, address: "تعذر العثور على اسم المنطقة" }));
            }
          }
        } catch (apiError) {
          console.error("Geocoding Error:", apiError);
          setFormData(prev => ({ ...prev, address: "خطأ في الاتصال بخدمة الموقع" }));
        } finally {
          setIsLocating(false);
        }
      },
      () => { 
        setIsLocating(false); 
        alert("لم نتمكن من جلب الموقع."); 
      },
      { enableHighAccuracy: true }
    );
};
  const buildWhatsappMessage = (finalAddress: string, total: number) => {
  const itemsList = cart.map(item => `• ${item.name} (x${item.quantity})`).join("%0A");
  return `مرحباً ELOR، أود تأكيد طلبي:%0A%0A*المنتجات:*%0A${itemsList}%0A%0A*الاسم:* ${formData.name}%0A*الهاتف:* ${formData.phone}%0A*العنوان:* ${finalAddress}%0A*الإجمالي النهائي:* ${formatCurrency(total)}`;
};
  const checkCoupon = async () => {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", couponCode.toUpperCase())
    .eq("is_active", true)
    .single();

  if (data && data.used_count < data.usage_limit) {
    setCouponData(data);
    setMessage({ text: `تم تفعيل خصم ${data.discount_percent}% بنجاح!`, type: 'success' });
  } else {
    setMessage({ text: "عذراً، هذا الكوبون غير صالح أو انتهت صلاحيته.", type: 'error' });
  }
};
const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  // 1. التحقق من الرقم الإماراتي (يبدأ بـ 05 و 10 خانات)
  const isEmiratiPhone = /^05\d{8}$/.test(formData.phone);
  
  if (!isEmiratiPhone) {
    alert("يرجى إدخال رقم هاتف إماراتي صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام).");
    return;
  }

  setIsSubmitting(true);
  
  // 2. حساب السعر النهائي
  const discountAmount = couponData ? (getTotalPrice() * couponData.discount_percent) / 100 : 0;
  const finalPrice = getTotalPrice() - discountAmount;

  const methodText = paymentMethod === "whatsapp" ? "تأكيد فوري عبر الواتساب" : "الدفع عند الاستلام";
  const finalAddress = `${formData.emirate} - ${formData.address} [طريقة الدفع: ${methodText}]`;

  // 3. حفظ الطلب في قاعدة البيانات
  const orderData = {
    user_id: user.id, 
    customer_name: formData.name,
    customer_phone: formData.phone,
    customer_address: finalAddress,
    total_price: finalPrice, 
    items: cart,
    payment_status: "لم يتم الدفع",
    applied_coupon: couponData ? couponData.code : null
  };

  const { error } = await supabase.from('orders').insert([orderData]);

  // 4. تحديث عداد الكوبون
  if (couponData) {
    await supabase
      .from("coupons")
      .update({ used_count: (couponData.used_count || 0) + 1 })
      .eq("id", couponData.id);
  }

  if (error) {
    alert("حدث خطأ، يرجى المحاولة مرة أخرى.");
    setIsSubmitting(false);
    return;
  }

  // 5. إرسال للواتساب باستخدام السعر النهائي (finalPrice)
  if (paymentMethod === "whatsapp") {
    // تأكد أنك مررت finalPrice هنا:
    window.open(`https://wa.me/971505029695?text=${buildWhatsappMessage(finalAddress, finalPrice)}`, "_blank"); 
  }

  setOrderSuccess(true);
  if (clearCart) clearCart(); 
  setIsSubmitting(false);
};
  const handleDirectWhatsappClick = () => {
  const mockAddress = `${formData.emirate} - ${formData.address || "العنوان المرفق بالخريطة"}`;
  
  // 1. حساب السعر النهائي داخل الدالة أيضاً
  const discountAmount = couponData ? (getTotalPrice() * couponData.discount_percent) / 100 : 0;
  const finalPrice = getTotalPrice() - discountAmount;

  // 2. تمرير العنوان والسعر معاً للدالة
  window.open(`https://wa.me/971505029695?text=${buildWhatsappMessage(mockAddress, finalPrice)}`, "_blank");
};

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }
  // 1. حساب قيمة الخصم
const discountAmount = couponData ? (getTotalPrice() * couponData.discount_percent) / 100 : 0;

// 2. حساب الإجمالي النهائي (مع ضمان أنه رقم)
const finalTotal = getTotalPrice() - discountAmount;

  if (orderSuccess) {
    return (
      
      <main className="min-h-screen bg-black text-white flex flex-col relative z-10" dir="rtl">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center pt-32">
          {paymentMethod === "cod" ? (
            <>
              <Clock className="w-24 h-24 text-gold mb-6 animate-pulse" />
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">طلبكِ قيد المراجعة والتدقيق! ⏳</h1>
              <p className="text-gray-400 text-lg max-w-lg mb-10">
                شكراً لثقتكِ بـ ELOR. تم استلام تفاصيل طلبكِ بنجاح، وهو الآن تحت مراجعة الإدارة للتحقق من البيانات وتجهيز الشحنة إلى {formData.emirate} فوراً.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">تم تأكيد الطلب بنجاح! 🎉</h1>
              <p className="text-gray-400 text-lg max-w-lg mb-10">
                أهلاً بكِ في عالم ELOR الفاخر. تم إرسال تفاصيل فاتورتكِ مباشرة إلى الدعم الفني عبر الواتساب لتنسيق موعد تسليم شحنتكِ الجمالية الفاخرة.
              </p>
            </>
          )}
          
          <button onClick={() => router.push('/shop')} className="bg-gold text-black px-10 py-4 rounded-sm font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 active:scale-95">
            العودة للتسوق
          </button>
        </div>
        <Footer />
      </main>
    );
  }
  
  
  

  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/cart" className="hover:text-gold transition-colors">السلة</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold font-bold">إتمام الشراء</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3">
          إتمام الطلب <Lock className="w-6 h-6 text-gold" />
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="w-full lg:w-2/3 space-y-8">
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">
              
              {/* معلومات التوصيل */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                  <MapPin className="text-gold w-6 h-6" /> عنوان التوصيل الفاخر داخل الإمارات
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">الاسم الكامل</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:border-gold outline-none transition-all" placeholder="الاسم الكامل" />
                  </div>
                  
                  <div className="space-y-2">
  <label className="text-sm text-gray-400">رقم الجوال (الإمارات)</label>
  <input 
    type="tel" 
    required 
    value={formData.phone} 
    onChange={handlePhoneChange} 
    className={`w-full bg-black border rounded-lg px-4 py-3 outline-none ${
      formData.phone.length > 0 && !/^05\d{8}$/.test(formData.phone) 
        ? "border-red-500 text-red-500" 
        : "border-white/20 focus:border-gold"
    }`} 
    placeholder="0501234567" 
    dir="ltr" 
  />
  {formData.phone.length > 0 && !/^05\d{8}$/.test(formData.phone) && (
    <span className="text-xs text-red-500">يجب أن يبدأ الرقم بـ 05 ويتكون من 10 أرقام</span>
  )}
</div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">الإمارة</label>
                    <select required value={formData.emirate} onChange={(e) => setFormData({...formData, emirate: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:border-gold outline-none">
                      <option value="دبي">دبي</option>
                      <option value="أبوظبي">أبوظبي</option>
                      <option value="الشارقة">الشارقة</option>
                      <option value="عجمان">عجمان</option>
                      <option value="رأس الخيمة">رأس الخيمة</option>
                      <option value="الفجيرة">الفجيرة</option>
                      <option value="أم القيوين">أم القيوين</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">العنوان بالتفصيل</label>
                    <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:border-gold outline-none text-gold font-medium" placeholder="اسم الشارع، الحي، أو الإحداثيات تلقائياً" />
                  </div>
                </div>

                {/* قسم الخريطة المدمجة */}
                <div className="pt-4 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Locate className="w-4 h-4 text-gold" /> حددي موقع منزلك بدقة على الخريطة
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-black px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Locate className="w-3.5 h-3.5" />}
                      تحديد موقعي الحالي تلقائياً
                    </button>
                  </div>

                  <LuxuryCheckoutMap mapCenter={mapCenter} />
                </div>

              </div>

              {/* خيارات الدفع الثنائية */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                  <CreditCard className="text-gold w-6 h-6" /> اختيار وسيلة الدفع الآمنة
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label 
                    className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-white/5 bg-black hover:border-white/20'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <Truck className="w-5 h-5 text-gold" /> عند الاستلام (COD)
                    </div>
                    <input type="radio" checked={paymentMethod === 'cod'} readOnly className="w-4 h-4 accent-gold" />
                  </label>

                  <label 
                    className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-500/5' : 'border-white/5 bg-black hover:border-white/20'
                    }`}
                    onClick={() => setPaymentMethod('whatsapp')}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <MessageSquare className="w-5 h-5 text-green-500" /> عبر الـ WhatsApp
                    </div>
                    <input type="radio" checked={paymentMethod === 'whatsapp'} readOnly className="w-4 h-4 accent-green-500" />
                  </label>
                </div>

                <div className="mt-6 p-4 rounded-xl border border-white/5 bg-black/40 text-xs text-gray-400">
                  {paymentMethod === "cod" && "💡 سيتم إرسال طلبكِ فوراً لمراجعة وتدقيق الإدارة وتأكيده تمهيداً للشحن البنكي السريع لباب المنزل."}
                  {paymentMethod === "whatsapp" && "💡 سيتم فتح واجهة الواتساب المباشرة مع خدمة العملاء لإنهاء وتأكيد الفاتورة وتجهيز منتجات جمالكِ."}
                </div>
              </div>

            </form>
          </div>

          {/* ملخص الحسابات */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#0a0a0a] border border-gold/20 rounded-2xl p-6 md:p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">ملخص الطلب</h2>
              <div className="flex gap-2 mb-6">
  <input 
    placeholder="لديك كوبون خصم؟"
    className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-3 text-gold outline-none focus:border-gold"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
  />
  <button 
    type="button"
    onClick={checkCoupon}
    className="bg-gold/10 text-gold px-4 rounded-lg font-bold hover:bg-gold hover:text-black transition-all"
  >
    تطبيق
  </button>
</div>
{message && (
  <div className={`mt-2 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${
    message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
  }`}>
    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
    {message.text}
  </div>
)}
              
              <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gold">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي للمنتجات</span>
                  <span className="text-white">{formatCurrency(getSubTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>أجور التوصيل الثابتة (الإمارات)</span>
                  <span className="text-white font-medium">{formatCurrency(getDeliveryFee())}</span>
                </div>
               <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-gold/30 mt-4">
  <span>الإجمالي الكلي</span>
  <span className="text-gold">
    {/* إذا كان هناك خصم، اعرض السعر الأصلي مشطوباً ثم السعر الجديد */}
    {couponData && (
      <span className="text-gray-500 line-through text-sm ml-2">
        {formatCurrency(getTotalPrice())}
      </span>
    )}
    {formatCurrency(finalTotal)}
  </span>
</div>
              </div>

              <div className="mt-8 space-y-3">
                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full bg-gold text-black py-4 rounded-sm font-bold text-lg hover:bg-gold-light transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-5 h-5" /> تأكيد وإتمام الطلب</>}
                </button>

                <button 
                  type="button" 
                  onClick={handleDirectWhatsappClick}
                  className="w-full bg-[#25D366] text-white py-4 rounded-sm font-bold text-lg hover:bg-[#20ba5a] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  تواصل عبر الـ WhatsApp
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}