import React from 'react';

export function AndroidDeviceFrame({
  children,
  onExitMobileMode,
  selectedCity,
  onOpenCityModal,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenDrawer,
  onOpenSearch
}) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="android-frame-wrapper">
      <div className="android-frame-control-strip">
        <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>
          📱 <strong>SellBuy Android Mobile App Simulator</strong> (Live Interactive Preview)
        </span>
        <button className="android-frame-exit-btn" onClick={onExitMobileMode}>
          <i className="fa-solid fa-desktop"></i> Switch to Full Desktop Portal
        </button>
      </div>

      <div className="android-phone-chassis">
        {/* Android Punch Hole Camera */}
        <div className="android-punch-hole"></div>

        {/* Android Status Bar */}
        <div className="android-status-bar">
          <span className="android-time">{currentTime}</span>
          <div className="android-icons-group">
            <i className="fa-solid fa-signal" style={{ fontSize: 10 }}></i>
            <i className="fa-solid fa-wifi" style={{ fontSize: 10 }}></i>
            <span style={{ fontSize: 10, fontWeight: 700 }}>5G</span>
            <i className="fa-solid fa-battery-full" style={{ fontSize: 12 }}></i>
          </div>
        </div>

        {/* Android Top App Bar */}
        <div className="android-app-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="android-menu-icon" onClick={onOpenDrawer} title="Menu Drawer">
              <i className="fa-solid fa-bars"></i>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/assets/logo.jpg" alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
              <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>SellBuy</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="android-city-btn" onClick={onOpenCityModal}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', fontSize: 12 }}></i>
              <span>{selectedCity?.split(',')[0] || 'Jaipur'}</span>
            </button>

            <button className="android-notif-btn" onClick={onOpenNotifications}>
              <i className="fa-solid fa-bell"></i>
              {unreadNotificationsCount > 0 && <span className="android-badge-dot"></span>}
            </button>
          </div>
        </div>

        {/* Android App Screen Viewport */}
        <div className="android-screen-viewport">
          {children}
        </div>
      </div>
    </div>
  );
}
