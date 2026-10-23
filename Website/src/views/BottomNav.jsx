import React from 'react';

export function BottomNav({
  activeTab = 'home',
  onTabSelect,
  savedCount,
  unreadChatsCount,
  onOpenSavedCars,
  onOpenChat,
  onOpenSellWizard,
  onOpenProfile,
  onOpenSearch
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => {
          if (onTabSelect) onTabSelect('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => {
          if (onOpenSearch) onOpenSearch();
          else {
            const el = document.getElementById('explore-cars');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </button>

      {/* Prominent Center Sell Button */}
      <button
        className="bottom-nav-item-sell"
        onClick={onOpenSellWizard}
        title="Sell Vehicle"
      >
        <div className="bottom-nav-sell-circle">
          <i className="fa-solid fa-plus"></i>
        </div>
        <span>Sell</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={onOpenSavedCars}
      >
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-heart"></i>
          {savedCount > 0 && <span className="bottom-nav-badge">{savedCount}</span>}
        </div>
        <span>Saved</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={onOpenChat}
      >
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-comments"></i>
          {unreadChatsCount > 0 && <span className="bottom-nav-badge blue">{unreadChatsCount}</span>}
        </div>
        <span>Chat</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={onOpenProfile}
      >
        <i className="fa-solid fa-user"></i>
        <span>Account</span>
      </button>
    </nav>
  );
}
