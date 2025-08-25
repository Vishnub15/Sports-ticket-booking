import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Seat } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (eventId: string, eventTitle: string, seats: Seat[]) => void;
  removeFromCart: (eventId: string, seatId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (eventId: string, eventTitle: string, seats: Seat[]) => {
    const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.eventId === eventId);
      
      if (existingItem) {
        return prev.map(item =>
          item.eventId === eventId
            ? {
                ...item,
                seats: [...item.seats, ...seats],
                totalPrice: item.totalPrice + totalPrice
              }
            : item
        );
      }
      
      return [...prev, {
        eventId,
        eventTitle,
        seats,
        totalPrice
      }];
    });
  };

  const removeFromCart = (eventId: string, seatId: string) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.eventId === eventId) {
          const updatedSeats = item.seats.filter(seat => seat.id !== seatId);
          const updatedPrice = updatedSeats.reduce((sum, seat) => sum + seat.price, 0);
          
          return {
            ...item,
            seats: updatedSeats,
            totalPrice: updatedPrice
          };
        }
        return item;
      }).filter(item => item.seats.length > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.seats.length, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};