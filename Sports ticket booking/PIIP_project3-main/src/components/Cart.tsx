import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, CreditCard, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateQRCode } from '../utils/qrCode';
import { Ticket } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate tickets with QR codes
    const generatedTickets: Ticket[] = [];
    
    for (const item of cartItems) {
      for (const seat of item.seats) {
        const ticketData = {
          eventId: item.eventId,
          eventTitle: item.eventTitle,
          seat: {
            section: seat.category,
            row: seat.row,
            number: seat.number
          },
          price: seat.price,
          purchaseDate: new Date().toISOString()
        };
        
        const qrCode = await generateQRCode(JSON.stringify(ticketData));
        
        generatedTickets.push({
          id: `ticket-${Date.now()}-${seat.id}`,
          ...ticketData,
          qrCode
        });
      }
    }
    
    setTickets(generatedTickets);
    clearCart();
    setIsProcessing(false);
    setShowCheckout(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!showCheckout ? (
                <>
                  {cartItems.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                          <div key={item.eventId} className="bg-slate-800 rounded-lg p-4">
                            <h3 className="font-semibold text-white mb-2">{item.eventTitle}</h3>
                            <div className="space-y-1">
                              {item.seats.map(seat => (
                                <div key={seat.id} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-300">
                                    Row {seat.row}, Seat {seat.number}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white">${seat.price}</span>
                                    <button
                                      onClick={() => removeFromCart(item.eventId, seat.id)}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-slate-700 mt-2 pt-2">
                              <div className="flex justify-between font-semibold">
                                <span className="text-slate-300">Subtotal:</span>
                                <span className="text-white">${item.totalPrice}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-700 pt-4 mb-6">
                        <div className="flex justify-between items-center text-xl font-bold text-white">
                          <span>Total:</span>
                          <span>${getTotalPrice()}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Proceed to Checkout
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="text-green-400 mb-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                    <p className="text-slate-300 mb-6">Your tickets have been generated</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="bg-slate-800 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">{ticket.eventTitle}</h4>
                        <div className="text-sm text-slate-300 mb-3">
                          <p>Section: {ticket.seat.section}</p>
                          <p>Row: {ticket.seat.row}, Seat: {ticket.seat.number}</p>
                          <p>Price: ${ticket.price}</p>
                        </div>
                        {ticket.qrCode && (
                          <div className="flex justify-center mb-3">
                            <img src={ticket.qrCode} alt="QR Code" className="w-24 h-24" />
                          </div>
                        )}
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Ticket
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setTickets([]);
                      onClose();
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};