import React from 'react';

export function HeroBanner({
  onOpenSellWizard,
  onExploreCars,
  onOpenCityModal,
  selectedCity
}) {
  return (
    <div className="olx-hero-section">
      <div className="olx-hero-container">
        {/* Main Hero Visual Card */}
        <div className="olx-hero-main-card">
          <div className="olx-hero-text-col">
            <span className="olx-hero-badge">
              <i className="fa-solid fa-certificate"></i> INDIA'S MOST TRUSTED VEHICLE MARKETPLACE
            </span>
            <h1 className="olx-hero-headline">
              Buy, Sell & Finance Quality Certified Cars
            </h1>
            <p className="olx-hero-subtext">
              Over 15,000+ certified pre-owned vehicles with 140-point inspection, 7-day money back guarantee & instant door-step delivery in {selectedCity?.split(',')[0] || 'Jaipur'}.
            </p>

            <div className="olx-hero-cta-group">
              <button className="olx-hero-primary-btn" onClick={onExploreCars}>
                <i className="fa-solid fa-car"></i>
                <span>Explore Verified Cars</span>
              </button>

              <button className="olx-hero-secondary-btn" onClick={onOpenSellWizard}>
                <i className="fa-solid fa-tag"></i>
                <span>Sell Your Car Free</span>
              </button>
            </div>
          </div>

          <div className="olx-hero-img-col">
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80"
              alt="Certified Car Marketplace"
              className="olx-hero-car-img"
            />
            <div className="olx-hero-trust-bubble">
              <i className="fa-solid fa-shield-check" style={{ color: '#10b981', fontSize: 24 }}></i>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>100% Verified Quality</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Non-accidental certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Action Cards (Cars24 / OLX style) */}
        <div className="olx-quick-action-strip">
          <div className="olx-action-card" onClick={onExploreCars}>
            <div className="olx-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fa-solid fa-car-side"></i>
            </div>
            <div>
              <div className="olx-action-title">Buy Used Car</div>
              <div className="olx-action-desc">140+ Points Inspected</div>
            </div>
          </div>

          <div className="olx-action-card" onClick={onOpenSellWizard}>
            <div className="olx-action-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <div>
              <div className="olx-action-title">Sell My Car</div>
              <div className="olx-action-desc">Instant Quote in 2 Mins</div>
            </div>
          </div>

          <a href="#emi-calculator" className="olx-action-card">
            <div className="olx-action-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <i className="fa-solid fa-calculator"></i>
            </div>
            <div>
              <div className="olx-action-title">Car Loan EMI</div>
              <div className="olx-action-desc">Rates Starting @ 8.5%</div>
            </div>
          </a>

          <div className="olx-action-card" onClick={onOpenCityModal}>
            <div className="olx-action-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <div>
              <div className="olx-action-title">Change City</div>
              <div className="olx-action-desc">{selectedCity?.split(',')[0] || 'Select Location'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
