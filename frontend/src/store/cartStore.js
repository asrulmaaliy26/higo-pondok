import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global Cart Store
 * 
 * Structure:
 * {
 *   [canteen_id]: {
 *     canteen: { id, name, whatsapp_number, delivery_fee, is_open, ... },
 *     items: {
 *       [product_id]: { product: {...}, quantity: N }
 *     }
 *   }
 * }
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: {}, // keyed by canteen_id

      // Add item to cart from a specific canteen
      addItem: (canteen, product) => {
        set((state) => {
          const canteenId = String(canteen.id);
          const productId = String(product.id);
          const prevCanteenCart = state.cart[canteenId] || { canteen, items: {} };
          const prevItem = prevCanteenCart.items[productId];
          const newQuantity = prevItem ? prevItem.quantity + 1 : 1;

          if (newQuantity > product.stock) return state; // guard stock

          return {
            cart: {
              ...state.cart,
              [canteenId]: {
                canteen,
                items: {
                  ...prevCanteenCart.items,
                  [productId]: { product, quantity: newQuantity }
                }
              }
            }
          };
        });
      },

      // Remove one unit; if 0, remove item from canteen; if canteen empty, remove canteen
      removeItem: (canteenId, productId) => {
        set((state) => {
          const cid = String(canteenId);
          const pid = String(productId);
          const prevCanteenCart = state.cart[cid];
          if (!prevCanteenCart) return state;

          const prevItem = prevCanteenCart.items[pid];
          if (!prevItem) return state;

          let newItems;
          if (prevItem.quantity > 1) {
            newItems = {
              ...prevCanteenCart.items,
              [pid]: { ...prevItem, quantity: prevItem.quantity - 1 }
            };
          } else {
            newItems = { ...prevCanteenCart.items };
            delete newItems[pid];
          }

          // If canteen has no more items, remove it
          if (Object.keys(newItems).length === 0) {
            const newCart = { ...state.cart };
            delete newCart[cid];
            return { cart: newCart };
          }

          return {
            cart: {
              ...state.cart,
              [cid]: { ...prevCanteenCart, items: newItems }
            }
          };
        });
      },

      // Remove all items from a specific canteen
      clearCanteen: (canteenId) => {
        set((state) => {
          const newCart = { ...state.cart };
          delete newCart[String(canteenId)];
          return { cart: newCart };
        });
      },

      // Clear all
      clearAll: () => set({ cart: {} }),

      // Getters
      getTotalItems: () => {
        const { cart } = get();
        return Object.values(cart).reduce((sum, c) =>
          sum + Object.values(c.items).reduce((s, i) => s + i.quantity, 0), 0
        );
      },

      getCanteenItems: (canteenId) => {
        const { cart } = get();
        return cart[String(canteenId)]?.items || {};
      },
    }),
    {
      name: 'higo-cart',
    }
  )
);
