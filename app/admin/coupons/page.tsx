"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Plus,
  Trash2,
  Home,
  Package,
  ShoppingBag,
  Ticket,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminCouponsPage() {
  const router = useRouter();

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    limit: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    discount: "",
    limit: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*");
    setCoupons(data || []);
    setLoading(false);
  };

  const addCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) return;

    await supabase.from("coupons").insert([
      {
        code: newCoupon.code.toUpperCase(),
        discount_percent: parseInt(newCoupon.discount),
        usage_limit: parseInt(newCoupon.limit) || 100,
      },
    ]);

    setNewCoupon({ code: "", discount: "", limit: "" });
    fetchCoupons();
  };

  const deleteCoupon = async (id: number) => {
    await supabase.from("coupons").delete().eq("id", id);
    fetchCoupons();
  };

  const updateCoupon = async (id: number) => {
    await supabase
      .from("coupons")
      .update({
        discount_percent: parseInt(editForm.discount),
        usage_limit: parseInt(editForm.limit),
      })
      .eq("id", id);

    setEditingId(null);
    fetchCoupons();
  };

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* هيدر الموبايل */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 px-4 py-4 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-widest text-gold">
            ELOR ADMIN
          </h1>

          <button
            onClick={() => router.push("/")}
            className="rounded-full border border-gold/30 px-4 py-2 text-sm text-gold"
          >
            الرئيسية
          </button>
        </div>

        {/* تنقل الموبايل */}
        <nav className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white"
          >
            <Package className="h-4 w-4 text-gold" />
            المنتجات
          </button>

          <button
            onClick={() => router.push("/admin/orders")}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white"
          >
            <ShoppingBag className="h-4 w-4 text-gold" />
            الطلبات
          </button>

          <button className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-gold">
            <Ticket className="h-4 w-4" />
            إدارة الكوبونات
          </button>
        </nav>
      </header>

      <div className="flex">
        {/* الشريط الجانبي للابتوب */}
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-l border-white/5 bg-black p-8 md:flex">
          <h1 className="mb-10 text-center text-3xl font-extrabold tracking-widest text-gold">
            ELOR ADMIN
          </h1>

          <nav className="flex-1 space-y-3">
            <button
              onClick={() => router.push("/")}
              className="flex w-full items-center gap-4 rounded-xl p-4 text-white transition-all hover:bg-gold/10"
            >
              <Home className="h-5 w-5 text-gold" />
              العودة للرئيسية
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="flex w-full items-center gap-4 rounded-xl p-4 text-white transition-all hover:bg-gold/10"
            >
              <Package className="h-5 w-5 text-gold" />
              إدارة المنتجات
            </button>

            <button
              onClick={() => router.push("/admin/orders")}
              className="flex w-full items-center gap-4 rounded-xl p-4 text-white transition-all hover:bg-gold/10"
            >
              <ShoppingBag className="h-5 w-5 text-gold" />
              إدارة الطلبات
            </button>

            <button className="flex w-full items-center gap-4 rounded-xl bg-gold/10 p-4 text-gold">
              <Ticket className="h-5 w-5" />
              إدارة الكوبونات
            </button>
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 px-4 py-6 md:p-8">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h1 className="text-xl font-bold text-gold md:text-2xl">
              إدارة الكوبونات
            </h1>
          </div>

          {/* نموذج الإضافة */}
          <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 md:grid-cols-[1fr_120px_120px_auto] md:p-6">
            <input
              placeholder="الرمز مثال: ELOR10"
              className="w-full rounded-xl border border-white/20 bg-black p-3 text-white outline-none focus:border-gold"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
            />

            <input
              placeholder="الخصم %"
              className="w-full rounded-xl border border-white/20 bg-black p-3 text-white outline-none focus:border-gold"
              value={newCoupon.discount}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, discount: e.target.value })
              }
            />

            <input
              placeholder="الحد"
              className="w-full rounded-xl border border-white/20 bg-black p-3 text-white outline-none focus:border-gold"
              value={newCoupon.limit}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, limit: e.target.value })
              }
            />

            <button
              onClick={addCoupon}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-bold text-black transition-all hover:bg-gold-light md:w-auto"
            >
              <Plus size={18} />
              إضافة
            </button>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center text-gold">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* جدول اللابتوب */}
              <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] md:block">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-white/5 text-sm uppercase text-gray-400">
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
                            <input
                              className="w-20 rounded border border-gold bg-black p-2 text-white"
                              defaultValue={c.discount_percent}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  discount: e.target.value,
                                })
                              }
                            />
                          ) : (
                            `${c.discount_percent}%`
                          )}
                        </td>

                        <td className="p-4">
                          {editingId === c.id ? (
                            <input
                              className="w-20 rounded border border-gold bg-black p-2 text-white"
                              defaultValue={c.usage_limit}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  limit: e.target.value,
                                })
                              }
                            />
                          ) : (
                            `${c.used_count || 0} / ${c.usage_limit}`
                          )}
                        </td>

                        <td className="flex gap-3 p-4">
                          {editingId === c.id ? (
                            <>
                              <Save
                                className="cursor-pointer text-green-500"
                                size={18}
                                onClick={() => updateCoupon(c.id)}
                              />
                              <X
                                className="cursor-pointer text-gray-400"
                                size={18}
                                onClick={() => setEditingId(null)}
                              />
                            </>
                          ) : (
                            <>
                              <Edit2
                                className="cursor-pointer text-blue-500"
                                size={18}
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditForm({
                                    discount: String(c.discount_percent),
                                    limit: String(c.usage_limit),
                                  });
                                }}
                              />
                              <Trash2
                                className="cursor-pointer text-red-500"
                                size={18}
                                onClick={() => deleteCoupon(c.id)}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* كروت الموبايل */}
              <div className="space-y-4 md:hidden">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
                        {c.code}
                      </span>

                      <div className="flex gap-3">
                        {editingId === c.id ? (
                          <>
                            <Save
                              className="cursor-pointer text-green-500"
                              size={20}
                              onClick={() => updateCoupon(c.id)}
                            />
                            <X
                              className="cursor-pointer text-gray-400"
                              size={20}
                              onClick={() => setEditingId(null)}
                            />
                          </>
                        ) : (
                          <>
                            <Edit2
                              className="cursor-pointer text-blue-500"
                              size={20}
                              onClick={() => {
                                setEditingId(c.id);
                                setEditForm({
                                  discount: String(c.discount_percent),
                                  limit: String(c.usage_limit),
                                });
                              }}
                            />
                            <Trash2
                              className="cursor-pointer text-red-500"
                              size={20}
                              onClick={() => deleteCoupon(c.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-black p-3">
                        <p className="mb-2 text-gray-400">الخصم</p>

                        {editingId === c.id ? (
                          <input
                            className="w-full rounded-lg border border-gold bg-black p-2 text-white"
                            defaultValue={c.discount_percent}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                discount: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="font-bold text-white">
                            {c.discount_percent}%
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl bg-black p-3">
                        <p className="mb-2 text-gray-400">الاستخدامات</p>

                        {editingId === c.id ? (
                          <input
                            className="w-full rounded-lg border border-gold bg-black p-2 text-white"
                            defaultValue={c.usage_limit}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                limit: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="font-bold text-white">
                            {c.used_count || 0} / {c.usage_limit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {coupons.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center text-gray-400">
                    لا يوجد كوبونات حاليًا
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}