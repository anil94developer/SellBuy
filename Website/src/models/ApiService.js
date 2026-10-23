// Website Model: API Client with automatic offline/mock resilience
import {
  INITIAL_CARS,
  INITIAL_BRANDS,
  INITIAL_CITIES,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATION,
  INITIAL_CONVERSATIONS
} from './MockData';

// Local storage keys
const STORAGE_KEYS = {
  CARS: 'sellbuy_cars',
  USER: 'sellbuy_user',
  SAVED: 'sellbuy_saved_car_ids',
  CONVERSATIONS: 'sellbuy_conversations',
  NOTIFICATIONS: 'sellbuy_notifications',
};

// Initialize local storage defaults
function getStored(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const ApiService = {
  // Cars API
  async getCars(params = {}) {
    try {
      const q = new URLSearchParams(params).toString();
      const res = await fetch(`/api/cars?${q}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cars && data.cars.length > 0) {
          return data;
        }
      }
    } catch {
      // Backend unavailable, fallback to stored mock
    }

    // Client-side filter fallback
    let allCars = getStored(STORAGE_KEYS.CARS, INITIAL_CARS);
    let filtered = [...allCars];

    if (params.q) {
      const query = params.q.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.brand?.toLowerCase().includes(query) ||
        c.model?.toLowerCase().includes(query) ||
        c.reg_city?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query)
      );
    }

    if (params.brand) {
      filtered = filtered.filter(c => c.brand?.toLowerCase() === params.brand.toLowerCase());
    }

    if (params.city) {
      filtered = filtered.filter(c => (c.reg_city || c.location || '').toLowerCase().includes(params.city.toLowerCase()));
    }

    if (params.maxPrice) {
      filtered = filtered.filter(c => Number(c.price) <= Number(params.maxPrice));
    }

    if (params.minPrice) {
      filtered = filtered.filter(c => Number(c.price) >= Number(params.minPrice));
    }

    if (params.fuel) {
      filtered = filtered.filter(c => (c.fuel_type || c.fuelType || '').toLowerCase() === params.fuel.toLowerCase());
    }

    if (params.transmission) {
      filtered = filtered.filter(c => (c.transmission || '').toLowerCase() === params.transmission.toLowerCase());
    }

    if (params.yearFrom) {
      filtered = filtered.filter(c => Number(c.manufacturing_year || c.year) >= Number(params.yearFrom));
    }

    if (params.yearTo) {
      filtered = filtered.filter(c => Number(c.manufacturing_year || c.year) <= Number(params.yearTo));
    }

    if (params.tab && params.tab !== 'all') {
      if (params.tab === 'certified') filtered = filtered.filter(c => c.is_certified);
      if (params.tab === 'used') filtered = filtered.filter(c => (c.km_driven || c.mileage || 0) > 1000);
      if (params.tab === 'new') filtered = filtered.filter(c => (c.manufacturing_year || c.year) >= 2022);
    }

    return { success: true, cars: filtered };
  },

  async getCarDetails(id) {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.car) return data;
      }
    } catch {}

    const allCars = getStored(STORAGE_KEYS.CARS, INITIAL_CARS);
    const car = allCars.find(c => String(c.id) === String(id)) || allCars[0];
    return { success: true, car };
  },

  async getBrands() {
    try {
      const res = await fetch('/api/meta/brands');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.brands) return data;
      }
    } catch {}
    return { success: true, brands: INITIAL_BRANDS };
  },

  async getCities() {
    try {
      const res = await fetch('/api/meta/cities');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cities) return data;
      }
    } catch {}
    return { success: true, cities: INITIAL_CITIES };
  },

  async createListing(carData) {
    let newCar = null;
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) newCar = data.car;
      }
    } catch {}

    if (!newCar) {
      newCar = {
        id: String(Date.now()),
        title: carData.title || `${carData.brand || 'Vehicle'} ${carData.model || ''} ${carData.year || 2022}`,
        brand: carData.brand || 'Maruti',
        model: carData.model || '',
        year: Number(carData.year || carData.manufacturingYear) || 2022,
        manufacturing_year: Number(carData.year || carData.manufacturingYear) || 2022,
        price: Number(carData.price) || 500000,
        formattedPrice: '₹ ' + Number(carData.price || 500000).toLocaleString('en-IN'),
        km_driven: Number(carData.kmDriven || carData.km_driven) || 25000,
        mileage: Number(carData.kmDriven || carData.km_driven) || 25000,
        fuel_type: carData.fuelType || 'Petrol',
        fuelType: carData.fuelType || 'Petrol',
        transmission: carData.transmission || 'Manual',
        reg_city: carData.regCity || carData.city || 'Jaipur, Rajasthan',
        location: carData.regCity || carData.city || 'Jaipur, Rajasthan',
        description: carData.description || 'Pre-owned certified vehicle in great running condition.',
        ownership: carData.ownership || '1st Owner',
        badge: 'Newly Listed',
        is_certified: false,
        is_featured: false,
        primary_image: (carData.images && carData.images[0]) || carData.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        imageUrl: (carData.images && carData.images[0]) || carData.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        images: carData.images && carData.images.length ? carData.images : [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
        ],
        seller_name: carData.sellerName || 'Rakesh Sharma',
        seller_phone: carData.sellerPhone || '+91 98765-43210',
        seller_rating: 4.8,
        seller_verified: true,
        seller_joined: 'Member since 2022',
        status: 'active'
      };
    }

    const allCars = getStored(STORAGE_KEYS.CARS, INITIAL_CARS);
    const updated = [newCar, ...allCars];
    setStored(STORAGE_KEYS.CARS, updated);

    return { success: true, car: newCar, message: 'Vehicle listed successfully!' };
  },

  async updateListing(id, updates) {
    try {
      await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch {}

    const allCars = getStored(STORAGE_KEYS.CARS, INITIAL_CARS);
    const updated = allCars.map(c => String(c.id) === String(id) ? { ...c, ...updates } : c);
    setStored(STORAGE_KEYS.CARS, updated);
    return { success: true };
  },

  async deleteListing(id) {
    try {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    } catch {}

    const allCars = getStored(STORAGE_KEYS.CARS, INITIAL_CARS);
    const updated = allCars.filter(c => String(c.id) !== String(id));
    setStored(STORAGE_KEYS.CARS, updated);
    return { success: true };
  },

  // Auth API
  async sendOtp(phone) {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (res.ok) return res.json();
    } catch {}
    return { success: true, demoOtp: '123456', message: `OTP sent to +91 ${phone}` };
  },

  async verifyOtp(phone, otp) {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setStored(STORAGE_KEYS.USER, data.user);
        return data;
      }
      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        return { success: false, message: data?.message || 'Your account is blocked. Contact administrator.' };
      }
    } catch {}

    if (otp === '123456' || otp === '000000') {
      const user = { ...INITIAL_USER, phone: phone || '9876543210' };
      setStored(STORAGE_KEYS.USER, user);
      return { success: true, user, isNewUser: false };
    }
    return { success: false, message: 'Invalid OTP code. Please enter 123456.' };
  },

  async checkUserStatus(userId) {
    if (!userId) return { success: false, isBlocked: false };
    try {
      const res = await fetch(`/api/auth/status/${userId}`);
      if (res.ok) {
        return res.json();
      }
      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        return { success: false, isBlocked: true, message: data?.message || 'Your account is blocked by administrator.' };
      }
    } catch {}
    return { success: false, isBlocked: false };
  },

  async completeProfile(data) {
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.user) setStored(STORAGE_KEYS.USER, json.user);
        return json;
      }
    } catch {}

    const currentUser = getStored(STORAGE_KEYS.USER, INITIAL_USER);
    const updated = { ...currentUser, ...data };
    setStored(STORAGE_KEYS.USER, updated);
    return { success: true, user: updated };
  },

  getCurrentUser() {
    return getStored(STORAGE_KEYS.USER, INITIAL_USER);
  },

  logout() {
    setStored(STORAGE_KEYS.USER, null);
    return { success: true };
  },

  // Saved / Favorites API
  getSavedCarIds() {
    return getStored(STORAGE_KEYS.SAVED, ['2']);
  },

  toggleFavorite(carId) {
    const list = getStored(STORAGE_KEYS.SAVED, ['2']);
    const exists = list.includes(String(carId));
    let updated;
    if (exists) {
      updated = list.filter(id => id !== String(carId));
    } else {
      updated = [...list, String(carId)];
    }
    setStored(STORAGE_KEYS.SAVED, updated);
    return { success: true, isFavorited: !exists, savedCount: updated.length };
  },

  // Chat API
  getConversations() {
    return getStored(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },

  sendMessage(conversationId, text) {
    const convs = getStored(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const target = convs.find(c => c.id === conversationId) || convs[0];
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: 'buyer',
      senderName: 'You',
      text,
      time: 'Just now',
      isMe: true
    };
    target.messages.push(newMsg);
    target.lastMessage = text;
    target.lastMessageTime = 'Just now';

    setStored(STORAGE_KEYS.CONVERSATIONS, convs);
    return { success: true, message: newMsg, conversation: target };
  },

  // Notifications API
  getNotifications() {
    return getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  markNotificationRead(id) {
    const notifs = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = notifs.find(n => n.id === id);
    if (item) item.read = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return { success: true };
  },

  markAllNotificationsRead() {
    const notifs = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifs.forEach(n => (n.read = true));
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return { success: true };
  }
};
