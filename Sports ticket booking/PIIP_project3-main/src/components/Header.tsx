import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartOpen: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartOpen, searchTerm, onSearchChange }) => {
  const { getTotalItems } = useCart();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              SportsTicket Pro
            </motion.h1>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Events</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Sports</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Venues</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">My Tickets</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCartOpen}
              className="relative bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>

            <button className="md:hidden text-slate-300 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};