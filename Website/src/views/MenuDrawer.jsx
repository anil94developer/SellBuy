import React from 'react';

export function MenuDrawer({
  isOpen,
  onClose,
  currentUser,
  selectedCity,
  onOpenCityModal,
  onOpenMyListings,
  onOpenSavedCars,
  onOpenChat,
  onOpenNotifications,
  onOpenSellWizard,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  unreadChatsCount,
  unreadNotificationsCount,
  savedCount,
  toggleLang,
  lang,
  t
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header: User Profile Snapshot */}
        <div className="drawer-header">
          {currentUser ? (
            <div className="drawer-user-info" onClick={() => { onClose(); onOpenProfile(); }}>
              <img src={currentUser.avatar || '/assets/logo.jpg'} alt="" className="drawer-avatar" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="drawer-user-name">{currentUser.name}</span>
                  {currentUser.isVerified && <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 13 }}></i>}
                </div>
                <div className="drawer-user-phone">+91 {currentUser.phone}</div>
                <span className="drawer-badge-status" style={{ background: '#f0fdf4', color: '#15803d', fontWeight: 800 }}>
                  <i className="fa-solid fa-arrows-rotate" style={{ marginRight: 4 }}></i>
                  Buyer & Seller Account
                </span>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#94a3b8', fontSize: 12 }}></i>
            </div>
          ) : (
            <div className="drawer-guest-banner" onClick={() => { onClose(); onOpenAuth(); }}>
              <div className="drawer-guest-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 16 }}>Welcome to SellBuy</div>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Sign in for full access →</div>
              </div>
            </div>
          )}

          <button className="drawer-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Location chip */}
        <div className="drawer-city-row" onClick={() => { onClose(); onOpenCityModal(); }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', fontSize: 16 }}></i>
            <div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Active Location</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedCity}</div>
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Change</span>
        </div>

        {/* Navigation Menu Items Grouped by Dual Role */}
        <div className="drawer-menu-items">
          {/* SELLER SECTION */}
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#166534', padding: '6px 16px 2px' }}>
            <i className="fa-solid fa-tag"></i> Seller Features (गाड़ी बेचें)
          </div>

          <button className="drawer-item" onClick={() => { onClose(); onOpenSellWizard(); }}>
            <div className="drawer-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <i className="fa-solid fa-plus"></i>
            </div>
            <div className="drawer-item-label">{t('sellCar')}</div>
            <span className="drawer-tag-new" style={{ background: '#10b981' }}>Free</span>
          </button>

          <button className="drawer-item" onClick={() => { onClose(); onOpenMyListings(); }}>
            <div className="drawer-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <i className="fa-solid fa-car"></i>
            </div>
            <div className="drawer-item-label">My Listed Vehicles</div>
          </button>

          {/* BUYER SECTION */}
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#1e40af', padding: '10px 16px 2px' }}>
            <i className="fa-solid fa-cart-shopping"></i> Buyer Features (गाड़ी खरीदें)
          </div>

          <button className="drawer-item" onClick={() => { onClose(); onOpenSavedCars(); }}>
            <div className="drawer-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <i className="fa-solid fa-heart"></i>
            </div>
            <div className="drawer-item-label">Saved Cars (Wishlist)</div>
            {savedCount > 0 && <span className="drawer-count-badge red">{savedCount}</span>}
          </button>

          <button className="drawer-item" onClick={() => { onClose(); onOpenChat(); }}>
            <div className="drawer-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="drawer-item-label">Messages & Chats</div>
            {unreadChatsCount > 0 && <span className="drawer-count-badge blue">{unreadChatsCount}</span>}
          </button>

          <button className="drawer-item" onClick={() => { onClose(); onOpenNotifications(); }}>
            <div className="drawer-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="drawer-item-label">Notifications</div>
            {unreadNotificationsCount > 0 && <span className="drawer-count-badge orange">{unreadNotificationsCount}</span>}
          </button>

          <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />

          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', padding: '4px 16px 2px' }}>
            Tools & Settings
          </div>

          <button className="drawer-item" onClick={toggleLang}>
            <div className="drawer-icon-wrap" style={{ background: '#f8fafc', color: '#475569' }}>
              <i className="fa-solid fa-globe"></i>
            </div>
            <div className="drawer-item-label">Language / भाषा</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          <a href="#emi-calculator" className="drawer-item" onClick={onClose}>
            <div className="drawer-icon-wrap" style={{ background: '#f8fafc', color: '#475569' }}>
              <i className="fa-solid fa-calculator"></i>
            </div>
            <div className="drawer-item-label">EMI Loan Calculator</div>
          </a>

          <a href="tel:+919876543210" className="drawer-item">
            <div className="drawer-icon-wrap" style={{ background: '#f8fafc', color: '#475569' }}>
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className="drawer-item-label">Help & Support (+91 98765 43210)</div>
          </a>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="drawer-footer">
          {currentUser ? (
            <button className="drawer-logout-btn" onClick={() => { onLogout(); onClose(); }}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign Out</span>
            </button>
          ) : (
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => { onClose(); onOpenAuth(); }}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In / Register</span>
            </button>
          )}
          <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
            SellBuy App Version 2.4.0 • Made with ❤️ in India
          </div>
        </div>
      </div>
    </div>
  );
}
