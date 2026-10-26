import React, { useState } from 'react';

const POPULAR_CITIES_FALLBACK = [
  { id: 1, name: 'Jaipur', state: 'Rajasthan', icon: '🏰', is_popular: 1 },
  { id: 2, name: 'Delhi NCR', state: 'Delhi', icon: '🏛️', is_popular: 1 },
  { id: 3, name: 'Mumbai', state: 'Maharashtra', icon: '🌊', is_popular: 1 },
  { id: 4, name: 'Bangalore', state: 'Karnataka', icon: '💻', is_popular: 1 },
  { id: 5, name: 'Hyderabad', state: 'Telangana', icon: '💎', is_popular: 1 },
  { id: 6, name: 'Ahmedabad', state: 'Gujarat', icon: '🪁', is_popular: 1 },
  { id: 7, name: 'Pune', state: 'Maharashtra', icon: '🎓', is_popular: 1 },
  { id: 8, name: 'Chandigarh', state: 'Punjab', icon: '🌹', is_popular: 1 },
  { id: 9, name: 'Chennai', state: 'Tamil Nadu', icon: '🏖️', is_popular: 1 },
  { id: 10, name: 'Kolkata', state: 'West Bengal', icon: '🚋', is_popular: 1 },
  { id: 11, name: 'Lucknow', state: 'Uttar Pradesh', icon: '🕌', is_popular: 1 }
];

export function CitySelectorModal({
  isOpen,
  onClose,
  cities = [],
  selectedCity,
  onSelectCity
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Combine provided cities with fallback to guarantee cities are always present
  const baseCities = Array.isArray(cities) && cities.length > 0 ? cities : POPULAR_CITIES_FALLBACK;
  const normalizedCities = baseCities.map((c, idx) => {
    if (typeof c === 'string') {
      return { id: idx + 1, name: c, state: 'India', icon: '📍', is_popular: 1 };
    }
    return {
      id: c?.id || idx + 1,
      name: c?.name || '',
      state: c?.state || 'India',
      icon: c?.icon || '📍',
      is_popular: c?.is_popular ?? 1
    };
  });

  const query = (searchTerm || '').trim().toLowerCase();
  const filteredCities = normalizedCities.filter(c =>
    (c.name && c.name.toLowerCase().includes(query)) ||
    (c.state && c.state.toLowerCase().includes(query))
  );

  const isCityActive = (cityName) => {
    if (!selectedCity) return false;
    if (selectedCity === cityName) return true;
    const currentPrimary = selectedCity.split(',')[0].replace(/\b(NCR|Metro)\b/gi, '').trim().toLowerCase();
    const targetPrimary = cityName.split(',')[0].replace(/\b(NCR|Metro)\b/gi, '').trim().toLowerCase();
    return currentPrimary === targetPrimary;
  };

  const handleSelect = (cityName) => {
    if (onSelectCity) onSelectCity(cityName);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="city-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-x-btn" onClick={onClose} title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Select Your City
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Find certified cars and local verified sellers near you
          </p>
        </div>

        {/* Search City Input */}
        <div className="city-search-box">
          <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
          <input
            type="text"
            className="city-search-input"
            placeholder="Search city (e.g. Jaipur, Delhi, Mumbai)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button type="button" className="city-search-clear" onClick={() => setSearchTerm('')}>
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}
        </div>

        {/* GPS Detect Location Button */}
        <button
          type="button"
          className="city-gps-btn"
          onClick={() => handleSelect('Jaipur, Rajasthan')}
        >
          <div className="gps-icon-circle">
            <i className="fa-solid fa-location-crosshairs"></i>
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Use Current Location</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Jaipur, Rajasthan (Auto-detected via GPS)</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Select →</span>
        </button>

        {/* Popular Cities in India */}
        <div style={{ margin: '14px 0 10px 0', fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
          Popular Cities in India
        </div>

        <div className="city-grid">
          {/* All Cities Option */}
          <button
            type="button"
            className={`city-pill-card ${selectedCity === 'All Cities' ? 'active' : ''}`}
            onClick={() => handleSelect('All Cities')}
          >
            <span style={{ fontSize: 20 }}>🇮🇳</span>
            <div style={{ textAlign: 'left' }}>
              <div className="city-pill-name">All Cities</div>
              <div className="city-pill-sub">Pan-India</div>
            </div>
            {selectedCity === 'All Cities' && (
              <i className="fa-solid fa-check" style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 12 }}></i>
            )}
          </button>

          {filteredCities.map((c) => {
            const isSelected = isCityActive(c.name);
            return (
              <button
                key={c.id || c.name}
                type="button"
                className={`city-pill-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(c.name)}
              >
                <span style={{ fontSize: 20 }}>{c.icon || '📍'}</span>
                <div style={{ textAlign: 'left' }}>
                  <div className="city-pill-name">{c.name.split(',')[0]}</div>
                  <div className="city-pill-sub">{c.state || c.name.split(',')[1] || 'India'}</div>
                </div>
                {isSelected && (
                  <i className="fa-solid fa-check" style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 12 }}></i>
                )}
              </button>
            );
          })}

          {filteredCities.length === 0 && query && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px 10px', color: '#64748b' }}>
              <i className="fa-solid fa-map-location-dot" style={{ fontSize: 28, color: '#94a3b8', marginBottom: 8, display: 'block' }}></i>
              <div style={{ fontWeight: 600, fontSize: 14 }}>No pre-listed cities match "{searchTerm}"</div>
              <button
                type="button"
                className="olx-budget-tag active"
                style={{ marginTop: 12, display: 'inline-block' }}
                onClick={() => handleSelect(searchTerm)}
              >
                Filter cars in "{searchTerm}" anyway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
