"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Cart item interface
export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

// Cart context interface
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => { },
  updateQuantity: () => { },
  removeItem: () => { },
  clearCart: () => { },
  totalItems: 0,
  totalPrice: 0,
});

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);

// Helper function to get cart from localStorage
const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart state with data from localStorage
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const cartItems = getCartFromStorage();
    setItems(cartItems);
    setIsInitialized(true);
  }, []);

  // Handle storage events (for multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cart') {
        try {
          const newCart = event.newValue ? JSON.parse(event.newValue) : [];
          setItems(newCart);
        } catch (error) {
          console.error("Error handling storage event:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(items);
    }
  }, [items, isInitialized]);

  // Calculate total items and price
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === newItem.productId);

      if (existingItemIndex >= 0) {
        // Create a new array with the updated item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...newItem }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems =>
      prevItems.filter(item => item.productId !== productId)
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("cart");
    }
  };

  // Context value
  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};