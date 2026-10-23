import React from 'react';
import { CarModel } from '../models/CarModel';

export function CarsGrid({
  t,
  cars,
  activeTab,
  onTabChange,
  onCarClick,
  loading,
  savedCarIds = [],
  onToggleFavorite,
  onOpenFilterModal,
  sortBy,
  setSortBy
}) {
  return (
    <div className="web-container" id="explore-cars">
      {/* Catalog Header with Title, Count, Filters button & Sort Dropdown */}
      <div className="cars-grid-top-bar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {t('featuredCars')}
            </h3>
            <span className="cars-count-badge">
              {loading ? '...' : `${cars.length} Cars`}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Inspected, certified and ready for transfer with instant dealer financing
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Quick Category Tabs */}
          <div className="web-tab-pills-row">
            {['all', 'used', 'new', 'certified'].map(tab => (
              <button
                key={tab}
                className={`web-tab-pill ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onTabChange(tab)}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="sort-dropdown-wrap">
            <span style={{ fontSize: 12, color: '#64748b' }}><i className="fa-solid fa-arrow-down-short-wide"></i> Sort:</span>
            <select
              className="sort-select-input"
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

          {/* Filter Modal Button */}
          <button className="btn-filter-icon" onClick={onOpenFilterModal} title="All Filters">
            <i className="fa-solid fa-sliders"></i>
            <span className="hide-on-xs">Filters</span>
          </button>
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="web-cars-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, color: 'var(--primary)', marginBottom: 12 }}></i>
            <div>Loading verified vehicle catalog...</div>
          </div>
        ) : cars.length === 0 ? (
          <div className="cars-empty-state-box" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>No matching vehicles found</h4>
            <p style={{ fontSize: 13, color: '#64748b', maxWidth: 420, margin: '0 auto 16px auto' }}>
              Try broadening your filters or choosing a different city to see more available cars.
            </p>
            <button className="btn-primary" onClick={onOpenFilterModal}>
              <i className="fa-solid fa-rotate-left"></i> Adjust Filters
            </button>
          </div>
        ) : (
          cars.map(car => {
            const isFav = savedCarIds.includes(String(car.id));
            const primaryImg = car.primary_image || car.imageUrl || (car.images && car.images[0]) || '/assets/cars/creta.jpg';

            return (
              <div
                key={car.id}
                className="car-card"
                onClick={() => onCarClick(car.id)}
              >
                {/* Image Wrap */}
                <div className="car-card-img-wrap">
                  <img
                    src={primaryImg}
                    alt={car.title}
                    className="car-card-img"
                    loading="lazy"
                  />

                  {/* Certified Badges */}
                  {car.is_certified ? (
                    <div className="car-certified-badge">
                      <i className="fa-solid fa-shield-check"></i> Certified
                    </div>
                  ) : car.badge ? (
                    <div className="car-tag-badge">
                      {car.badge}
                    </div>
                  ) : null}

                  {/* Favorite Heart Button */}
                  <button
                    className={`car-fav-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => onToggleFavorite(car.id, e)}
                    title={isFav ? 'Remove from Saved' : 'Save to Favorites'}
                  >
                    <i className={isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>
                </div>

                {/* Card Body */}
                <div className="car-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span className="car-card-brand-badge">{car.brand || 'Vehicle'}</span>
                    <span className="car-card-year-tag">{car.manufacturing_year || car.year}</span>
                  </div>

                  <h3 className="car-card-title">{car.title}</h3>
                  <div className="car-card-price">{CarModel.formatPrice(car.price)}</div>

                  {/* Specs Chips Row */}
                  <div className="car-specs-row">
                    <span className="spec-chip">
                      <i className="fa-solid fa-location-dot"></i> {car.reg_city?.split(',')[0] || car.location?.split(',')[0]}
                    </span>
                    <span className="spec-chip">
                      <i className="fa-solid fa-road"></i> {CarModel.formatKm(car.km_driven || car.mileage)}
                    </span>
                    <span className="spec-chip">
                      <i className="fa-solid fa-gas-pump"></i> {car.fuel_type || car.fuelType}
                    </span>
                    <span className="spec-chip">
                      <i className="fa-solid fa-gear"></i> {car.transmission}
                    </span>
                  </div>

                  {/* Bottom Footer Details */}
                  <div className="car-card-footer-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img
                        src={car.seller_avatar || car.sellerAvatar || '/assets/logo.jpg'}
                        alt=""
                        className="car-card-seller-avatar"
                      />
                      <span className="car-card-seller-name">
                        {car.seller_name?.split(' ')[0] || car.sellerName?.split(' ')[0] || 'Verified'}
                      </span>
                    </div>

                    <button
                      className="btn-card-view-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCarClick(car.id);
                      }}
                    >
                      <span>{t('viewDetails')}</span>
                      <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }}></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
