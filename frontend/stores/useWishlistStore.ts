
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  favorites: string[]; // IDs dos eventos
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (eventId: string) => {
        const current = get().favorites;
        const isFav = current.includes(eventId);
        if (isFav) {
          set({ favorites: current.filter(id => id !== eventId) });
        } else {
          set({ favorites: [...current, eventId] });
        }
      },
      isFavorite: (eventId: string) => get().favorites.includes(eventId),
    }),
    {
      name: 'evelou-wishlist',
    }
  )
);
