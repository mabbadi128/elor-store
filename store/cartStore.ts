"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 🌟 استدعاء موديل الحفظ المستمر

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number; // السعر القديم قبل الخصم
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, type: 'plus' | 'minus') => void;
  cartCount: () => number;
  getSubTotalPrice: () => number;
  getDeliveryFee: () => number;
  getTotalPrice: () => number;
  formatCurrency: (amount: number) => string;
  clearCart: () => void;
}

const DELIVERY_FEE = 20;

// 🌟 تغليف الستور بميدل وير persist لحفظ السلة بالمتصفح ومنع اختفائها عند التحديث
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, type) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
            const newQty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
      })),

      cartCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        return get().items.length > 0 ? DELIVERY_FEE : 0;
      },

      getTotalPrice: () => {
        const subTotal = get().getSubTotalPrice();
        const delivery = get().getDeliveryFee();
        return subTotal + delivery;
      },

      formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          minimumFractionDigits: 0,
        }).format(amount).replace('AED', 'د.إ');
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'elor-cart-storage', // 🌟 اسم المفتاح الفريد لحفظ السلة في متصفح العميل
    }
  )
);