
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCart, getCart, addToCart, removeCartItem, updateCartItem } from './medusa';

// Define the Cart store interface
interface CartStore {
  cart: any | null;
  isLoading: boolean;
  isCartOpen: boolean;
  cartId: string | null;
  itemCount: number;
  subtotal: number;
  
  initCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

// Define the User store interface
interface UserStore {
  user: any | null;
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
}

// Define the Wishlist store interface
interface WishlistStore {
  items: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

// Cart Store
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isCartOpen: false,
      cartId: null,
      itemCount: 0,
      subtotal: 0,
      
      initCart: async () => {
        const { cartId } = get();
        
        set({ isLoading: true });
        
        try {
          if (cartId) {
            const response = await getCart(cartId);
            set({ 
              cart: response.cart, 
              itemCount: response.cart.items?.length || 0,
              subtotal: response.cart.subtotal || 0
            });
          } else {
            const response = await createCart();
            set({ 
              cart: response.cart, 
              cartId: response.cart.id,
              itemCount: response.cart.items?.length || 0,
              subtotal: response.cart.subtotal || 0
            });
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error);
          // If there's an error, try creating a new cart
          const response = await createCart();
          set({ 
            cart: response.cart, 
            cartId: response.cart.id,
            itemCount: response.cart.items?.length || 0,
            subtotal: response.cart.subtotal || 0
          });
        } finally {
          set({ isLoading: false });
        }
      },
      
      refreshCart: async () => {
        const { cartId } = get();
        
        if (!cartId) return;
        
        set({ isLoading: true });
        
        try {
          const response = await getCart(cartId);
          set({ 
            cart: response.cart,
            itemCount: response.cart.items?.length || 0,
            subtotal: response.cart.subtotal || 0
          });
        } catch (error) {
          console.error('Failed to refresh cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      addItem: async (variantId, quantity) => {
        const { cartId } = get();
        
        set({ isLoading: true });
        
        try {
          if (!cartId) {
            await get().initCart();
          }
          
          // Get the latest cartId in case it was just initialized
          const currentCartId = get().cartId;
          if (!currentCartId) throw new Error('No cart ID available');
          
          const response = await addToCart(currentCartId, variantId, quantity);
          set({ 
            cart: response.cart,
            itemCount: response.cart.items?.length || 0,
            subtotal: response.cart.subtotal || 0,
            isCartOpen: true
          });
        } catch (error) {
          console.error('Failed to add item to cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateItem: async (lineId, quantity) => {
        const { cartId } = get();
        
        if (!cartId) return;
        
        set({ isLoading: true });
        
        try {
          const response = await updateCartItem(cartId, lineId, quantity);
          set({ 
            cart: response.cart,
            itemCount: response.cart.items?.length || 0,
            subtotal: response.cart.subtotal || 0
          });
        } catch (error) {
          console.error('Failed to update item quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      removeItem: async (lineId) => {
        const { cartId } = get();
        
        if (!cartId) return;
        
        set({ isLoading: true });
        
        try {
          const response = await removeCartItem(cartId, lineId);
          set({ 
            cart: response.cart,
            itemCount: response.cart.items?.length || 0,
            subtotal: response.cart.subtotal || 0
          });
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCart: () => set({ isCartOpen: false }),
      openCart: () => set({ isCartOpen: true }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);

// User Store
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Wishlist Store
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product) => set((state) => {
        if (!state.items.some(item => item.id === product.id)) {
          return { items: [...state.items, product] };
        }
        return state;
      }),
      
      removeFromWishlist: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
