import React from 'react';
import { CarModel } from '../models/CarModel';

export function SellerProfileModal({
  sellerData,
  onClose,
  onSelectCar,
  onStartChat
}) {
  if (!sellerData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="seller-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Seller Banner & Profile Info */}
        <div className="seller-profile-banner">
          <div className="seller-profile-header-info">
            <img src={sellerData.avatar || '/assets/logo.jpg'} alt="" className="seller-profile-avatar" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>{sellerData.name}</h2>
                {sellerData.verified && (
                  <span className="seller-verified-tag">
                    <i className="fa-solid fa-circle-check"></i> Verified Dealer
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                ⭐ {sellerData.rating} Rating (128 reviews) • {sellerData.joined}
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: 4 }}></i>
                Jaipur, Rajasthan
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <a
              href={`tel:${sellerData.phone || '+919876543210'}`}
              className="btn-call-seller-secondary"
              style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
            >
              <i className="fa-solid fa-phone"></i> Call Dealer
            </a>
            <button
              className="btn-chat-seller-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                onClose();
                if (sellerData.cars && sellerData.cars[0]) {
                  onStartChat(sellerData.cars[0]);
                }
              }}
            >
              <i className="fa-solid fa-comments"></i> Send Message
            </button>
          </div>
        </div>

        {/* Listings by this seller */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Vehicles for Sale by {sellerData.name.split(' ')[0]} ({sellerData.cars?.length || 0})
            </h3>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Certified Stock</span>
          </div>

          <div className="seller-cars-grid">
            {(sellerData.cars || []).map(car => (
              <div
                key={car.id}
                className="seller-car-mini-card"
                onClick={() => {
                  onClose();
                  onSelectCar(car.id);
                }}
              >
                <img
                  src={car.primary_image || car.imageUrl || (car.images && car.images[0])}
                  alt={car.title}
                  className="seller-car-mini-img"
                />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{car.title}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                    {CarModel.formatPrice(car.price)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#64748b' }}>
                    <span>{car.manufacturing_year || car.year}</span>
                    <span>•</span>
                    <span>{CarModel.formatKm(car.km_driven || car.mileage)}</span>
                    <span>•</span>
                    <span>{car.fuel_type || car.fuelType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
