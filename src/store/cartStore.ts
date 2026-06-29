import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  size?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string | number, size?: string) => void;
  updateQty: (id: string | number, size: string | undefined, qty: number) => void;
  clearCart: () => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const key = `${newItem.id}-${newItem.size || ''}`;
        const existingIndex = state.items.findIndex(i => `${i.id}-${i.size || ''}` === key);
        
        if (existingIndex >= 0) {
          const updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += (newItem.quantity ?? 1);
          return { items: updatedItems };
        }
        return { items: [...state.items, { ...newItem, quantity: newItem.quantity ?? 1 }] };
      }),
      removeItem: (id, size) => set((state) => ({
        items: state.items.filter(i => !(i.id === id && i.size === size))
      })),
      updateQty: (id, size, qty) => set((state) => {
        if (qty <= 0) {
          return { items: state.items.filter(i => !(i.id === id && i.size === size)) };
        }
        return {
          items: state.items.map(i => i.id === id && i.size === size ? { ...i, quantity: qty } : i)
        };
      }),
      clearCart: () => set({ items: [] }),
      totalCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: 'shona_cart',
    }
  )
);
