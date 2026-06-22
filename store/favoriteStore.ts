import { create } from "zustand";
import { persist } from "zustand/middleware";

// نفس واجهة بيانات المنتج اللي بنستخدمها بالكارت
interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  subtitle: string;
}

interface FavoriteState {
  favorites: FavoriteProduct[];
  toggleFavorite: (product: FavoriteProduct) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      // دالة ذكية: إذا المنتج موجود بتحذفه (Unlike)، وإذا مو موجود بتضيفه (Like)
      toggleFavorite: (product) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.some((p) => p.id === product.id);
        
        if (exists) {
          set({ favorites: currentFavorites.filter((p) => p.id !== product.id) });
        } else {
          set({ favorites: [...currentFavorites, product] });
        }
      },
      
      // دالة للتحقق إذا المنتج مفضل حالياً أو لا (عشان نلون القلب)
      isFavorite: (id) => get().favorites.some((p) => p.id === id),
    }),
    {
      name: "elor-favorites", // اسم الملف اللي رح ينحفظ بذاكرة المتصفح
    }
  )
);