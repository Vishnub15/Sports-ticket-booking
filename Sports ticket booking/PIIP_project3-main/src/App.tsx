import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { EventCard } from './components/EventCard';
import { SeatMap } from './components/SeatMap';
import { Cart } from './components/Cart';
import { useCart } from './context/CartContext';
import { mockEvents } from './data/mockData';
import { Event, Seat } from './types';

function AppContent() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return mockEvents;
    
    return mockEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleSeatSelect = (seats: Seat[]) => {
    if (selectedEvent) {
      addToCart(selectedEvent.id, selectedEvent.title, seats);
      setIsCartOpen(true);
    }
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header
          onCartOpen={() => setIsCartOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="container mx-auto px-4 py-8">
          {selectedEvent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <button
                  onClick={handleBackToEvents}
                  className="text-blue-400 hover:text-blue-300 transition-colors mb-4"
                >
                  ← Back to Events
                </button>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                <p className="text-xl text-slate-300">
                  {selectedEvent.homeTeam} vs {selectedEvent.awayTeam}
                </p>
              </div>
              <SeatMap event={selectedEvent} onSeatSelect={handleSeatSelect} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Upcoming Events</h2>
                <p className="text-xl text-slate-300">
                  Discover amazing sports events and secure your seats
                </p>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-slate-400">No events found matching your search.</p>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EventCard event={event} onSelect={handleEventSelect} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;