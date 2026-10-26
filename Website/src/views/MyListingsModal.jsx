import React from 'react';
import { CarModel } from '../models/CarModel';

export function MyListingsModal({
  isOpen,
  onClose,
  listings = [],
  counts,
  activeTab = 'all',
  onTabChange,
  onEditListing,
  onDeleteListing,
  onAddNewListing,
  onSelectCar
}) {
  if (!isOpen) return null;

  const filtered = listings.filter(item => {
    if (activeTab === 'all') return true;
    return (item.status || 'active') === activeTab;
  });

  const getTabCount = (tab) => {
    if (counts) {
      if (tab === 'all') return (Number(counts.active || 0) + Number(counts.pending || 0) + Number(counts.sold || 0)) || listings.length;
      if (counts[tab] !== undefined) return counts[tab];
    }
    return listings.filter(l => tab === 'all' ? true : (l.status || 'active') === tab).length;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="manage-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              <i className="fa-solid fa-car" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
              My Listed Vehicles
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Manage your active cars, price edits & buyer inquiries
            </span>
          </div>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Top actions & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'active', 'pending', 'sold'].map(tab => (
              <button
                key={tab}
                className={`web-tab-pill ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={() => {
              onClose();
              onAddNewListing();
            }}
          >
            <i className="fa-solid fa-plus"></i> Post Another Car
          </button>
        </div>

        {/* Listings List */}
        <div className="my-listings-scroll-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <i className="fa-solid fa-car-burst" style={{ fontSize: 36, opacity: 0.3, marginBottom: 12 }}></i>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>No listings in this status</div>
              <p style={{ fontSize: 13, margin: '6px 0 16px 0' }}>Post a free listing to reach verified buyers in minutes.</p>
              <button
                className="btn-primary"
                onClick={() => { onClose(); onAddNewListing(); }}
              >
                + Post Free Listing
              </button>
            </div>
          ) : (
            filtered.map(car => (
              <div key={car.id} className="my-listing-item-card">
                <img
                  src={car.primary_image || car.imageUrl || (car.images && car.images[0])}
                  alt={car.title}
                  className="my-listing-img"
                  onClick={() => { onClose(); onSelectCar(car.id); }}
                />

                <div className="my-listing-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4
                        className="my-listing-title"
                        onClick={() => { onClose(); onSelectCar(car.id); }}
                      >
                        {car.title}
                      </h4>
                      <div className="my-listing-price">
                        {CarModel.formatPrice(car.price)}
                      </div>
                    </div>
                    <span className={`listing-status-badge ${car.status || 'active'}`}>
                      {car.status === 'sold' ? 'Sold Out' : car.status === 'pending' ? 'Under Review' : 'Live & Active'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#64748b', margin: '8px 0' }}>
                    <span><i className="fa-regular fa-eye"></i> 142 Views</span>
                    <span><i className="fa-regular fa-comment"></i> 6 Inquiries</span>
                    <span><i className="fa-regular fa-heart"></i> 12 Saves</span>
                    <span><i className="fa-solid fa-location-dot"></i> {car.reg_city || car.location}</span>
                  </div>

                  <div className="my-listing-actions-row">
                    <button
                      className="btn-action-small edit"
                      onClick={() => onEditListing(car)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit Listing
                    </button>

                    <button
                      className="btn-action-small delete"
                      onClick={() => onDeleteListing(car.id)}
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
