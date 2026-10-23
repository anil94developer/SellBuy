// Admin Model: API Client
export const AdminApiService = {
  async getStats() {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async getListings(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/admin/listings?${q}`);
    return res.json();
  },

  async approveListing(id) {
    const res = await fetch(`/api/admin/listings/${id}/approve`, { method: 'PATCH' });
    return res.json();
  },

  async rejectListing(id) {
    const res = await fetch(`/api/admin/listings/${id}/reject`, { method: 'PATCH' });
    return res.json();
  },

  async toggleFeatured(id) {
    const res = await fetch(`/api/admin/listings/${id}/toggle-feature`, { method: 'PATCH' });
    return res.json();
  },

  async deleteListing(id) {
    const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getUsers(params = {}) {
    const queryObj = typeof params === 'string' ? { search: params } : (params || {});
    const q = new URLSearchParams(queryObj).toString();
    const res = await fetch(`/api/admin/users?${q}`);
    return res.json();
  },

  async toggleUserBlock(id) {
    const res = await fetch(`/api/admin/users/${id}/toggle-block`, { method: 'PATCH' });
    return res.json();
  },

  async getBrands() {
    const res = await fetch('/api/admin/brands');
    if (!res.ok) {
      const fallback = await fetch('/api/meta/brands?all=1');
      return fallback.json();
    }
    return res.json();
  },

  async addBrand(brandData) {
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brandData)
    });
    return res.json();
  },

  async updateBrand(id, brandData) {
    const res = await fetch(`/api/admin/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brandData)
    });
    return res.json();
  },

  async toggleBrandStatus(id) {
    const res = await fetch(`/api/admin/brands/${id}/toggle-status`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async deleteBrand(id) {
    const res = await fetch(`/api/admin/brands/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getCategories() {
    const res = await fetch('/api/admin/categories');
    return res.json();
  },

  
  async addCategory(categoryData) {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  async updateCategory(id, categoryData) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  async toggleCategoryStatus(id) {
    const res = await fetch(`/api/admin/categories/${id}/toggle-status`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getCities() {
    const res = await fetch('/api/admin/cities');
    if (!res.ok) {
      const fallback = await fetch('/api/meta/cities?all=1');
      return fallback.json();
    }
    return res.json();
  },

  async addCity(cityData) {
    const res = await fetch('/api/admin/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData)
    });
    return res.json();
  },

  async updateCity(id, cityData) {
    const res = await fetch(`/api/admin/cities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData)
    });
    return res.json();
  },

  async toggleCityStatus(id) {
    const res = await fetch(`/api/admin/cities/${id}/toggle-status`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async deleteCity(id) {
    const res = await fetch(`/api/admin/cities/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async sendBroadcast(title, message) {
    const res = await fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message })
    });
    return res.json();
  },

  async getLogs(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`/api/logs?${q}`);
    return res.json();
  },

  async createCarListing(carData) {
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    return res.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
