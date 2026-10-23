import React, { useState } from 'react';

export function AdvancedFilterModal({
  isOpen,
  onClose,
  brands = [],
  currentBrand,
  currentMaxBudget,
  currentMinPrice,
  currentFuel,
  currentTransmission,
  currentYearFrom,
  currentYearTo,
  onApplyFilters,
  onResetFilters
}) {
  const [brand, setBrand] = useState(currentBrand || '');
  const [maxPrice, setMaxPrice] = useState(currentMaxBudget || '');
  const [minPrice, setMinPrice] = useState(currentMinPrice || '');
  const [fuel, setFuel] = useState(currentFuel || '');
  const [transmission, setTransmission] = useState(currentTransmission || '');
  const [yearFrom, setYearFrom] = useState(currentYearFrom || '');
  const [yearTo, setYearTo] = useState(currentYearTo || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      brand,
      maxPrice,
      minPrice,
      fuel,
      transmission,
      yearFrom,
      yearTo
    });
  };

  const handleReset = () => {
    setBrand('');
    setMaxPrice('');
    setMinPrice('');
    setFuel('');
    setTransmission('');
    setYearFrom('');
    setYearTo('');
    onResetFilters();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filter-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              <i className="fa-solid fa-sliders" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
              Filter Vehicles
            </h2>
            <span style={{ fontSize: 12, color: '#64748b' }}>Customise your perfect car match</span>
          </div>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="filter-scrollable-body">
          {/* Brand Filter */}
          <div className="filter-section">
            <label className="filter-section-title">Brand / Manufacturer</label>
            <div className="filter-chips-wrap">
              <button
                className={`filter-chip ${brand === '' ? 'active' : ''}`}
                onClick={() => setBrand('')}
              >
                All Brands
              </button>
              {brands.map(b => (
                <button
                  key={b.id || b.name}
                  className={`filter-chip ${brand === b.name ? 'active' : ''}`}
                  onClick={() => setBrand(b.name)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <label className="filter-section-title">Budget / Price Range (₹)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b' }}>Min Price</span>
                <input
                  type="number"
                  placeholder="₹ 1,00,000"
                  className="text-input boxed-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b' }}>Max Price</span>
                <input
                  type="number"
                  placeholder="₹ 25,00,000"
                  className="text-input boxed-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            {/* Quick Price Pills */}
            <div className="filter-chips-wrap">
              <button className="filter-chip-sm" onClick={() => { setMinPrice(''); setMaxPrice('300000'); }}>Under ₹3 Lakh</button>
              <button className="filter-chip-sm" onClick={() => { setMinPrice('300000'); setMaxPrice('600000'); }}>₹3L - ₹6L</button>
              <button className="filter-chip-sm" onClick={() => { setMinPrice('600000'); setMaxPrice('1000000'); }}>₹6L - ₹10L</button>
              <button className="filter-chip-sm" onClick={() => { setMinPrice('1000000'); setMaxPrice('2000000'); }}>₹10L - ₹20L</button>
              <button className="filter-chip-sm" onClick={() => { setMinPrice('2000000'); setMaxPrice(''); }}>Above ₹20L</button>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="filter-section">
            <label className="filter-section-title">Fuel Type</label>
            <div className="filter-chips-wrap">
              {['', 'Petrol', 'Diesel', 'CNG', 'Electric'].map(f => (
                <button
                  key={f || 'all'}
                  className={`filter-chip ${fuel === f ? 'active' : ''}`}
                  onClick={() => setFuel(f)}
                >
                  {f === '' ? 'Any Fuel' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="filter-section">
            <label className="filter-section-title">Transmission / Gearbox</label>
            <div className="filter-chips-wrap">
              {['', 'Manual', 'Automatic'].map(tr => (
                <button
                  key={tr || 'all'}
                  className={`filter-chip ${transmission === tr ? 'active' : ''}`}
                  onClick={() => setTransmission(tr)}
                >
                  {tr === '' ? 'Any' : tr}
                </button>
              ))}
            </div>
          </div>

          {/* Registration Year */}
          <div className="filter-section">
            <label className="filter-section-title">Registration Year</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748b' }}>From Year</span>
                <input
                  type="number"
                  placeholder="2016"
                  className="text-input boxed-input"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748b' }}>To Year</span>
                <input
                  type="number"
                  placeholder="2024"
                  className="text-input boxed-input"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={handleReset}>
            <i className="fa-solid fa-rotate-left"></i> Reset All
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleApply}>
            <i className="fa-solid fa-check"></i> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
