import React, { useState } from 'react';
import { CarModel } from '../models/CarModel';

export function MarketplaceLayout({
  cars = [],
  loading = false,
  brands = [],
  selectedBrand,
  onSelectBrand,
  selectedCity,
  onOpenCityModal,
  minPrice,
  setMinPrice,
  maxBudget,
  setMaxBudget,
  selectedFuel,
  setSelectedFuel,
  selectedTransmission,
  setSelectedTransmission,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  activeTab,
  onTabChange,
  sortBy,
  setSortBy,
  savedCarIds = [],
  onToggleFavorite,
  onCarClick,
  onStartChat,
  onResetFilters,
  onOpenSellWizard,
  pagination = {},
  onPageChange,
  t
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    selectedBrand || maxBudget || minPrice || selectedFuel || selectedTransmission || yearFrom || yearTo || activeTab !== 'all'
  );

  return (
    <div className="olx-marketplace-section" id="explore-cars">
      <div className="olx-marketplace-container">
        {/* MOBILE FLOATING FILTER TRIGGER BAR */}
        <div className="olx-mobile-filter-bar hide-on-desktop">
          <button
            className="olx-mobile-filter-trigger"
            onClick={() => setMobileFilterOpen(true)}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          <div className="olx-mobile-sort-wrap">
            <i className="fa-solid fa-arrow-down-short-wide"></i>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="olx-mobile-sort-select"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest</option>
              <option value="km_asc">KM: Lowest</option>
            </select>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: LEFT SIDEBAR FILTERS + RIGHT PRODUCT GRID */}
        <div className="olx-grid-with-sidebar">
          {/* =========================================================
              LEFT SIDEBAR: PERSISTENT OLX-STYLE FILTER PANEL
              ========================================================= */}
          <aside className={`olx-filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            {/* Sidebar Header */}
            <div className="olx-filter-sidebar-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-filter" style={{ color: 'var(--primary)' }}></i>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>Filters</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {hasActiveFilters && (
                  <button className="olx-clear-filters-btn" onClick={onResetFilters}>
                    Clear All
                  </button>
                )}
                <button
                  className="olx-sidebar-close-mobile hide-on-desktop"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="olx-sidebar-scroll-body">
              {/* 1. Location Block */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">LOCATION</span>
                <div className="olx-loc-sidebar-card" onClick={onOpenCityModal}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                      {selectedCity || 'Jaipur, Rajasthan'}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Change</span>
                </div>
              </div>

              {/* 2. Budget / Price Range */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">BUDGET (PRICE IN ₹)</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <span className="olx-field-sublabel">Min Price</span>
                    <input
                      type="number"
                      placeholder="₹ Min"
                      className="olx-sidebar-input"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="olx-field-sublabel">Max Price</span>
                    <input
                      type="number"
                      placeholder="₹ Max"
                      className="olx-sidebar-input"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick Budget Chips */}
                <div className="olx-quick-budget-pills">
                  <button
                    className={`olx-budget-tag ${maxBudget === '300000' && !minPrice ? 'active' : ''}`}
                    onClick={() => { setMinPrice(''); setMaxBudget('300000'); }}
                  >
                    Under ₹3 Lakh
                  </button>
                  <button
                    className={`olx-budget-tag ${minPrice === '300000' && maxBudget === '600000' ? 'active' : ''}`}
                    onClick={() => { setMinPrice('300000'); setMaxBudget('600000'); }}
                  >
                    ₹3L - ₹6L
                  </button>
                  <button
                    className={`olx-budget-tag ${minPrice === '600000' && maxBudget === '1000000' ? 'active' : ''}`}
                    onClick={() => { setMinPrice('600000'); setMaxBudget('1000000'); }}
                  >
                    ₹6L - ₹10L
                  </button>
                  <button
                    className={`olx-budget-tag ${minPrice === '1000000' && maxBudget === '2000000' ? 'active' : ''}`}
                    onClick={() => { setMinPrice('1000000'); setMaxBudget('2000000'); }}
                  >
                    ₹10L - ₹20L
                  </button>
                  <button
                    className={`olx-budget-tag ${minPrice === '2000000' ? 'active' : ''}`}
                    onClick={() => { setMinPrice('2000000'); setMaxBudget(''); }}
                  >
                    Above ₹20L
                  </button>
                </div>
              </div>

              {/* 3. Brands Selection */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">BRAND & MAKE</span>
                <div className="olx-brand-checkbox-list">
                  <label className="olx-checkbox-row">
                    <input
                      type="radio"
                      name="brand_filter"
                      checked={selectedBrand === ''}
                      onChange={() => onSelectBrand('')}
                    />
                    <span className="olx-checkbox-label">All Brands</span>
                  </label>
                  {brands.map(b => (
                    <label key={b.id || b.name} className="olx-checkbox-row">
                      <input
                        type="radio"
                        name="brand_filter"
                        checked={selectedBrand === b.name}
                        onChange={() => onSelectBrand(b.name)}
                      />
                      <span className="olx-checkbox-label">{b.name}</span>
                      <span className="olx-item-count">({b.count || 24})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Fuel Type */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">FUEL TYPE</span>
                <div className="olx-pill-chips-grid">
                  {['', 'Petrol', 'Diesel', 'CNG', 'Electric'].map(fuel => (
                    <button
                      key={fuel || 'all'}
                      className={`olx-chip-button ${selectedFuel === fuel ? 'active' : ''}`}
                      onClick={() => setSelectedFuel(fuel)}
                    >
                      {fuel === '' ? 'Any Fuel' : fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Transmission */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">TRANSMISSION</span>
                <div className="olx-pill-chips-grid">
                  {['', 'Manual', 'Automatic'].map(trans => (
                    <button
                      key={trans || 'all'}
                      className={`olx-chip-button ${selectedTransmission === trans ? 'active' : ''}`}
                      onClick={() => setSelectedTransmission(trans)}
                    >
                      {trans === '' ? 'Any' : trans}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Manufacturing Year */}
              <div className="olx-sidebar-block">
                <span className="olx-block-title">MANUFACTURING YEAR</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <span className="olx-field-sublabel">From</span>
                    <input
                      type="number"
                      placeholder="e.g. 2018"
                      className="olx-sidebar-input"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="olx-field-sublabel">To</span>
                    <input
                      type="number"
                      placeholder="e.g. 2024"
                      className="olx-sidebar-input"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Apply Button */}
              <div className="hide-on-desktop" style={{ marginTop: 20 }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: 14 }}
                  onClick={() => setMobileFilterOpen(false)}
                >
                  View Matching Vehicles ({cars.length})
                </button>
              </div>
            </div>
          </aside>

          {/* =========================================================
              RIGHT CATALOG AREA: ADS HEADER, ACTIVE TAGS, GRID
              ========================================================= */}
          <main className="olx-catalog-main">
            {/* Breadcrumb & Section Header */}
            <div className="olx-catalog-top-header">
              <div>
                <div className="olx-breadcrumb-nav">
                  <span>Home</span>
                  <i className="fa-solid fa-chevron-right"></i>
                  <span>Used Cars</span>
                  <i className="fa-solid fa-chevron-right"></i>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {selectedCity || 'Jaipur, Rajasthan'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                  <h1 className="olx-catalog-title">
                    Cars for Sale in {selectedCity?.split(',')[0] || 'Jaipur'}
                  </h1>
                  <span className="olx-results-counter">
                    {loading ? 'Searching...' : `${cars.length} verified listings`}
                  </span>
                </div>
              </div>

              {/* Sort By Dropdown (Desktop) */}
              <div className="olx-sort-wrapper hide-on-mobile">
                <label className="olx-sort-label">SORT BY:</label>
                <select
                  className="olx-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                  <option value="km_asc">KM: Lowest First</option>
                </select>
              </div>
            </div>

            {/* Active Filters Tag Pills (OLX style) */}
            {hasActiveFilters && (
              <div className="olx-active-filter-tags">
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Active Filters:</span>
                {selectedBrand && (
                  <span className="olx-active-tag">
                    Brand: {selectedBrand}
                    <i className="fa-solid fa-xmark" onClick={() => onSelectBrand('')}></i>
                  </span>
                )}
                {maxBudget && (
                  <span className="olx-active-tag">
                    Max: ₹{Number(maxBudget).toLocaleString('en-IN')}
                    <i className="fa-solid fa-xmark" onClick={() => setMaxBudget('')}></i>
                  </span>
                )}
                {minPrice && (
                  <span className="olx-active-tag">
                    Min: ₹{Number(minPrice).toLocaleString('en-IN')}
                    <i className="fa-solid fa-xmark" onClick={() => setMinPrice('')}></i>
                  </span>
                )}
                {selectedFuel && (
                  <span className="olx-active-tag">
                    Fuel: {selectedFuel}
                    <i className="fa-solid fa-xmark" onClick={() => setSelectedFuel('')}></i>
                  </span>
                )}
                {selectedTransmission && (
                  <span className="olx-active-tag">
                    Gearbox: {selectedTransmission}
                    <i className="fa-solid fa-xmark" onClick={() => setSelectedTransmission('')}></i>
                  </span>
                )}
                {activeTab !== 'all' && (
                  <span className="olx-active-tag">
                    Category: {activeTab}
                    <i className="fa-solid fa-xmark" onClick={() => onTabChange('all')}></i>
                  </span>
                )}
                <button className="olx-reset-all-link" onClick={onResetFilters}>
                  Clear all filters
                </button>
              </div>
            )}

            {/* Cars Grid / Cards */}
            {loading ? (
              <div className="olx-loading-state">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>Loading fresh verified car recommendations...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="olx-no-results-card">
                <div style={{ fontSize: 48, marginBottom: 14 }}>🚗🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  No matching cars found
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, margin: '0 auto 20px auto' }}>
                  We couldn't find any vehicles matching these exact filters. Try adjusting your budget or selecting all brands.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn-secondary" onClick={onResetFilters}>
                    Clear All Filters
                  </button>
                  <button className="btn-primary" onClick={onOpenSellWizard}>
                    + Sell a Car Here
                  </button>
                </div>
              </div>
            ) : (
              <div className="olx-cards-grid">
                {cars.map((car) => {
                  const isFav = savedCarIds.includes(String(car.id));
                  const primaryImg =
                    car.primary_image ||
                    car.imageUrl ||
                    (car.images && car.images[0]) ||
                    '/assets/cars/creta.jpg';

                  return (
                    <div
                      key={car.id}
                      className="olx-car-card"
                      onClick={() => onCarClick(car.id)}
                    >
                      {/* Image Frame */}
                      <div className="olx-card-img-wrap">
                        <img
                          src={primaryImg}
                          alt={car.title}
                          className="olx-card-img"
                          loading="lazy"
                        />

                        {/* Ribbon Badge (FEATURED / CERTIFIED) */}
                        {car.is_certified ? (
                          <div className="olx-card-ribbon certified">
                            <i className="fa-solid fa-shield-check"></i> CERTIFIED
                          </div>
                        ) : car.is_featured ? (
                          <div className="olx-card-ribbon featured">
                            FEATURED
                          </div>
                        ) : null}

                        {/* Heart Wishlist Button */}
                        <button
                          className={`olx-card-heart-btn ${isFav ? 'active' : ''}`}
                          onClick={(e) => onToggleFavorite(car.id, e)}
                          title={isFav ? 'Remove from Saved' : 'Save to Favorites'}
                        >
                          <i className={isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                        </button>
                      </div>

                      {/* Card Content (OLX format) */}
                      <div className="olx-card-body">
                        {/* Price (Large Bold) */}
                        <div className="olx-card-price">
                          {CarModel.formatPrice(car.price)}
                        </div>

                        {/* Specs Line: Year • KM • Fuel • Gearbox */}
                        <div className="olx-card-specs-line">
                          <span>{car.manufacturing_year || car.year}</span>
                          <span>•</span>
                          <span>{CarModel.formatKm(car.km_driven || car.mileage)}</span>
                          <span>•</span>
                          <span>{car.fuel_type || car.fuelType}</span>
                        </div>

                        {/* Vehicle Title */}
                        <h3 className="olx-card-title" title={car.title}>
                          {car.title}
                        </h3>

                        {/* Bottom Row: Location & Date posted */}
                        <div className="olx-card-footer">
                          <span className="olx-card-location">
                            <i className="fa-solid fa-location-dot" style={{ marginRight: 4, color: '#94a3b8' }}></i>
                            {car.reg_city?.split(',')[0] || car.location?.split(',')[0] || 'Jaipur'}
                          </span>
                          <span className="olx-card-time">
                            2 DAYS AGO
                          </span>
                        </div>

                        {/* Quick Action Overlay on Hover */}
                        <div className="olx-card-actions-hover">
                          <button
                            className="olx-quick-chat-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartChat(car);
                            }}
                          >
                            <i className="fa-solid fa-comment-dots"></i> Chat
                          </button>
                          <button
                            className="olx-quick-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCarClick(car.id);
                            }}
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SERVER-SIDE PAGINATION CONTROLS */}
            {pagination && pagination.totalPages > 1 && (
              <div
                className="olx-pagination-bar"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 24,
                  padding: '14px 18px',
                  background: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Showing <strong style={{ color: '#0f172a' }}>{(pagination.page - 1) * pagination.limit + 1}</strong> to{' '}
                  <strong style={{ color: '#0f172a' }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{' '}
                  <strong style={{ color: '#0284c7' }}>{pagination.total}</strong> cars (Server-Side)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => {
                      if (onPageChange && pagination.hasPrevPage) onPageChange(pagination.page - 1);
                      const el = document.getElementById('explore-cars');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      background: pagination.hasPrevPage ? '#f8fafc' : '#f1f5f9',
                      cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                      fontSize: 13,
                      fontWeight: 600,
                      color: pagination.hasPrevPage ? '#0f172a' : '#94a3b8'
                    }}
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        if (onPageChange) onPageChange(p);
                        const el = document.getElementById('explore-cars');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        minWidth: 34,
                        height: 34,
                        borderRadius: 8,
                        border: p === pagination.page ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        background: p === pagination.page ? '#0284c7' : '#ffffff',
                        color: p === pagination.page ? '#ffffff' : '#334155',
                        fontWeight: p === pagination.page ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: 13
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => {
                      if (onPageChange && pagination.hasNextPage) onPageChange(pagination.page + 1);
                      const el = document.getElementById('explore-cars');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      background: pagination.hasNextPage ? '#f8fafc' : '#f1f5f9',
                      cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                      fontSize: 13,
                      fontWeight: 600,
                      color: pagination.hasNextPage ? '#0f172a' : '#94a3b8'
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
