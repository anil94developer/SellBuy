export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  formattedPrice: string;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  location: string;
  badge?: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  ownership?: string;
  status?: 'active' | 'pending' | 'sold';
  sellerName?: string;
  sellerPhone?: string;
  sellerRating?: number;
  sellerAvatar?: string;
  sellerJoined?: string;
  sellerListingsCount?: number;
  sellerVerified?: boolean;
  isFavorite?: boolean;
  isCertified?: boolean;
  isFeatured?: boolean;
  regYear?: number;
  regCity?: string;
}

export interface CarFilter {
  searchQuery?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  fuelType?: string;
  transmission?: string;
  tab?: 'all' | 'used' | 'new' | 'certified';
  city?: string;
  page?: number;
  limit?: number;
}

export interface CreateCarInput {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  location: string;
  description?: string;
  images?: string[];
  ownership?: string;
  regYear?: number;
  regCity?: string;
}

export { User, UserRole, UserStatus } from './auth.model';
