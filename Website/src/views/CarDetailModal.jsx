import React, { useState } from 'react';
import { CarModel } from '../models/CarModel';

export function CarDetailModal({
  car,
  onClose,
  onOpenGallery,
  onOpenSellerProfile,
  onStartChat,
  onToggleFavorite,
  isFavorited = false,
  currentUser,
  onEditListing,
  onOpenMyListings
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!car) return null;

  const images = (car.images && car.images.length > 0)
    ? car.images
    : [car.primary_image || car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[activeImageIndex] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="car-detail-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Floating Top Buttons */}
        <div className="car-modal-top-actions">
          <button
            className={`car-modal-fav-btn ${isFavorited ? 'active' : ''}`}
            onClick={(e) => onToggleFavorite(car.id, e)}
            title={isFavorited ? 'Remove from Saved' : 'Save to Favorites'}
          >
            <i className={isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          </button>
          <button className="car-modal-close-btn" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="car-detail-layout-grid">
          {/* LEFT: Image Carousel & Gallery */}
          <div className="car-gallery-column">
            <div
              className="car-main-img-wrap"
              onClick={() => onOpenGallery && onOpenGallery(car)}
              title="Click to view full-screen gallery"
            >
              <img src={currentImage} alt={car.title} className="car-main-display-img" />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button className="gallery-arrow-btn prev" onClick={handlePrev}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button className="gallery-arrow-btn next" onClick={handleNext}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </>
              )}

              {/* Badges Overlay */}
              <div className="gallery-overlay-badges">
                {car.is_certified && (
                  <span className="certified-badge-pill">
                    <i className="fa-solid fa-certificate"></i> Certified Pre-Owned
                  </span>
                )}
                {car.badge && !car.is_certified && (
                  <span className="verified-badge-pill">
                    <i className="fa-solid fa-shield-check"></i> {car.badge}
                  </span>
                )}
              </div>

              {/* Fullscreen Trigger Overlay Pill */}
              <button
                className="gallery-counter-pill"
                onClick={(e) => { e.stopPropagation(); onOpenGallery && onOpenGallery(car); }}
              >
                <i className="fa-solid fa-expand"></i> {activeImageIndex + 1} / {images.length} Photos
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="gallery-thumb-strip">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className={`gallery-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>

            {/* Quality Checklist Card */}
            <div className="inspection-guarantee-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a', fontSize: 20 }}></i>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>150+ Point Vehicle Inspection Report</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Passed structural, engine, electrical & transmission tests</div>
                </div>
              </div>
              <div className="inspection-checkmarks-row">
                <span>✓ Non-accidental guarantee</span>
                <span>✓ Verified odometer</span>
                <span>✓ Clean title & clear RTO</span>
                <span>✓ 6-Month warranty available</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Car Specifications, Pricing & Contact Actions */}
          <div className="car-info-column">
            <div style={{ marginBottom: 12 }}>
              <span className="car-brand-tag">{car.brand || 'Premium Vehicle'}</span>
              <h1 className="car-detail-title">{car.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: 4 }}></i>
                  {car.reg_city || car.location || 'India'}
                </span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  Posted {CarModel.formatTimeAgo(car.created_at || car.createdAt)}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="car-price-hero-box">
              <div>
                <span className="car-price-label">Our Best Price</span>
                <div className="car-price-amount">{CarModel.formatPrice(car.price)}</div>
              </div>
              <div className="car-emi-estimate-chip" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                <i className="fa-solid fa-handshake" style={{ color: '#059669' }}></i>
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#047857', fontWeight: 800 }}>Direct Deal</div>
                  <div style={{ fontWeight: 800, color: '#065f46' }}>0% Commission</div>
                </div>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="specs-overview-grid">
              <div className="spec-grid-item">
                <i className="fa-solid fa-calendar" style={{ color: '#3b82f6' }}></i>
                <div className="label">Year</div>
                <div className="val">{car.manufacturing_year || car.year}</div>
              </div>
              <div className="spec-grid-item">
                <i className="fa-solid fa-road" style={{ color: '#10b981' }}></i>
                <div className="label">KM Driven</div>
                <div className="val">{CarModel.formatKm(car.km_driven || car.mileage)}</div>
              </div>
              <div className="spec-grid-item">
                <i className="fa-solid fa-gas-pump" style={{ color: '#f59e0b' }}></i>
                <div className="label">Fuel Type</div>
                <div className="val">{car.fuel_type || car.fuelType}</div>
              </div>
              <div className="spec-grid-item">
                <i className="fa-solid fa-gear" style={{ color: '#8b5cf6' }}></i>
                <div className="label">Gearbox</div>
                <div className="val">{car.transmission}</div>
              </div>
              <div className="spec-grid-item">
                <i className="fa-solid fa-user-check" style={{ color: '#06b6d4' }}></i>
                <div className="label">Ownership</div>
                <div className="val">{car.ownership || '1st Owner'}</div>
              </div>
              <div className="spec-grid-item">
                <i className="fa-solid fa-shield" style={{ color: '#ef4444' }}></i>
                <div className="label">Insurance</div>
                <div className="val">Comprehensive</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Vehicle Overview</div>
              <p className="car-desc-paragraph">{car.description}</p>
            </div>

            {/* Dual Role Check: Is current user the seller of this vehicle? */}
            {(() => {
              const isMyCar = currentUser && (
                car.seller_name === currentUser.name ||
                car.sellerName === currentUser.name ||
                (currentUser.phone && (car.seller_phone === currentUser.phone || car.seller_phone === `+91 ${currentUser.phone}`))
              );

              if (isMyCar) {
                return (
                  <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    border: '1.5px solid #3b82f6',
                    borderRadius: 14,
                    padding: 16,
                    margin: '18px 0',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(59,130,246,0.2)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18
                      }}>
                        <i className="fa-solid fa-crown"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>
                          This is Your Listed Vehicle (आपकी लिस्टेड गाड़ी)
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                          You posted this car as a Seller. You can edit details, view buyer leads, or manage its sale status.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <button
                        className="btn-primary"
                        style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                        onClick={() => { onClose(); onEditListing && onEditListing(car); }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit Vehicle Details
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
                        onClick={() => { onClose(); onOpenMyListings && onOpenMyListings(); }}
                      >
                        <i className="fa-solid fa-list-check"></i> Manage All My Listings
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <>
                  {/* Seller Profile Snapshot Card */}
                  <div className="seller-summary-card">
                    <div className="seller-left-info" onClick={() => onOpenSellerProfile && onOpenSellerProfile(car)} style={{ cursor: 'pointer' }}>
                      <img src={car.seller_avatar || car.sellerAvatar || '/assets/logo.jpg'} className="seller-avatar-img" alt="" />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="seller-name-txt">{car.seller_name || car.sellerName || 'Verified Seller'}</span>
                          <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: 12 }}></i>
                        </div>
                        <div className="seller-meta-txt">
                          ⭐ {car.seller_rating || 4.8} • {car.seller_joined || 'Member since 2022'} • {car.seller_listings_count || 8} Cars
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-view-seller-link"
                      onClick={() => onOpenSellerProfile && onOpenSellerProfile(car)}
                    >
                      View Profile →
                    </button>
                  </div>

                  {/* Direct Deal Buyer Assurance */}
                  <div className="in-modal-emi-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <i className="fa-solid fa-certificate" style={{ fontSize: 24, color: '#16a34a' }}></i>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>100% Direct Seller Listing</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Zero broker fees • Direct contact with vehicle owner • Free RC transfer assistance</div>
                    </div>
                  </div>

                  {/* Action Contact Buttons (Buyer Mode) */}
                  <div className="car-contact-buttons-row">
                    <button
                      className="btn-chat-seller-primary"
                      onClick={() => onStartChat && onStartChat(car)}
                      title="Start live chat with seller"
                    >
                      <i className="fa-solid fa-comments"></i>
                      <span>Chat with Seller</span>
                    </button>

                    <a
                      href={`tel:${car.seller_phone || '+919876543210'}`}
                      className="btn-call-seller-secondary"
                      title="Call seller directly"
                    >
                      <i className="fa-solid fa-phone"></i>
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/91${(car.seller_phone || '9876543210').replace(/[^0-9]/g, '').slice(-10)}?text=Hi, I am interested in your ${encodeURIComponent(car.title)} listed on SellBuy.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp-seller"
                      title="Message on WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
