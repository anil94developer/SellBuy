// SellBuy API Client Service
const API = {
  baseUrl: window.location.port === '5000' ? '' : 'http://localhost:5000',

  async request(endpoint, options = {}) {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`[API ERROR] ${endpoint}:`, err);
      return { success: false, message: err.message };
    }
  },

  // Auth
  async sendOtp(phone) {
    return this.request('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  },

  async verifyOtp(phone, otp) {
    return this.request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  },

  async completeProfile(profile) {
    return this.request('/api/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  },

  async socialLogin(provider) {
    return this.request('/api/auth/social-login', {
      method: 'POST',
      body: JSON.stringify({ provider })
    });
  },

  async getUsers() {
    return this.request('/api/auth/users');
  },

  async switchUser(userId) {
    return this.request('/api/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },

  // Cars & Marketplace
  async getCars(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/cars?${query}`);
  },

  async getCarDetails(id, userId) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request(`/api/cars/${id}${query}`);
  },

  async createListing(listingData) {
    return this.request('/api/cars', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
  },

  async updateListing(id, updateData) {
    return this.request(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async deleteListing(id) {
    return this.request(`/api/cars/${id}`, {
      method: 'DELETE'
    });
  },

  async updateListingStatus(id, status) {
    return this.request(`/api/cars/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async toggleFavorite(id, userId) {
    return this.request(`/api/cars/${id}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },

  async getUserListings(userId, status) {
    const q = status ? `?status=${status}` : '';
    return this.request(`/api/cars/user/${userId}${q}`);
  },

  async getSavedCars(userId) {
    return this.request(`/api/cars/user/${userId}/saved`);
  },

  // Metadata
  async getBrands() {
    return this.request('/api/meta/brands');
  },

  async getModels(brandId) {
    const q = brandId ? `?brandId=${brandId}` : '';
    return this.request(`/api/meta/models${q}`);
  },

  async getCities() {
    return this.request('/api/meta/cities');
  },

  // Chat
  async getChats(userId) {
    return this.request(`/api/chats?userId=${userId}`);
  },

  async getChatMessages(chatId) {
    return this.request(`/api/chats/${chatId}/messages`);
  },

  async startChat(buyerId, sellerId, listingId, initialMessage) {
    return this.request('/api/chats/start', {
      method: 'POST',
      body: JSON.stringify({ buyerId, sellerId, listingId, initialMessage })
    });
  },

  async sendMessage(chatId, senderId, messageText, attachmentUrl) {
    return this.request(`/api/chats/${chatId}/send`, {
      method: 'POST',
      body: JSON.stringify({ senderId, messageText, attachmentUrl })
    });
  },

  // Notifications
  async getNotifications(userId, type) {
    const q = type ? `&type=${type}` : '';
    return this.request(`/api/notifications?userId=${userId}${q}`);
  },

  async markNotificationRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  // Admin
  async getAdminStats() {
    return this.request('/api/admin/stats');
  },

  async getAdminListings(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/admin/listings?${q}`);
  },

  async approveListing(id) {
    return this.request(`/api/admin/listings/${id}/approve`, {
      method: 'PATCH'
    });
  },

  async rejectListing(id) {
    return this.request(`/api/admin/listings/${id}/reject`, {
      method: 'PATCH'
    });
  },

  async toggleFeaturedListing(id) {
    return this.request(`/api/admin/listings/${id}/toggle-feature`, {
      method: 'PATCH'
    });
  },

  async getAdminUsers(search) {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/api/admin/users${q}`);
  },

  async toggleUserBlock(id) {
    return this.request(`/api/admin/users/${id}/toggle-block`, {
      method: 'PATCH'
    });
  },

  async addBrand(brandData) {
    return this.request('/api/admin/brands', {
      method: 'POST',
      body: JSON.stringify(brandData)
    });
  },

  async addCity(cityData) {
    return this.request('/api/admin/cities', {
      method: 'POST',
      body: JSON.stringify(cityData)
    });
  },

  async broadcastNotification(title, message) {
    return this.request('/api/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({ title, message })
    });
  },

  // Logs
  async getLogs(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/logs?${q}`);
  },

  async logClientEvent(action, module, details, level = 'INFO') {
    return this.request('/api/logs/client', {
      method: 'POST',
      body: JSON.stringify({ action, module, details, level })
    });
  }
};
