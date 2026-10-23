import React from 'react';
import { CarModel } from '../models/CarModel';

export function SavedCarsModal({
  isOpen,
  onClose,
  savedCars = [],
  onSelectCar,
  onToggleFavorite,
  onExploreCars
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="manage-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              <i className="fa-solid fa-heart" style={{ color: '#ef4444', marginRight: 8 }}></i>
              Saved Cars & Wishlist ({savedCars.length})
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Keep track of cars you're considering and compare prices
            </span>
          </div>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {savedCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>💔</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Your wishlist is empty</h3>
            <p style={{ fontSize: 13, maxWidth: 360, margin: '0 auto 20px auto' }}>
              Tap the heart icon on any vehicle card to save it for easy access later.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                onClose();
                if (onExploreCars) onExploreCars();
              }}
            >
              Explore Vehicles →
            </button>
          </div>
        ) : (
          <div className="saved-cars-grid">
            {savedCars.map(car => (
              <div
                key={car.id}
                className="saved-car-card"
                onClick={() => {
                  onClose();
                  onSelectCar(car.id);
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={car.primary_image || car.imageUrl || (car.images && car.images[0])}
                    alt={car.title}
                    className="saved-car-card-img"
                  />
                  <button
                    className="saved-car-unfav-btn"
                    onClick={(e) => onToggleFavorite(car.id, e)}
                    title="Remove from saved"
                  >
                    <i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i>
                  </button>
                </div>

                <div style={{ padding: 14 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{car.title}</h4>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                    {CarModel.formatPrice(car.price)}
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    <span><i className="fa-solid fa-location-dot"></i> {car.reg_city || car.location}</span>
                    <span>•</span>
                    <span><i className="fa-solid fa-road"></i> {CarModel.formatKm(car.km_driven || car.mileage)}</span>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onSelectCar(car.id);
                    }}
                  >
                    View Details & Contact Seller →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
