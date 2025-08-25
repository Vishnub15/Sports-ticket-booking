import { Event, Seat } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Championship Finals',
    date: '2025-03-15',
    time: '19:00',
    venue: 'MetLife Stadium',
    sport: 'Football',
    homeTeam: 'Lions',
    awayTeam: 'Eagles',
    image: 'https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg',
    priceRange: { min: 75, max: 350 },
    categories: [
      { id: 'vip', name: 'VIP', price: 350, color: '#F59E0B', available: 50, total: 100 },
      { id: 'premium', name: 'Premium', price: 200, color: '#EF4444', available: 120, total: 200 },
      { id: 'standard', name: 'Standard', price: 125, color: '#3B82F6', available: 300, total: 500 },
      { id: 'economy', name: 'Economy', price: 75, color: '#10B981', available: 180, total: 400 }
    ]
  },
  {
    id: '2',
    title: 'Basketball Showdown',
    date: '2025-03-20',
    time: '20:30',
    venue: 'Madison Square Garden',
    sport: 'Basketball',
    homeTeam: 'Knicks',
    awayTeam: 'Lakers',
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
    priceRange: { min: 85, max: 450 },
    categories: [
      { id: 'courtside', name: 'Courtside', price: 450, color: '#F59E0B', available: 20, total: 40 },
      { id: 'premium', name: 'Premium', price: 225, color: '#EF4444', available: 80, total: 150 },
      { id: 'standard', name: 'Standard', price: 150, color: '#3B82F6', available: 200, total: 300 },
      { id: 'upper', name: 'Upper Level', price: 85, color: '#10B981', available: 250, total: 400 }
    ]
  },
  {
    id: '3',
    title: 'Soccer Derby',
    date: '2025-03-25',
    time: '15:00',
    venue: 'Yankee Stadium',
    sport: 'Soccer',
    homeTeam: 'NYCFC',
    awayTeam: 'Red Bulls',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    priceRange: { min: 45, max: 200 },
    categories: [
      { id: 'premium', name: 'Premium', price: 200, color: '#F59E0B', available: 100, total: 150 },
      { id: 'standard', name: 'Standard', price: 95, color: '#3B82F6', available: 400, total: 600 },
      { id: 'supporter', name: 'Supporter', price: 65, color: '#EF4444', available: 200, total: 300 },
      { id: 'general', name: 'General', price: 45, color: '#10B981', available: 300, total: 500 }
    ]
  }
];

export const generateSeats = (eventId: string): Seat[] => {
  const seats: Seat[] = [];
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) return seats;
  
  let seatId = 1;
  
  // Generate seats for each category
  event.categories.forEach(category => {
    const rowsPerCategory = Math.ceil(category.total / 20);
    
    for (let row = 1; row <= rowsPerCategory; row++) {
      const seatsInRow = Math.min(20, category.total - (row - 1) * 20);
      
      for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
        const isOccupied = Math.random() < 0.3; // 30% occupied
        
        seats.push({
          id: `seat-${seatId}`,
          row: String.fromCharCode(64 + row), // A, B, C, etc.
          number: seatNum,
          category: category.id,
          status: isOccupied ? 'occupied' : 'available',
          price: category.price
        });
        
        seatId++;
      }
    }
  });
  
  return seats;
};