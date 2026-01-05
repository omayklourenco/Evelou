
import { create } from 'zustand';
import { Event, TicketType } from '../types';

interface CartItem {
  ticket: TicketType;
  quantity: number;
}

interface CartState {
  event: Event | null;
  items: CartItem[];
  setEvent: (event: Event) => void;
  addItem: (ticket: TicketType, quantity: number) => void;
  removeItem: (ticketId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  event: null,
  items: [],
  setEvent: (event) => set({ event, items: [] }),
  addItem: (ticket, quantity) => {
    set((state) => {
      const existing = state.items.find(i => i.ticket.id === ticket.id);
      if (existing) {
        return {
          items: state.items.map(i => i.ticket.id === ticket.id ? { ...i, quantity } : i)
        };
      }
      return { items: [...state.items, { ticket, quantity }] };
    });
  },
  removeItem: (ticketId) => set((state) => ({
    items: state.items.filter(i => i.ticket.id !== ticketId)
  })),
  clearCart: () => set({ event: null, items: [] }),
  getTotal: () => {
    return get().items.reduce((acc, item) => acc + (item.ticket.price * item.quantity), 0);
  },
}));
