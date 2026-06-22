"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Package, Users, ShoppingBag, LogOut, Plus, 
  Trash2, Edit, Home, Upload, Loader2, Star, Check, CheckCircle2, X, Percent, Calendar, Sparkles, Type, Image as ImageIcon
} from "lucide-react";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // حالات الخصم العام للموقع وعنوان المناسبة
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [discountTitle, setDiscountTitle] = useState("");
  const [isUpdatingDiscount, setIsUpdatingDiscount] = useState(false);

  // حالات التنبيهات
  const [alertData, setAlertData] = useState({ show: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // حالات رفع الصور المنفصلة
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [product, setProduct] = useState({
    id: "", 
    name: "",      
    subtitle: "",  
    price: "",     
    category: "عناية بالبشرة", 
    image: "",     
    desc: "",
    is_best_seller: false,
    discount_percentage: 0,
    is_coming_soon: false,
    images: ["", "", ""] // المصفوفة ستحتوي على [الصورة الأساسية، الصورة الإضافية 1، الصورة الإضافية 2]
  });

  const showAlert = (message: string, type: "success" | "error" = "success") => {
    setAlertData({ show: true, message, type });
    setTimeout(() => setAlertData({ show: false, message: "", type: "success" }), 3500);
  };

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.role === 'admin') {
        setIsAdmin(true);
        fetchProducts();
        fetchGlobalSettings(); 
      } else {
        router.push("/");
      }
      setLoading(false);
    };
    initDashboard();
  }, [router]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchGlobalSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('global_discount, discount_title').eq('id', 1).single();
    if (!error && data) {
      setGlobalDiscount(data.global_discount);
      setDiscountTitle(data.discount_title || "");
    }
  };

  const handleUpdateGlobalDiscount = async () => {
    setIsUpdatingDiscount(true);
    const { error = null } = await supabase
      .from('site_settings')
      .update({ 
        global_discount: globalDiscount,
        discount_title: discountTitle
      })
      .eq('id', 1);

    if (error) {
      showAlert("فشل تحديث عروض الموقع", "error");
    } else {
      showAlert(
        globalDiscount > 0 
          ? `تم تفعيل عرض (${discountTitle || "خصم خاص"}) بنسبة ${globalDiscount}% بنجاح! 🎉`
          : "تم إيقاف الخصم الشامل وإعادة الموقع للوضع الطبيعي.", 
        "success"
      );
    }
    setIsUpdatingDiscount(false);
  };

  const handleImageUpload = async (e: any, index: number | "main") => {
    try {
      if (index === "main") {
        setUploadingIndex(-1);
      } else {
        setUploadingIndex(index);
      }
      
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${index}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      if (data) {
        if (index === "main") {
          // 🌟 الربط الذكي: عند رفع الصورة الأساسية، نقوم بوضعها في حقل الكرت الرئيسي وأيضاً كأول صورة في المصفوفة
          const updatedImages = [...product.images];
          updatedImages[0] = data.publicUrl; // تثبيتها في الخانة الأولى بالأسفل تلقائياً
          setProduct({ ...product, image: data.publicUrl, images: updatedImages });
        } else {
          const updatedImages = [...product.images];
          updatedImages[index] = data.publicUrl;
          setProduct({ ...product, images: updatedImages });
        }
        showAlert(`تم رفع الصورة بنجاح! ✨`, "success");
      }

    } catch (error: any) {
      console.error("Storage Error:", error);
      showAlert("فشل الرفع: تأكد من إعدادات الـ Storage", "error");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const updatedImages = [...product.images];
    updatedImages[index] = ""; 
    setProduct({ ...product, images: updatedImages });
    showAlert(`تم إزالة الصورة الفرعية رقم ${index + 1}`, "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // تأكيد وضمان مزامنة خانة المعرض الأولى مع الصورة الأساسية قبل الإرسال
    const finalImages = [...product.images];
    finalImages[0] = product.image;

    const productData = {
      name: product.name,
      subtitle: product.subtitle,
      price: parseFloat(product.price),
      category: product.category,
      image: product.image,
      desc: product.desc,
      is_best_seller: product.is_best_seller,
      discount_percentage: Number(product.discount_percentage) || 0,
      is_coming_soon: product.is_coming_soon,
      images: finalImages 
    };

    const { error } = product.id 
      ? await supabase.from('products').update(productData).eq('id', product.id)
      : await supabase.from('products').insert([productData]);

    if (error) {
      console.error("Database Error:", error);
      showAlert("خطأ في قاعدة البيانات: " + error.message, "error");
    } else {
      showAlert(product.id ? "تم تحديث المنتج بنجاح! 👑" : "تم نشر المنتج الجديد بنجاح! 👑", "success");
      setProduct({ 
        id: "", name: "", subtitle: "", price: "", category: "عناية بالبشرة", 
        image: "", desc: "", is_best_seller: false, discount_percentage: 0, is_coming_soon: false,
        images: ["", "", ""]
      });
      fetchProducts();
    }
    setIsSubmitting(false);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from('products').delete().eq('id', confirmDelete);
    if (error) {
      showAlert(error.message, "error");
    } else {
      showAlert("تم حذف المنتج نهائياً", "success");
      fetchProducts();
    }
    setConfirmDelete(null);
  };

  if (loading) return <div className="min-h-screen bg-black text-gold flex items-center justify-center text-2xl animate-pulse">جاري التحميل...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative" dir="rtl">
      
      {/* ================= نوافذ التنبيهات (Modals) ================= */}
      {alertData.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className={`bg-[#0a0a0a] border ${alertData.type === 'success' ? 'border-gold/50' : 'border-red-500/50'} p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-300`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${alertData.type === 'success' ? 'bg-gold/10 text-gold' : 'bg-red-500/10 text-red-500'}`}>
              {alertData.type === 'success' ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-8">{alertData.message}</h3>
            <button onClick={() => setAlertData({ ...alertData, show: false })} className={`w-full py-4 rounded-xl font-extrabold transition-all ${alertData.type === 'success' ? 'bg-gold text-black hover:bg-[#c5a035]' : 'bg-red-500 text-white hover:bg-red-600'}`}>استمرار</button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-[#0a0a0a] border border-red-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-500/10 text-red-500">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">تأكيد الحذف</h3>
            <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">هل أنت متأكد أنك تريد حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex w-full gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 rounded-xl font-bold transition-all border border-white/10 text-white hover:bg-white/5">تراجع</button>
              <button onClick={executeDelete} className="flex-1 py-4 rounded-xl font-bold transition-all bg-red-500 text-white hover:bg-red-600">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= الشريط الجانبي ================= */}
      <aside className="w-full md:w-72 bg-black border-l border-white/5 p-8 flex flex-col sticky top-0 h-fit md:h-screen">
        <h1 className="text-3xl font-extrabold text-gold mb-10 tracking-widest text-center">ELOR ADMIN</h1>
        <nav className="flex-1 space-y-3">
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <Home className="w-5 h-5 text-gold" /> العودة للرئيسية
          </button>
          <button className="w-full flex items-center gap-4 text-gold bg-gold/5 border border-gold/20 p-4 rounded-xl">
            <Package className="w-5 h-5" /> إدارة المنتجات
          </button>
          <button onClick={() => router.push("/admin/orders")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <ShoppingBag className="w-5 h-5 text-gold" /> إدارة الطلبات
          </button>
          <button onClick={() => router.push("/admin/coupons")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
  <CheckCircle2 className="w-5 h-5 text-gold" /> إدارة الكوبونات
</button>
        </nav>
        <button onClick={() => { supabase.auth.signOut(); router.push("/login"); }} className="flex items-center gap-4 text-red-500/70 hover:text-red-500 p-4 mt-10 border-t border-white/5 pt-8">
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
        
      </aside>

      {/* ================= المحتوى الرئيسي ================= */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto space-y-8">
        
        {/* لوحة التحكم بالحملات والاعياد للموقع بالكامل */}
        <section className="bg-gradient-to-r from-[#0e0c07] to-[#050505] border border-gold/20 p-6 rounded-[2rem] shadow-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-gold/10 rounded-2xl text-gold shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">حملات التخفيض والمناسبات الإماراتية</h2>
              <p className="text-gray-400 text-xs mt-1">قم بكتابة اسم المناسبة وتحديد نسبة الخصم ليتم تفعيل العرض فوراً وتغيير الأسعار في كل الموقع بضغطة واحدة.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto bg-black/40 border border-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 sm:w-64">
              <Type className="w-4 h-4 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="اسم المناسبة (مثال: بمناسبة العيد الوطني)" 
                value={discountTitle}
                onChange={(e) => setDiscountTitle(e.target.value)}
                className="bg-transparent text-sm text-white w-full outline-none"
              />
            </div>

            <div className="flex items-center justify-center gap-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 shrink-0">
              <Percent className="w-4 h-4 text-gold" />
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={globalDiscount} 
                onChange={(e) => setGlobalDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-12 bg-transparent text-center font-bold text-gold text-base outline-none"
              />
              <span className="text-xs text-gray-400">خصم</span>
            </div>

            <button 
              onClick={handleUpdateGlobalDiscount}
              disabled={isUpdatingDiscount}
              className="bg-gold text-black px-6 py-3 rounded-xl text-sm font-extrabold hover:bg-[#c5a035] transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              {isUpdatingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              تطبيق العرض
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* إضافة وتعديل منتج */}
          <section className="bg-black border border-white/5 p-8 rounded-[2rem] shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gold">
              {product.id ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              {product.id ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">اسم المنتج</label>
                  <input type="text" required value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">العنوان الفرعي (Subtitle)</label>
                  <input type="text" value={product.subtitle} onChange={(e) => setProduct({...product, subtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">السعر الأساسي (AED)</label>
                  <input type="number" required value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">خصم خاص بالمنتج (%)</label>
                  <input type="number" min="0" max="100" value={product.discount_percentage || 0} onChange={(e) => setProduct({...product, discount_percentage: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50" placeholder="مثال: 15" />
                </div>
            <div className="space-y-2">
  <label className="text-xs text-gray-500 mr-2">القسم</label>
  <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50 text-white">
    <option value="عناية بالبشرة" className="bg-black text-white">عناية بالبشرة</option>
    <option value="عناية بالجسم" className="bg-black text-white">عناية بالجسم</option>
    <option value="عناية بالشعر" className="bg-black text-white">عناية بالشعر</option>
      <option value="عطور" className="bg-black text-white">عطور</option>
    <option value="مجموعة الهدايا" className="bg-black text-white">مجموعة الهدايا</option>
   
  </select>
</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500 mr-2">شرح المنتج (الوصف)</label>
                <textarea rows={3} value={product.desc} onChange={(e) => setProduct({...product, desc: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-gold/50 resize-none" />
              </div>

              {/* حقل رفع الصورة الأساسية */}
              <div className="space-y-2">
                <label className="text-xs text-gold mr-2 font-bold">صورة المنتج الأساسية</label>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-gray-500 text-xs flex items-center overflow-hidden">
                    <span className="truncate" dir="ltr">{product.image ? product.image : "لم يتم رفع صورة أساسية بعد"}</span>
                  </div>
                  <label className="cursor-pointer bg-gold text-black px-6 rounded-xl hover:bg-[#c5a035] transition-all flex items-center gap-2 font-bold">
                    {uploadingIndex === -1 ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    <span>{product.image ? "تعديل الصورة" : "رفع الصورة"}</span>
                    <input type="file" hidden onChange={(e) => handleImageUpload(e, "main")} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* 🌟 قسم إدارة صور المعرض التفاعلي الثلاثة المصنفة بذكاء */}
              <div className="space-y-3 bg-white/5 border border-white/5 p-4 rounded-2xl mt-4">
                <label className="text-xs text-gray-400 flex items-center gap-1.5 font-bold">
                  <ImageIcon className="w-4 h-4 text-gold" /> صور المعرض الفرعية لأسهم التنقل (3 صور مصغرة)
                </label>
                
                <div className="grid grid-cols-1 gap-3">
                  {[0, 1, 2].map((idx) => {
                    // الخانة رقم 0 هي خانة الصورة الأساسية المرتبطة تلقائياً
                    const isMainLinked = idx === 0;

                    return (
                      <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${isMainLinked ? 'bg-gold/5 border-gold/20' : 'bg-black/40 border-white/5'}`}>
                        {/* مربع المعاينة الفوري */}
                        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 ${isMainLinked ? 'border-gold/40 bg-black/80' : 'border-white/10 bg-black/80'}`}>
                          {isMainLinked ? (
                            product.image ? <img src={product.image} alt="معاينة الأساسية" className="w-full h-full object-cover" /> : <span className="text-xs text-gold font-mono">#1</span>
                          ) : (
                            product.images[idx] ? <img src={product.images[idx]} alt={`معاينة الإضافية ${idx}`} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-600 font-mono">#{idx + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 text-xs text-gray-500 truncate" dir="ltr">
                          {isMainLinked ? (
                            product.image ? "✨ مرتبطة تلقائياً بالصورة الأساسية الفخمة أعلاه" : "يرجى رفع الصورة الأساسية أولاً لتظهر هنا تلقائياً"
                          ) : (
                            product.images[idx] ? product.images[idx] : `لم يتم رفع صورة إضافية رقم ${idx + 1} (اختياري)`
                          )}
                        </div>

                        {/* التحكم بالأزرار الفردية */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* الصورة الأساسية لا تمسح من هنا لأنها خانة ثابتة، فقط الصور الإضافية يمكن مسحها */}
                          {!isMainLinked && product.images[idx] && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="حذف الصورة من المعرض"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          {isMainLinked ? (
                            <span className="text-[10px] bg-gold/15 text-gold font-bold px-2.5 py-1 rounded-md shadow-sm border border-gold/10 select-none">أساسية ثابتة</span>
                          ) : (
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1 font-bold">
                              {uploadingIndex === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>{product.images[idx] ? "تعديل" : "رفع"}</span>
                              <input type="file" hidden onChange={(e) => handleImageUpload(e, idx)} accept="image/*" />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input type="checkbox" checked={product.is_best_seller} onChange={(e) => setProduct({...product, is_best_seller: e.target.checked})} className="w-5 h-5 accent-gold cursor-pointer" id="bestSeller" />
                  <label htmlFor="bestSeller" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2 select-none">
                    <Star className="w-4 h-4 text-gold fill-gold/20" /> تمييز كـ "الأكثر مبيعاً"
                  </label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input type="checkbox" checked={product.is_coming_soon || false} onChange={(e) => setProduct({...product, is_coming_soon: e.target.checked})} className="w-5 h-5 accent-blue-500 cursor-pointer" id="comingSoon" />
                  <label htmlFor="comingSoon" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2 select-none">
                    <Calendar className="w-4 h-4 text-blue-400" /> عرض كـ "يأتي قريباً"
                  </label>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting || uploadingIndex !== null} className="w-full bg-gold text-black font-extrabold py-5 rounded-2xl hover:bg-[#c5a035] transition-all mt-4">
                {isSubmitting ? "جاري الحفظ..." : (product.id ? "تحديث المنتج" : "نشر المنتج الآن")}
              </button>
              
              {product.id && (
                <button type="button" onClick={() => setProduct({ 
                  id: "", name: "", subtitle: "", price: "", category: "عناية بالبشرة", 
                  image: "", desc: "", is_best_seller: false, discount_percentage: 0, is_coming_soon: false,
                  images: ["", "", ""]
                })} className="w-full text-gray-500 text-sm hover:text-white transition-colors">إلغاء التعديل</button>
              )}
            </form>
          </section>

          {/* قائمة المنتجات الحالية الجانبية */}
          <section className="bg-black/40 border border-white/5 p-8 rounded-[2rem] h-fit max-h-[85vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-8">المنتجات الحالية ({products.length})</h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {products.map((item) => {
                const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
                const displayPrice = hasDiscount ? item.price - (item.price * item.discount_percentage / 100) : item.price;

                return (
                  <div key={item.id} className={`flex items-center justify-between bg-white/5 p-4 rounded-2xl border group hover:border-gold/30 transition-all relative overflow-hidden ${item.is_coming_soon ? 'border-blue-500/20' : 'border-white/5'}`}>
                    <div className="absolute top-0 right-0 flex">
                      {item.is_best_seller && (
                        <div className="w-7 h-7 bg-gold flex items-center justify-center rounded-bl-lg">
                          <Star className="w-3.5 h-3.5 text-black fill-black" />
                        </div>
                      )}
                      {item.is_coming_soon && (
                        <div className="w-7 h-7 bg-blue-500 flex items-center justify-center rounded-bl-lg">
                          <Calendar className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm pr-2 flex items-center gap-2">
                          {item.name}
                          {hasDiscount && <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono">-{item.discount_percentage}%</span>}
                        </h4>
                        <p className="text-gold text-xs font-medium pr-2">
                          {displayPrice} AED {hasDiscount && <span className="text-gray-500 line-through text-[10px] mr-1">{item.price} AED</span>} • <span className="text-gray-500">{item.category}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setProduct({
                        id: item.id, name: item.name, subtitle: item.subtitle || "", price: item.price.toString(),
                        category: item.category, image: item.image || "", desc: item.desc || "", is_best_seller: !!item.is_best_seller,
                        discount_percentage: item.discount_percentage || 0, is_coming_soon: !!item.is_coming_soon,
                        images: item.images && item.images.length === 3 ? item.images : [item.image || "", "", ""] 
                      })} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => setConfirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}