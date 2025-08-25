export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  image: string;
  priceRange: {
    min: number;
    max: number;
  };
  categories: SeatCategory[];
}

export interface SeatCategory {
  id: string;
  name: string;
  price: number;
  color: string;
  available: number;
  total: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  category: string;
  status: 'available' | 'selected' | 'occupied';
  price: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  seat: {
    section: string;
    row: string;
    number: number;
  };
  price: number;
  qrCode: string;
  purchaseDate: string;
}

export interface CartItem {
  eventId: string;
  eventTitle: string;
  seats: Seat[];
  totalPrice: number;
}