"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Loader2, Package, CheckCircle, Clock, XCircle, 
  Search, MapPin, Phone, Home, ShoppingBag, LogOut, 
  Trash2, MessageCircle, AlertCircle, FileText, Download, X,
  CheckCircle2 // <-- أضف هذه هنا
} from "lucide-react";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState(false); 

  // حالات النوافذ المنبثقة (Modals)
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  
  // حالة نافذة الفاتورة النشطة
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);
  

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.role === 'admin') {
        setIsAdmin(true);
        fetchOrders();
      } else {
        router.push("/");
      }
    };
    initPage();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };


  const togglePaymentStatus = async (orderId: string, currentStatus: string) => {
  const newStatus = currentStatus === "تم الدفع" ? "لم يتم الدفع" : "تم الدفع";
  
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: newStatus })
    .eq('id', orderId);

  if (!error) {
    // تحديث الواجهة فوراً
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o)
    );
  } else {
    alert("حدث خطأ أثناء تحديث حالة الدفع");
  }
};

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "ملغي") {
      setCancelModal(orderId); 
      setCancelReason("");
    } else {
      updateOrderStatus(orderId, newStatus, "");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, reason: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === "ملغي") {
      updateData.cancellation_reason = reason;
    }

    const { error } = await supabase.from("orders").update(updateData).eq("id", orderId);

    if (error) {
      alert("حدث خطأ أثناء التحديث.");
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus, cancellation_reason: reason } : order
      ));
      setCancelModal(null);
    }
  };

  const executeDelete = async () => {
    if (!deleteModal) return;
    const { error } = await supabase.from('orders').delete().eq("id", deleteModal);
    if (!error) {
      setOrders(orders.filter(order => order.id !== deleteModal));
    }
    setDeleteModal(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(amount).replace('AED', 'د.إ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-AE", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // دالة الحفظ والطباعة الذكية المعدلة
  const handleDownloadPDF = () => {
    if (!activeInvoice) return;
    setIsDownloading(true);
    
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 50);
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer_phone.includes(searchTerm)
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative" dir="rtl">
      
      {/* 🌟 تعديل الـ CSS لحل مشكلة الصفحة البيضاء وإظهار محتوى الفاتورة مجبرة 100% وقت الطباعة */}
      <style jsx global>{`
        @media print {
          /* إخفاء التطبيق الرئيسي بالخلفية */
          main, aside, select, button, .no-print {
            display: none !important;
          }
          /* إلغاء تموضع النوافذ المنبثقة لتظهر على كامل الصفحة المطبوعة */
          .fixed {
            position: absolute !important;
            inset: 0 !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          /* إجبار حاوية الفاتورة الداخلية على الظهور كلياً باللون الأبيض والأشرطة المخفية */
          .fixed > div {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            max-h: 100% !important;
            height: auto !important;
            display: block !important;
          }
          #invoice-print-section {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .print-card-box {
            border: 1px solid #e5e7eb !important;
            background: white !important;
            color: black !important;
            padding: 24px !important;
            border-radius: 0px !important;
          }
          /* تعديل النصوص لتظهر واضحة وحادة على الحبر الورقي والـ PDF */
          .print-card-box *, #invoice-print-section * {
            color: black !important;
            display: block;
          }
          /* تصحيح عرض جداول المنتجات لتظهر منسقة ومصطفة */
          table { display: table !important; width: 100% !important; }
          thead { display: table-header-group !important; background-color: #f9fafb !important; }
          tbody { display: table-row-group !important; }
          tr { display: table-row !important; }
          th, td { display: table-cell !important; padding: 12px !important; border-bottom: 1px solid #e5e7eb !important; }
          .text-gold-print { color: #b38f2e !important; font-weight: bold !important; display: inline-block !important; }
          .text-muted-print { color: #6b7280 !important; }
        }
      `}</style>
      

      {/* ================= نوافذ الفواتير والإلغاء والحذف ================= */}
      
      {/* نافذة الفاتورة الاحترافية المعزولة والمصممة بدقة */}
      {activeInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity">
          <div className="bg-[#0a0a0a] border border-gold/30 rounded-[2rem] shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            {/* رأس النافذة */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 no-print">
              <h3 className="text-xl font-bold text-gold flex items-center gap-2">
                <FileText className="w-5 h-5" /> فاتورة العميل الفاخرة
              </h3>
              <button onClick={() => setActiveInvoice(null)} className="text-gray-400 hover:text-white p-2 rounded-lg bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* الجزء المخصص للطباعة والـ PDF المعزول */}
            <div className="p-8 overflow-y-auto flex-1 bg-[#0a0a0a]" id="invoice-print-section">
              <div className="print-card-box border border-white/10 p-6 rounded-2xl bg-black/40 space-y-6">
                
                {/* ترويسة البراند الفخم بالفاتورة */}
                <div className="flex justify-between items-start border-b border-dashed border-white/10 pb-6 border-print">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#b38f2e] tracking-widest text-gold-print">ELOR</h2>
                    <p className="text-xs text-gray-500 mt-1 text-muted-print">Luxury You Can Feel</p>
                  </div>
                  <div className="text-left">
                    <span className="bg-[#b38f2e]/10 text-[#b38f2e] text-xs font-mono font-bold px-3 py-1 rounded-md border border-[#b38f2e]/20 text-gold-print">
                      طلب رقم: #{activeInvoice.id.slice(0, 8).toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-2 font-mono text-muted-print">{formatDate(activeInvoice.created_at)}</p>
                  </div>
                </div>

                {/* بيانات العميل والتوصيل */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-xl border-print">
                  <div>
                    <span className="text-gray-400 block text-xs mb-1 text-muted-print">العميل المستلم:</span>
                    <span className="font-bold text-white">{activeInvoice.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1 text-muted-print">رقم التواصل:</span>
                    <span className="font-bold text-white font-mono" dir="ltr">{activeInvoice.customer_phone}</span>
                  </div>
                  <div className="sm:col-span-2 border-t border-white/5 pt-3 mt-1 border-print">
                    <span className="text-gray-400 block text-xs mb-1 text-muted-print">عنوان التوصيل (الإمارات):</span>
                    <span className="text-gray-300 leading-relaxed font-medium">{activeInvoice.customer_address}</span>
                  </div>
                </div>

                {/* جدول المنتجات */}
                <div className="space-y-3">
                  <span className="text-[#b38f2e] font-bold text-xs block mb-2 text-gold-print">تفاصيل المنتجات الفاخرة</span>
                  <div className="border border-white/5 rounded-xl overflow-hidden border-print">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-white/5 text-gray-500 text-xs border-b border-white/5 text-muted-print">
                        <tr>
                          <th className="p-3">المنتج</th>
                          <th className="p-3 text-center">الكمية</th>
                          <th className="p-3 text-left">السعر الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 border-print">
                        {activeInvoice.items.map((item: any, index: number) => (
                          <tr key={index} className="border-print">
                            <td className="p-3 font-medium text-gray-200">{item.name}</td>
                            <td className="p-3 text-center font-bold text-[#b38f2e] text-gold-print">x{item.quantity}</td>
                            <td className="p-3 text-left text-gray-300">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
<div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
  <div className="flex justify-between items-center">
    <span className="text-gray-400 text-sm">حالة الدفع الحالية:</span>
    <span className={`font-bold px-3 py-1 rounded-full text-xs ${
      activeInvoice.payment_status === 'تم الدفع' 
        ? 'bg-green-500/20 text-green-500' 
        : 'bg-red-500/20 text-red-500'
    }`}>
      {activeInvoice.payment_status || "لم يتم الدفع"}
    </span>
  </div>
</div>
                {/* الحسابات النهائية الشاملة */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-sm border-print">
                  <div className="flex justify-between text-gray-400 text-muted-print">
                    <span>المجموع الفرعي للمنتجات</span>
                    <span>{formatCurrency(activeInvoice.total_price - 20)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-muted-print">
                    <span>رسوم التوصيل الثابتة (الإمارات)</span>
                    <span>{formatCurrency(20)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-dashed border-white/10 border-print">
                    <span>  الإجمالي الكلي المستحق</span>
                    <span className="text-[#b38f2e] text-gold-print">{formatCurrency(activeInvoice.total_price)}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ذيل النافذة لأمر الحفظ المباشر */}
            <div className="p-6 border-t border-white/5 flex gap-4 bg-white/5 no-print">
              <button onClick={() => setActiveInvoice(null)} className="flex-1 py-3.5 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition">إغلاق</button>
              <button 
                onClick={handleDownloadPDF} 
                disabled={isDownloading}
                className="flex-1 py-3.5 rounded-xl font-extrabold bg-gold text-black hover:bg-[#c5a035] transition flex items-center justify-center gap-2 shadow-lg shadow-gold/10 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تحضير الـ PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>تحميل الفاتورة PDF</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. نافذة سبب الإلغاء */}
      {cancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-[#0a0a0a] border border-red-500/50 p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2"><XCircle className="w-6 h-6"/> سبب الإلغاء</h3>
            <p className="text-gray-400 mb-4 text-sm">يرجى كتابة سبب إلغاء هذا الطلب للرجوع إليه لاحقاً.</p>
            <textarea 
              rows={3} 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="مثال: الزبون لا يرد، أخطأ في الطلب..." 
              className="w-full bg-black border border-white/20 p-4 rounded-xl outline-none focus:border-red-500 text-white resize-none mb-6"
            />
            <div className="flex gap-4">
              <button onClick={() => setCancelModal(null)} className="flex-1 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition">تراجع</button>
              <button onClick={() => updateOrderStatus(cancelModal, "ملغي", cancelReason)} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition">تأكيد الإلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. نافذة تأكيد الحذف النهائي */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-[#0a0a0a] border border-red-500/30 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-300 text-center">
            <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">حذف الطلب؟</h3>
            <p className="text-gray-400 mb-8 text-sm">هل أنت متأكد من مسح هذا الطلب نهائياً من السجلات؟</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition">تراجع</button>
              <button onClick={executeDelete} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= الشريط الجانبي ================= */}
      <aside className="w-full md:w-72 bg-black border-l border-white/5 p-8 flex flex-col sticky top-0 h-fit md:h-screen z-10">
        <h1 className="text-3xl font-extrabold text-gold mb-10 tracking-widest text-center">ELOR ADMIN</h1>
        <nav className="flex-1 space-y-3">
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <Home className="w-5 h-5 text-gold" /> العودة للرئيسية
          </button>
          <button onClick={() => router.push("/admin")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <Package className="w-5 h-5 text-gold" /> إدارة المنتجات
          </button>
          <button className="w-full flex items-center gap-4 text-gold bg-gold/5 border border-gold/20 p-4 rounded-xl transition-all">
            <ShoppingBag className="w-5 h-5" /> إدارة الطلبات
          </button>
                    <button onClick={() => router.push("/admin/coupons")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
  <CheckCircle2 className="w-5 h-5 text-gold" /> إدارة الكوبونات
</button>
        </nav>
        <button onClick={() => { supabase.auth.signOut(); router.push("/login"); }} className="flex items-center gap-4 text-red-500/70 hover:text-red-500 p-4 mt-10 border-t border-white/5 pt-8 transition-colors">
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </aside>

      {/* ================= المحتوى الرئيسي ================= */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 border-r-4 border-gold pr-4 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gold flex items-center gap-3">
                <ShoppingBag className="w-8 h-8" /> إدارة الطلبات
              </h1>
              <p className="text-gray-400 text-sm mt-2">متابعة وتحديث طلبات العملاء ({orders.length} طلب)</p>
            </div>

            {/* شريط البحث */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو رقم الهاتف..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-full py-3 pr-12 pl-4 focus:border-gold outline-none text-white transition-all"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <Search className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-xl font-bold">لا يوجد نتائج</h2>
              <p className="text-gray-500 mt-2">لم يتم العثور على طلبات مطابقة لبحثك.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className={`bg-[#0a0a0a] border rounded-2xl overflow-hidden shadow-lg transition-all hover:border-gold/30 ${order.status === 'ملغي' ? 'border-red-500/20 opacity-80' : 'border-white/10'}`}>
                  
                  {/* رأس الطلب والإجراءات */}
                  <div className="bg-white/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10">
                    <div>
                      <h3 className="font-bold text-lg">{order.customer_name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setActiveInvoice(order)}
                        className="flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-black px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                        title="عرض الفاتورة الرسمية وتحميلها PDF"
                      >
                        
                        <FileText className="w-4 h-4" /> الفاتورة
                      </button>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        
  {/* زر حالة الدفع */}
  <button
    onClick={() => togglePaymentStatus(order.id, order.payment_status)}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
      order.payment_status === "تم الدفع" 
        ? "bg-green-500/20 text-green-500 border border-green-500/30" 
        : "bg-red-500/20 text-red-500 border border-red-500/30"
    }`}
  >
    {order.payment_status === "تم الدفع" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
    {order.payment_status || "لم يتم الدفع"}
  </button>

  

</div>

  



                      <div className="w-px h-6 bg-white/10 mx-1"></div>

                      <span className="text-sm text-gray-400">الحالة:</span>
                      <select 
                        value={order.status || 'قيد الانتظار'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`bg-black border rounded-lg px-3 py-2 text-sm font-bold outline-none cursor-pointer transition-colors ${
                          order.status === 'تم التوصيل' ? 'border-green-500 text-green-500' : 
                          order.status === 'ملغي' ? 'border-red-500 text-red-500' : 
                          order.status === 'في الطريق إليك' ? 'border-blue-500 text-blue-500' : 'border-gold text-gold'
                        }`}
                      >
                        <option value="قيد الانتظار">⏳ قيد الانتظار</option>
                        <option value="قيد التجهيز">📦 قيد التجهيز</option>
                        <option value="في الطريق إليك">🚚 في الطريق إليك</option>
                        <option value="تم التوصيل">✅ تم التوصيل</option>
                        <option value="ملغي">❌ ملغي</option>
                      </select>

                      <div className="w-px h-6 bg-white/10 mx-1"></div>

                      <button 
                        onClick={() => setDeleteModal(order.id)} 
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="مسح الطلب نهائياً"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* تفاصيل الطلب */}
                  <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-gold font-bold text-sm border-b border-white/5 pb-2">بيانات التوصيل والتواصل</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span dir="ltr" className="font-bold">{order.customer_phone}</span>
                        <a 
                          href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold hover:bg-green-500 hover:text-white transition-all ml-auto"
                        >
                          <MessageCircle className="w-3 h-3" /> مراسلة
                        </a>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{order.customer_address}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-gold font-bold text-sm border-b border-white/5 pb-2">المنتجات المطلوبة</h4>
                      <div className="max-h-32 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="bg-white/10 text-white px-2 py-0.5 rounded text-xs font-bold">x{item.quantity}</span>
                              <span className="text-gray-300 truncate w-32 md:w-40">{item.name}</span>
                            </div>
                            <span className="text-gray-400">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="font-bold text-white">الإجمالي الكلي:</span>
                        <span className="font-bold text-gold text-lg">{formatCurrency(order.total_price)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}