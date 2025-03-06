import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }] });
        }
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity } 
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity, 
          0
        );
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);