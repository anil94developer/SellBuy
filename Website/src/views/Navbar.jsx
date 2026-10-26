import React from 'react';

export function Navbar({
  t,
  lang,
  toggleLang,
  selectedCity,
  onOpenCityModal,
  keyword,
  setKeyword,
  onSearch,
  brands = [],
  selectedBrand,
  onSelectBrand,
  activeTab,
  onTabChange,
  savedCount,
  onOpenSavedCars,
  unreadChatsCount,
  onOpenChat,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSellWizard,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onOpenDrawer,
  viewMode,
  toggleViewMode
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <header className="olx-header-wrapper">
      {/* TOP PRIMARY NAVBAR */}
      <div className="olx-main-nav">
        <div className="olx-nav-container">
          {/* 1. Hamburger Drawer Toggle & Logo */}
          <div className="olx-nav-brand-group">
            <button
              className="olx-drawer-toggle-btn"
              onClick={onOpenDrawer}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <div
              className="olx-brand-logo-wrap"
              onClick={() => {
                if (onSelectBrand) onSelectBrand('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src="/assets/logo.jpg" alt="SellBuy Logo" className="olx-logo-img" />
              <div>
                <span className="olx-brand-title">SellBuy</span>
                <span className="olx-brand-tag">CARS</span>
              </div>
            </div>
          </div>

          {/* 2. City / Location Selector Box (Desktop) */}
          <div className="olx-location-box hide-on-mobile" onClick={onOpenCityModal} title="Choose Location">
            <i className="fa-solid fa-location-dot olx-loc-icon"></i>
            <span className="olx-loc-text">
              {selectedCity?.split(',')[0] || 'Jaipur, Rajasthan'}
            </span>
            <i className="fa-solid fa-chevron-down olx-loc-arrow"></i>
          </div>

          {/* 3. Wide Center Search Bar (OLX style, full width on mobile) */}
          <form className="olx-search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="olx-search-input"
              placeholder="Find Cars by Make, Model, or Keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button
                type="button"
                className="olx-search-clear"
                onClick={() => {
                  setKeyword('');
                  if (onSearch) onSearch();
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
            <button type="submit" className="olx-search-submit-btn" title="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          {/* 4. Right Controls: Location, Language, Wishlist, Chat, Notifications, User & Iconic +SELL */}
          <div className="olx-right-controls">
            {/* Mobile Location Quick Button */}
            <button
              className="olx-mobile-loc-btn hide-on-desktop"
              onClick={onOpenCityModal}
              title="Choose City"
            >
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i>
              <span>{selectedCity?.split(',')[0] || 'Jaipur'}</span>
            </button>

            {/* Language Switcher */}
            <button className="olx-lang-btn" onClick={toggleLang} title="Switch Language">
              <span>{lang === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* Saved Cars (♥) - Desktop */}
            <button
              className="olx-nav-icon-btn hide-on-mobile"
              onClick={onOpenSavedCars}
              title="Saved Cars"
            >
              <i className="fa-solid fa-heart" style={{ color: savedCount > 0 ? '#ef4444' : '#475569' }}></i>
              {savedCount > 0 && <span className="olx-badge-count">{savedCount}</span>}
            </button>

            {/* Chats (💬) - Desktop */}
            <button
              className="olx-nav-icon-btn hide-on-mobile"
              onClick={onOpenChat}
              title="Chats & Messages"
            >
              <i className="fa-solid fa-comment-dots" style={{ color: '#2563eb' }}></i>
              {unreadChatsCount > 0 && <span className="olx-badge-count blue">{unreadChatsCount}</span>}
            </button>

            {/* Notifications (🔔) - Desktop */}
            <button
              className="olx-nav-icon-btn hide-on-mobile"
              onClick={onOpenNotifications}
              title="Notifications"
            >
              <i className="fa-solid fa-bell" style={{ color: '#f59e0b' }}></i>
              {unreadNotificationsCount > 0 && (
                <span className="olx-badge-count orange">{unreadNotificationsCount}</span>
              )}
            </button>

            {/* View Mode Toggle: Android Simulator vs Web - Desktop */}
            <button
              className={`olx-sim-mode-btn hide-on-mobile ${viewMode === 'mobile' ? 'active' : ''}`}
              onClick={toggleViewMode}
              title={viewMode === 'desktop' ? 'Switch to Android Mobile View' : 'Switch to Desktop Web View'}
            >
              <i className={viewMode === 'desktop' ? 'fa-solid fa-mobile-screen-button' : 'fa-solid fa-desktop'}></i>
              <span className="hide-on-tablet">
                {viewMode === 'desktop' ? 'App' : 'Web'}
              </span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="olx-user-chip" onClick={onOpenProfile} title="My Account">
                <img src={currentUser.avatar || '/assets/logo.jpg'} alt="" className="olx-user-avatar" />
                <span className="olx-user-name hide-on-tablet">{currentUser.name?.split(' ')[0]}</span>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: 9, opacity: 0.5 }}></i>
              </div>
            ) : (
              <button className="olx-login-btn" onClick={onOpenAuth}>
                <span>Login</span>
              </button>
            )}

            {/* Iconic OLX "+ SELL" Multi-Color Button */}
            <button className="olx-sell-button" onClick={onOpenSellWizard} title="Sell Your Car Free">
              <i className="fa-solid fa-plus"></i>
              <span>SELL</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY SUB-NAV BAR (OLX / Cars24 Category & Brand Strip) */}
      <div className="olx-sub-nav">
        <div className="olx-sub-nav-container">
          <div className="olx-sub-nav-left">
            <button className="olx-all-cats-btn" onClick={onOpenDrawer}>
              <span>ALL BRANDS</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }}></i>
            </button>

            {/* Popular Brand Links */}
            <div className="olx-brand-links-row">
              {brands.map(b => (
                <button
                  key={b.id || b.name}
                  className={`olx-brand-link-btn ${selectedBrand === b.name ? 'active' : ''}`}
                  onClick={() => onSelectBrand(selectedBrand === b.name ? '' : b.name)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filter Shortcuts */}
          <div className="olx-sub-nav-right hide-on-mobile">
            <button
              className={`olx-quick-pill ${activeTab === 'certified' ? 'active' : ''}`}
              onClick={() => onTabChange(activeTab === 'certified' ? 'all' : 'certified')}
            >
              <i className="fa-solid fa-shield-check" style={{ color: '#16a34a' }}></i> Certified
            </button>

            <button
              className={`olx-quick-pill ${activeTab === 'used' ? 'active' : ''}`}
              onClick={() => onTabChange(activeTab === 'used' ? 'all' : 'used')}
            >
              Pre-Owned Deals
            </button>

            <button
              className="olx-quick-pill"
              onClick={onOpenSellWizard}
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a' }}
            >
              <i className="fa-solid fa-camera"></i> Sell Your Car
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
