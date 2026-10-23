import React, { useState } from 'react';

export function NotificationsModal({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onOpenChat,
  onOpenMyListings,
  onSelectCar
}) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'messages', 'listings', 'price_alert'

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleNotificationClick = (item) => {
    onMarkRead(item.id);
    if (item.actionType === 'chat') {
      onClose();
      onOpenChat();
    } else if (item.actionType === 'listings') {
      onClose();
      onOpenMyListings();
    } else if (item.actionType === 'car' && item.carId) {
      onClose();
      onSelectCar(item.carId);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-compact-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              <i className="fa-solid fa-bell" style={{ color: '#f59e0b', marginRight: 8 }}></i>
              Notifications
            </h2>
            <span style={{ fontSize: 12, color: '#64748b' }}>Stay updated on price drops & buyer messages</span>
          </div>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Filter Pills & Mark All Read */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'messages', label: 'Messages' },
              { id: 'listings', label: 'Listings' },
              { id: 'price_alert', label: 'Price Alerts' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`notif-filter-pill ${filterType === tab.id ? 'active' : ''}`}
                onClick={() => setFilterType(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            className="notif-mark-all-btn"
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="notif-scroll-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <i className="fa-regular fa-bell-slash" style={{ fontSize: 32, opacity: 0.3, marginBottom: 10 }}></i>
              <div>No notifications in this category</div>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className={`notif-item-card ${!item.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className={`notif-icon-circle ${item.type || 'all'}`}>
                  <i className={item.icon || 'fa-solid fa-bell'}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="notif-item-title">{item.title}</span>
                    <span className="notif-item-time">{item.time}</span>
                  </div>
                  <div className="notif-item-desc">{item.message}</div>
                </div>
                {!item.read && <span className="notif-unread-dot"></span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
