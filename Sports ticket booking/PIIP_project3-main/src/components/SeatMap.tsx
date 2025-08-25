import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Event, Seat } from '../types';
import { generateSeats } from '../data/mockData';

interface SeatMapProps {
  event: Event;
  onSeatSelect: (seats: Seat[]) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ event, onSeatSelect }) => {
  const [seats] = useState<Seat[]>(() => generateSeats(event.id));
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      const updated = selectedSeats.filter(s => s.id !== seat.id);
      setSelectedSeats(updated);
    } else {
      if (selectedSeats.length < 8) { // Max 8 seats per transaction
        const updated = [...selectedSeats, { ...seat, status: 'selected' }];
        setSelectedSeats(updated);
      }
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.some(s => s.id === seat.id)) return 'bg-yellow-400';
    if (seat.status === 'occupied') return 'bg-red-500';
    
    const category = event.categories.find(cat => cat.id === seat.category);
    return `bg-${category?.color.replace('#', '').toLowerCase()}`;
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full mb-4 relative">
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
            STAGE / FIELD
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {event.categories.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <div 
                className={`w-4 h-4 rounded`}
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-slate-300">
                {category.name} (${category.price})
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm text-slate-300">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded" />
            <span className="text-sm text-slate-300">Selected</span>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(groupedSeats)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-2">
              <div className="w-8 text-center text-slate-400 font-semibold">
                {row}
              </div>
              <div className="flex gap-1 flex-wrap">
                {rowSeats
                  .sort((a, b) => a.number - b.number)
                  .map(seat => {
                    const category = event.categories.find(cat => cat.id === seat.category);
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    
                    return (
                      <motion.button
                        key={seat.id}
                        whileHover={{ scale: seat.status === 'occupied' ? 1 : 1.2 }}
                        whileTap={{ scale: seat.status === 'occupied' ? 1 : 0.9 }}
                        className={`
                          w-8 h-8 rounded text-xs font-semibold transition-all duration-200
                          ${seat.status === 'occupied' 
                            ? 'bg-red-500 cursor-not-allowed text-white' 
                            : isSelected
                            ? 'bg-yellow-400 text-black'
                            : `cursor-pointer text-white hover:brightness-110`
                          }
                        `}
                        style={{ 
                          backgroundColor: seat.status === 'occupied' 
                            ? '#EF4444' 
                            : isSelected 
                            ? '#FDE047' 
                            : category?.color 
                        }}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'occupied'}
                        title={`Row ${seat.row}, Seat ${seat.number} - $${seat.price}`}
                      >
                        {seat.number}
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-slate-800 rounded-xl">
          <h4 className="text-white font-semibold mb-2">Selected Seats ({selectedSeats.length}/8)</h4>
          <div className="space-y-1 mb-4">
            {selectedSeats.map(seat => (
              <div key={seat.id} className="flex justify-between text-sm text-slate-300">
                <span>Row {seat.row}, Seat {seat.number}</span>
                <span>${seat.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">
              Total: ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSeatSelect(selectedSeats)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Add to Cart
            </motion.button>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Click "Add to Cart" to save your selected seats
            </p>
          </div>
        </div>
      )}
    </div>
  );
};