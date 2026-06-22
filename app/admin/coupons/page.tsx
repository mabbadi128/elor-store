"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, ArrowRight, Home, Package, ShoppingBag, LogOut, Ticket, Edit2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", limit: "" });
  
  // حالة للتعديل
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ discount: "", limit: "" });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*");
    setCoupons(data || []);
    setLoading(false);
  };

  const addCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) return;
    await supabase.from("coupons").insert([{
      code: newCoupon.code.toUpperCase(),
      discount_percent: parseInt(newCoupon.discount),
      usage_limit: parseInt(newCoupon.limit) || 100
    }]);
    setNewCoupon({ code: "", discount: "", limit: "" });
    fetchCoupons();
  };

  const deleteCoupon = async (id: number) => {
    await supabase.from("coupons").delete().eq("id", id);
    fetchCoupons();
  };

  const updateCoupon = async (id: number) => {
    await supabase.from("coupons").update({
      discount_percent: parseInt(editForm.discount),
      usage_limit: parseInt(editForm.limit)
    }).eq("id", id);
    setEditingId(null);
    fetchCoupons();
  };

  return (
    <div className="flex min-h-screen bg-black" dir="rtl">
      {/* الشريط الجانبي */}
      <aside className="w-72 bg-black border-l border-white/5 p-8 flex flex-col sticky top-0 h-screen">
        <h1 className="text-3xl font-extrabold text-gold mb-10 tracking-widest text-center">ELOR ADMIN</h1>
        <nav className="flex-1 space-y-3">
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <Home className="w-5 h-5 text-gold" /> العودة للرئيسية
          </button>
           <button onClick={() => router.push("/admin")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <Package className="w-5 h-5 text-gold" /> إدارة المنتجات
          </button>
          <button onClick={() => router.push("/admin/orders")} className="w-full flex items-center gap-4 text-white hover:bg-gold/10 p-4 rounded-xl transition-all">
            <ShoppingBag className="w-5 h-5 text-gold" /> إدارة الطلبات
          </button>
          
          <button className="w-full flex items-center gap-4 bg-gold/10 text-gold p-4 rounded-xl">
            <Ticket className="w-5 h-5" /> إدارة الكوبونات
          </button>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-8 text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gold">إدارة الكوبونات</h1>
        </div>
        
        {/* نموذج الإضافة */}
        <div className="flex gap-4 bg-[#0a0a0a] p-6 rounded-xl border border-white/10 mb-8">
          <input placeholder="الرمز (ELOR10)" className="bg-black p-2 rounded border border-white/20 flex-1" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})} />
          <input placeholder="الخصم %" className="bg-black p-2 rounded border border-white/20 w-24" value={newCoupon.discount} onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})} />
          <input placeholder="الحد" className="bg-black p-2 rounded border border-white/20 w-24" value={newCoupon.limit} onChange={(e) => setNewCoupon({...newCoupon, limit: e.target.value})} />
          <button onClick={addCoupon} className="bg-gold text-black px-4 py-2 rounded font-bold hover:bg-gold-light transition-all flex items-center gap-2">
            <Plus size={18}/> إضافة
          </button>
        </div>

        {/* الجدول */}
        <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase">
                <th className="p-4">الكود</th>
                <th className="p-4">الخصم</th>
                <th className="p-4">الاستخدامات</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="p-4 font-bold text-gold">{c.code}</td>
                  <td className="p-4">
                    {editingId === c.id ? (
                      <input className="w-16 bg-black border border-gold p-1" defaultValue={c.discount_percent} onChange={(e) => setEditForm({...editForm, discount: e.target.value})} />
                    ) : `${c.discount_percent}%`}
                  </td>
                  <td className="p-4">
                    {editingId === c.id ? (
                      <input className="w-16 bg-black border border-gold p-1" defaultValue={c.usage_limit} onChange={(e) => setEditForm({...editForm, limit: e.target.value})} />
                    ) : `${c.used_count} / ${c.usage_limit}`}
                  </td>
                  <td className="p-4 flex gap-3">
                    {editingId === c.id ? (
                      <>
                        <Save className="text-green-500 cursor-pointer" size={18} onClick={() => updateCoupon(c.id)} />
                        <X className="text-gray-400 cursor-pointer" size={18} onClick={() => setEditingId(null)} />
                      </>
                    ) : (
                      <>
                        <Edit2 className="text-blue-500 cursor-pointer" size={18} onClick={() => { setEditingId(c.id); setEditForm({ discount: c.discount_percent, limit: c.usage_limit }); }} />
                        <Trash2 className="text-red-500 cursor-pointer" size={18} onClick={() => deleteCoupon(c.id)} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}