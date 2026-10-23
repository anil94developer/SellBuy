import React, { useState } from 'react';

export function CitySelectorModal({
  isOpen,
  onClose,
  cities = [],
  selectedCity,
  onSelectCity
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCities = cities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="city-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x-btn" onClick={onClose}>
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
            <button className="city-search-clear" onClick={() => setSearchTerm('')}>
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}
        </div>

        {/* GPS Detect Location Button */}
        <button
          className="city-gps-btn"
          onClick={() => {
            onSelectCity('Jaipur, Rajasthan');
          }}
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

        {/* All Cities Option */}
        <div style={{ margin: '14px 0 10px 0', fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
          Popular Cities in India
        </div>

        <div className="city-grid">
          <button
            className={`city-pill-card ${selectedCity === 'All Cities' ? 'active' : ''}`}
            onClick={() => onSelectCity('All Cities')}
          >
            <span style={{ fontSize: 20 }}>🇮🇳</span>
            <div style={{ textAlign: 'left' }}>
              <div className="city-pill-name">All Cities</div>
              <div className="city-pill-sub">Pan-India</div>
            </div>
          </button>

          {filteredCities.map((c) => {
            const isSelected = selectedCity === c.name;
            return (
              <button
                key={c.id || c.name}
                className={`city-pill-card ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCity(c.name)}
              >
                <span style={{ fontSize: 20 }}>{c.icon || '📍'}</span>
                <div style={{ textAlign: 'left' }}>
                  <div className="city-pill-name">{c.name.split(',')[0]}</div>
                  <div className="city-pill-sub">{c.state || c.name.split(',')[1] || 'India'}</div>
                </div>
                {isSelected && <i className="fa-solid fa-check" style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 12 }}></i>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
