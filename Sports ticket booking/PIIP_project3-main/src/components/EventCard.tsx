import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const availableSeats = event.categories.reduce((sum, cat) => sum + cat.available, 0);
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer border border-slate-700/50"
      onClick={() => onSelect(event)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {event.sport}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${event.priceRange.min} - ${event.priceRange.max}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <p className="text-lg text-blue-400 mb-4">{event.homeTeam} vs {event.awayTeam}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-300">
            <Calendar className="w-4 h-4 mr-3 text-blue-400" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Clock className="w-4 h-4 mr-3 text-blue-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <MapPin className="w-4 h-4 mr-3 text-blue-400" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Users className="w-4 h-4 mr-3 text-green-400" />
            <span>{availableSeats} seats available</span>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Select Seats
        </motion.button>
      </div>
    </motion.div>
  );
};