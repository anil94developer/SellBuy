import { Car, CarFilter, CreateCarInput } from '../models/car.model';
import { apiClient } from './apiClient';

export const INITIAL_CARS: Car[] = [
];

let inMemoryCars: Car[] = [...INITIAL_CARS];

export const carService = {
  async fetchCars(filter?: CarFilter): Promise<Car[]> {
    try {
      let queryParams: string[] = [];
      if (filter?.searchQuery) queryParams.push(`q=${encodeURIComponent(filter.searchQuery)}`);
      if (filter?.brand) queryParams.push(`brand=${encodeURIComponent(filter.brand)}`);
      if (filter?.model) queryParams.push(`model=${encodeURIComponent(filter.model)}`);
      if (filter?.minPrice) queryParams.push(`minPrice=${filter.minPrice}`);
      if (filter?.maxPrice) queryParams.push(`maxPrice=${filter.maxPrice}`);
      if (filter?.yearFrom) queryParams.push(`yearFrom=${filter.yearFrom}`);
      if (filter?.yearTo) queryParams.push(`yearTo=${filter.yearTo}`);
      if (filter?.fuelType) queryParams.push(`fuel=${encodeURIComponent(filter.fuelType)}`);
      if (filter?.transmission) queryParams.push(`transmission=${encodeURIComponent(filter.transmission)}`);
      if (filter?.tab) queryParams.push(`tab=${filter.tab}`);
      if (filter?.city) queryParams.push(`city=${encodeURIComponent(filter.city)}`);
      if (filter?.page) queryParams.push(`page=${filter.page}`);
      if (filter?.limit) queryParams.push(`limit=${filter.limit}`);

      const qs = queryParams.length ? `?${queryParams.join('&')}` : '';
      const response = await apiClient.get<any>(`/api/cars${qs}`);
      const rawList = response?.cars || response?.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((item: any): Car => {
          const numPrice = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price) || 0;
          return {
            id: String(item.id),
            title: item.title || `${item.brand_name || ''} ${item.model_name || ''} ${item.manufacturing_year || ''}`.trim(),
            brand: item.brand_name || item.brand || 'Other',
            model: item.model_name || item.model || '',
            year: item.manufacturing_year || item.reg_year || item.year || 2021,
            price: numPrice,
            formattedPrice: `₹ ${numPrice.toLocaleString('en-IN')}`,
            mileage: item.km_driven || item.mileage || 30000,
            fuelType: (item.fuel_type || item.fuelType || 'Petrol') as any,
            transmission: (item.transmission || 'Manual') as any,
            location: item.reg_city || item.location || 'Jaipur, Rajasthan',
            badge: item.is_certified ? 'Certified' : item.is_featured ? 'Featured' : 'Verified',
            imageUrl: item.primary_image?.startsWith('http')
              ? item.primary_image
              : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            images: [
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
            ],
            description: item.description || 'Well maintained car in excellent driving condition.',
            ownership: item.ownership || '1st Owner',
            status: item.status || 'active',
            sellerName: item.seller_name || item.sellerName || 'Rakesh Sharma',
            sellerPhone: item.seller_phone || item.sellerPhone || '+91 98765-43210',
            sellerRating: item.seller_rating ? Number(item.seller_rating) : 4.8,
            sellerJoined: item.seller_joined ? `Member since ${new Date(item.seller_joined).getFullYear()}` : 'Member since 2022',
            sellerListingsCount: item.seller_active_listings || 12,
            sellerVerified: Boolean(item.seller_verified ?? true),
            sellerAvatar: item.seller_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            isFavorite: Boolean(item.is_favorited || item.isFavorite),
            isCertified: Boolean(item.is_certified),
            isFeatured: Boolean(item.is_featured),
          };
        });
      }
    } catch {
      // Offline fallback
    }

    // Filter in-memory
    let result = [...inMemoryCars];
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    if (filter?.brand) {
      result = result.filter(c => c.brand.toLowerCase() === filter.brand!.toLowerCase());
    }
    if (filter?.fuelType) {
      result = result.filter(c => c.fuelType.toLowerCase() === filter.fuelType!.toLowerCase());
    }
    if (filter?.transmission) {
      result = result.filter(c => c.transmission.toLowerCase() === filter.transmission!.toLowerCase());
    }
    if (filter?.minPrice) {
      result = result.filter(c => c.price >= filter.minPrice!);
    }
    if (filter?.maxPrice) {
      result = result.filter(c => c.price <= filter.maxPrice!);
    }
    if (filter?.yearFrom) {
      result = result.filter(c => c.year >= filter.yearFrom!);
    }
    if (filter?.yearTo) {
      result = result.filter(c => c.year <= filter.yearTo!);
    }
    if (filter?.tab === 'used') {
      result = result.filter(c => c.mileage >= 10000);
    } else if (filter?.tab === 'new') {
      result = result.filter(c => c.mileage < 10000);
    } else if (filter?.tab === 'certified') {
      result = result.filter(c => c.isCertified);
    }

    return result;
  },

  async getCarById(id: string): Promise<Car | undefined> {
    try {
      const response = await apiClient.get<any>(`/api/cars/${id}`);
      if (response?.car) {
        return response.car;
      }
    } catch {
      // Fallback
    }
    return inMemoryCars.find(c => c.id === id) || inMemoryCars[0];
  },

  async createListing(input: CreateCarInput): Promise<Car> {
    const numPrice = Number(input.price) || 500000;
    const newCar: Car = {
      id: Date.now().toString(),
      title: input.title || `${input.brand} ${input.model} ${input.year}`,
      brand: input.brand,
      model: input.model,
      year: input.year,
      price: numPrice,
      formattedPrice: `₹ ${numPrice.toLocaleString('en-IN')}`,
      mileage: input.mileage,
      fuelType: input.fuelType,
      transmission: input.transmission,
      location: input.location,
      badge: 'New Listing',
      imageUrl: input.images && input.images.length > 0 ? input.images[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      images: input.images || [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      ],
      description: input.description || 'Recently listed vehicle.',
      ownership: input.ownership || '1st Owner',
      status: 'active',
      sellerName: 'Rakesh Sharma',
      sellerPhone: '+91 98765-43210',
      sellerRating: 4.8,
      sellerJoined: 'Member since 2022',
      sellerListingsCount: 13,
      sellerVerified: true,
      sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isFavorite: false,
      isCertified: true,
      isFeatured: true,
    };

    try {
      await apiClient.post<any>('/api/cars', {
        brandId: 2,
        modelName: input.model,
        manufacturingYear: input.year,
        regYear: input.regYear || input.year,
        regCity: input.regCity || input.location,
        price: input.price,
        kmDriven: input.mileage,
        fuelType: input.fuelType,
        transmission: input.transmission,
        title: newCar.title,
        description: input.description,
      });
    } catch {
      // Offline fallback
    }

    inMemoryCars.unshift(newCar);
    return newCar;
  },

  async updateListing(id: string, updates: Partial<Car>): Promise<Car> {
    try {
      await apiClient.post<any>(`/api/cars/${id}`, updates);
    } catch {
      // Offline fallback
    }

    inMemoryCars = inMemoryCars.map(c => (c.id === id ? { ...c, ...updates } : c));
    return inMemoryCars.find(c => c.id === id)!;
  },

  async deleteListing(id: string): Promise<boolean> {
    try {
      await apiClient.get<any>(`/api/cars/${id}`);
    } catch {
      // Fallback
    }

    inMemoryCars = inMemoryCars.filter(c => c.id !== id);
    return true;
  },

  async toggleFavorite(carId: string): Promise<boolean> {
    try {
      await apiClient.post<any>(`/api/cars/${carId}/favorite`, { userId: 1 });
    } catch {
      // Fallback
    }

    const car = inMemoryCars.find(c => c.id === carId);
    if (car) {
      car.isFavorite = !car.isFavorite;
      return car.isFavorite;
    }
    return false;
  },
};
