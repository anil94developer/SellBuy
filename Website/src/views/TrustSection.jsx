import React from 'react';

export function TrustSection({ onOpenSellWizard }) {
  return (
    <div className="olx-trust-wrapper">
      <div className="olx-marketplace-container">
        {/* Why Choose SellBuy */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 1 }}>
            TRANSPARENCY & PEACE OF MIND
          </span>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '6px 0 10px 0' }}>
            Why Millions Trust SellBuy
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 580, margin: '0 auto' }}>
            We've revolutionized car buying and selling across India with complete transparency and zero guesswork.
          </p>
        </div>

        <div className="olx-trust-grid">
          <div className="olx-trust-item">
            <div className="olx-trust-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fa-solid fa-list-check"></i>
            </div>
            <h3 className="olx-trust-title">140+ Inspection Checks</h3>
            <p className="olx-trust-desc">
              Every certified vehicle undergoes rigorous mechanical, electrical, and structural evaluation by trained experts.
            </p>
          </div>

          <div className="olx-trust-item">
            <div className="olx-trust-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <h3 className="olx-trust-title">7 Days Money Back</h3>
            <p className="olx-trust-desc">
              Test drive for a whole week. If you're not completely satisfied with your car, return it for a 100% refund without questions.
            </p>
          </div>

          <div className="olx-trust-item">
            <div className="olx-trust-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <h3 className="olx-trust-title">Hassle-Free RC Transfer</h3>
            <p className="olx-trust-desc">
              We handle all RTO documentation, ownership transfers, and insurance endorsements completely free of cost.
            </p>
          </div>

          <div className="olx-trust-item">
            <div className="olx-trust-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="olx-trust-title">12 Months Warranty</h3>
            <p className="olx-trust-desc">
              Comprehensive warranty covering engine, gearbox, transmission and major electrical systems nationwide.
            </p>
          </div>
        </div>

        {/* Big Promotional Banner for Selling Car (OLX style) */}
        <div className="olx-sell-car-promo-banner">
          <div className="olx-sell-promo-text">
            <span className="olx-sell-tag">WANT TO SELL YOUR CAR?</span>
            <h3 className="olx-sell-headline">Get The Highest Value for Your Vehicle in 24 Hours</h3>
            <p className="olx-sell-sub">
              Free doorstep evaluation, instant payment directly to your bank account & free legal RC transfer.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 16 }}>
              <button className="olx-sell-cta-btn" onClick={onOpenSellWizard}>
                <i className="fa-solid fa-plus"></i> Post Free Car Ad
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f8fafc', fontSize: 13, fontWeight: 600 }}>
                <i className="fa-solid fa-phone" style={{ color: '#60a5fa' }}></i>
                <span>Or Call: +91 98765 43210</span>
              </div>
            </div>
          </div>

          <div className="olx-sell-promo-badges">
            <div className="promo-badge-card">
              <i className="fa-solid fa-bolt" style={{ color: '#eab308' }}></i>
              <div>
                <strong>Instant Cashout</strong>
                <span>Same day money transfer</span>
              </div>
            </div>
            <div className="promo-badge-card">
              <i className="fa-solid fa-tag" style={{ color: '#38bdf8' }}></i>
              <div>
                <strong>0% Commission</strong>
                <span>No hidden agent fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
