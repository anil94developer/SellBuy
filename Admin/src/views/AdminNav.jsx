import React from 'react';

export function AdminHeader({ lang, toggleLang, isSidebarOpen, onToggleSidebar }) {
  return (
    <header className="global-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="admin-mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          title="Toggle Navigation Menu"
        >
          <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <div className="brand-section">
          <img src="/assets/logo.jpg" alt="SellBuy" className="brand-logo-img" />
          <div className="brand-info">
            <h1 style={{ margin: 0 }}>SellBuy Admin</h1>
            <span className="brand-badge hide-on-mobile">Marketplace Back-Office</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="admin-conn-status hide-on-mobile" style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
          MySQL Connected
        </span>

        <button className="lang-btn" onClick={toggleLang} title="Switch Language">
          <i className="fa-solid fa-globe"></i> <span className="hide-on-mobile">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '5px 12px', borderRadius: '20px' }}>
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" style={{ width: 24, height: 24, borderRadius: '50%' }} alt="" />
          <span className="hide-on-mobile" style={{ fontSize: '12px', fontWeight: 700 }}>Admin</span>
        </div>
      </div>
    </header>
  );
}

export const ADMIN_MENU_GROUPS = [
  {
    title: 'MAIN MENU',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
      { id: 'users', label: 'Users & Customers', icon: 'fa-users' },
      { id: 'dealers', label: 'Dealers & Sellers', icon: 'fa-user-tie', badge: 'Verified', badgeColor: 'green' },
      { id: 'inventory', label: 'All Cars / Inventory', icon: 'fa-warehouse' },
      { id: 'add-car', label: 'Add New Car', icon: 'fa-circle-plus', badge: 'New', badgeColor: 'blue' },
      {
        id: 'categories-brands',
        label: 'Categories & Brands',
        icon: 'fa-tags',
        badge: '3 Catalogues',
        badgeColor: 'blue',
        subItems: [
          { id: 'brands', label: 'Brands & Makes', icon: 'fa-certificate', badge: 'Makes' },
          { id: 'categories', label: 'Vehicle Segments', icon: 'fa-shapes', badge: 'Types' },
          { id: 'locations', label: 'Locations & Territories', icon: 'fa-location-dot', badge: 'Cities' },
        ]
      },
    ]
  },
  {
    title: 'MARKETPLACE',
    items: [
      { id: 'buy-requests', label: 'Buy Requests', icon: 'fa-hand-holding-dollar', badge: '12', badgeColor: 'blue' },
      { id: 'sell-requests', label: 'Sell Requests', icon: 'fa-file-invoice-dollar', badge: '8', badgeColor: 'orange' },
      { id: 'orders-bookings', label: 'Orders & Bookings', icon: 'fa-receipt', badge: '5', badgeColor: 'green' },
      { id: 'wishlist-enquiries', label: 'Wishlist & Enquiries', icon: 'fa-heart' },
      { id: 'test-drives', label: 'Test Drive Bookings', icon: 'fa-key', badge: '3', badgeColor: 'purple' },
    ]
  },
  {
    title: 'WEBSITE MANAGEMENT',
    items: [
      { id: 'website-pages', label: 'Website Pages', icon: 'fa-globe' },
      { id: 'banners-sliders', label: 'Banners & Sliders', icon: 'fa-images' },
      { id: 'blog-content', label: 'Blog & Content', icon: 'fa-newspaper' },
      { id: 'reviews-ratings', label: 'Reviews & Ratings', icon: 'fa-star' },
      { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { id: 'admin-users-roles', label: 'Admin Users & Roles', icon: 'fa-user-shield' },
      { id: 'permissions-security', label: 'Permissions & Security', icon: 'fa-lock' },
      { id: 'reports-analytics', label: 'Reports & Analytics', icon: 'fa-chart-line' },
      { id: 'payments-transactions', label: 'Payments & Transactions', icon: 'fa-credit-card' },
      { id: 'general-settings', label: 'General Settings', icon: 'fa-gear' },
      { id: 'support-complaints', label: 'Support & Complaints', icon: 'fa-headset', badge: '4', badgeColor: 'red' },
    ]
  }
];

export function AdminSidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const handleItemClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div className="admin-sidebar-backdrop" onClick={onClose}></div>
      )}

      <aside className={`admin-standalone-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Header with Close button */}
        <div className="admin-sidebar-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/logo.jpg" alt="SellBuy" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>Admin Menu</span>
          </div>
          <button className="admin-sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {ADMIN_MENU_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="admin-sidebar-group">
            <div className="admin-sidebar-section-title">
              <span>{group.title}</span>
              <span className="admin-sidebar-count">{group.items.length}</span>
            </div>
            <div className="admin-sidebar-items">
              {group.items.map(it => {
                const hasSub = it.subItems && it.subItems.length > 0;
                const isChildActive = hasSub && it.subItems.some(sub => sub.id === activeTab);
                const isItemActive = activeTab === it.id || isChildActive;

                return (
                  <div key={it.id} className="admin-nav-item-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      className={`admin-nav-item ${isItemActive ? 'active' : ''}`}
                      onClick={() => {
                        if (hasSub) {
                          if (!isChildActive) {
                            handleItemClick(it.subItems[0].id);
                          } else {
                            handleItemClick(it.id);
                          }
                        } else {
                          handleItemClick(it.id);
                        }
                      }}
                      style={{ position: 'relative' }}
                    >
                      <i className={`fa-solid ${it.icon}`}></i>
                      <span className="admin-nav-label">{it.label}</span>
                      {it.badge && (
                        <span className={`admin-nav-badge ${it.badgeColor || ''}`}>{it.badge}</span>
                      )}
                      {hasSub && (
                        <i
                          className={`fa-solid fa-chevron-${isItemActive ? 'down' : 'right'}`}
                          style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}
                        ></i>
                      )}
                    </button>

                    {/* Sub-menu options */}
                    {hasSub && isItemActive && (
                      <div
                        className="admin-sidebar-submenu"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          paddingLeft: '18px',
                          marginTop: '2px',
                          marginBottom: '4px',
                          borderLeft: '2px solid rgba(59, 130, 246, 0.4)',
                          marginLeft: '14px'
                        }}
                      >
                        {it.subItems.map(sub => (
                          <button
                            key={sub.id}
                            className={`admin-nav-item ${activeTab === sub.id ? 'active' : ''}`}
                            onClick={() => handleItemClick(sub.id)}
                            style={{
                              padding: '6px 10px',
                              fontSize: '12px',
                              background: activeTab === sub.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                              color: activeTab === sub.id ? '#60a5fa' : '#94a3b8',
                              fontWeight: activeTab === sub.id ? 700 : 500,
                              borderRadius: '6px'
                            }}
                          >
                            <i className={`fa-solid ${sub.icon}`} style={{ fontSize: '11px', width: '15px' }}></i>
                            <span className="admin-nav-label">{sub.label}</span>
                            {sub.badge && (
                              <span
                                style={{
                                  fontSize: '9px',
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  background: activeTab === sub.id ? '#2563eb40' : 'rgba(255,255,255,0.06)',
                                  color: activeTab === sub.id ? '#93c5fd' : '#64748b',
                                  marginLeft: 'auto'
                                }}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}
