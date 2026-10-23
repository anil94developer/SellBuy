import React, { useState } from 'react';
import { AdminImagePicker } from './AdminImagePicker';

/* ==========================================================================
   1. MAIN MENU SECTIONS
   ========================================================================== */

// 1. Dashboard Overview
export function DashboardSection({ stats, listings, onApprove, onReject, onToggleFeature, onRefresh, setActiveTab, t }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-chart-pie" style={{ color: '#3b82f6' }}></i> Executive Dashboard</h2>
          <div className="admin-section-subtitle">Real-time automotive marketplace volume, traffic, and moderation stream.</div>
        </div>
        <div className="admin-header-actions">
          <button className="btn-secondary" onClick={onRefresh} style={{ width: 'auto' }}>
            <i className="fa-solid fa-rotate-right"></i> {t('refresh')}
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('add-car')} style={{ width: 'auto' }}>
            <i className="fa-solid fa-plus"></i> Add New Car
          </button>
        </div>
      </div>

      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-label">{t('totalUsers')}</div>
          <div className="kpi-value">{stats.totalUsers || 1420}</div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>↑ +14% this month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{t('activeListings')}</div>
          <div className="kpi-value" style={{ color: 'var(--accent-green)' }}>{stats.activeListings || listings.length}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Across 10 major cities</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{t('pendingApprovals')}</div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>
            {listings.filter(l => l.status === 'pending').length || stats.pendingApprovals || 0}
          </div>
          <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 4 }}>Requires moderator action</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{t('catalogValue')}</div>
          <div className="kpi-value" style={{ color: '#60a5fa' }}>
            ₹{Number(stats.totalMarketValue || 34500000).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Live Verified Inventory</div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <button className="admin-data-card" onClick={() => setActiveTab('buy-requests')} style={{ cursor: 'pointer', textAlign: 'left', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700 }}><i className="fa-solid fa-hand-holding-dollar"></i> Buy Leads</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: '#fff' }}>12 Active Leads</div>
        </button>
        <button className="admin-data-card" onClick={() => setActiveTab('orders-bookings')} style={{ cursor: 'pointer', textAlign: 'left', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: 12, color: '#86efac', fontWeight: 700 }}><i className="fa-solid fa-receipt"></i> Bookings & Tokens</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: '#fff' }}>5 In Pipeline</div>
        </button>
        <button className="admin-data-card" onClick={() => setActiveTab('test-drives')} style={{ cursor: 'pointer', textAlign: 'left', border: '1px solid rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: 12, color: '#fde68a', fontWeight: 700 }}><i className="fa-solid fa-key"></i> Test Drives Today</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: '#fff' }}>3 Scheduled</div>
        </button>
        <button className="admin-data-card" onClick={() => setActiveTab('dealers')} style={{ cursor: 'pointer', textAlign: 'left', border: '1px solid rgba(168,85,247,0.3)' }}>
          <div style={{ fontSize: 12, color: '#d8b4fe', fontWeight: 700 }}><i className="fa-solid fa-user-tie"></i> Verified Dealers</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: '#fff' }}>5 Dealerships</div>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Listings Queue</h3>
        <button className="btn-text" onClick={() => setActiveTab('inventory')} style={{ color: '#60a5fa' }}>
          View All Inventory →
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle Title</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.slice(0, 6).map(car => (
            <tr key={car.id}>
              <td>#{car.id}</td>
              <td><strong>{car.title}</strong></td>
              <td>{car.seller_name || 'Individual Seller'}</td>
              <td style={{ color: '#60a5fa', fontWeight: 700 }}>₹{Number(car.price).toLocaleString('en-IN')}</td>
              <td><span className={`status-pill status-${car.status}`}>{car.status}</span></td>
              <td>{car.is_featured ? '⭐ Featured' : 'Standard'}</td>
              <td>
                {car.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="admin-action-pill-btn primary" onClick={() => onApprove(car.id)}>Approve</button>
                    <button className="admin-action-pill-btn danger" onClick={() => onReject(car.id)}>Reject</button>
                  </div>
                ) : (
                  <button className="admin-action-pill-btn secondary" onClick={() => onToggleFeature(car.id)}>
                    {car.is_featured ? '★ Starred' : '☆ Feature'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 2. Users & Customers Management (Dual-Role Buyer & Seller Hub with Server-Side DataTable)
export function UsersSection({ users = [], pagination = {}, onFetchUsers, onToggleBlock }) {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(pagination.limit || 10);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const totalRecords = pagination.total || users.length;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;
    if (onFetchUsers) {
      onFetchUsers({
        page: newPage,
        limit: pageSize,
        search: search.trim(),
        mode: modeFilter,
        status: statusFilter
      });
    }
  };

  const handleModeChange = (newMode) => {
    setModeFilter(newMode);
    if (onFetchUsers) {
      onFetchUsers({
        page: 1,
        limit: pageSize,
        search: search.trim(),
        mode: newMode,
        status: statusFilter
      });
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    if (onFetchUsers) {
      onFetchUsers({
        page: 1,
        limit: pageSize,
        search: search.trim(),
        mode: modeFilter,
        status: newStatus
      });
    }
  };

  const handlePageSizeChange = (newSize) => {
    const size = Number(newSize);
    setPageSize(size);
    if (onFetchUsers) {
      onFetchUsers({
        page: 1,
        limit: size,
        search: search.trim(),
        mode: modeFilter,
        status: statusFilter
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFetchUsers) {
      onFetchUsers({
        page: 1,
        limit: pageSize,
        search: search.trim(),
        mode: modeFilter,
        status: statusFilter
      });
    }
  };

  const clearSearch = () => {
    setSearch('');
    if (onFetchUsers) {
      onFetchUsers({
        page: 1,
        limit: pageSize,
        search: '',
        mode: modeFilter,
        status: statusFilter
      });
    }
  };

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const dualUsersCount = users.filter(u => u.user_mode?.includes('Dual') || (Number(u.listings_count || 0) > 0 && (Number(u.favorites_count || 0) > 0 || Number(u.buyer_chats_count || 0) > 0))).length;
  const sellersCount = users.filter(u => Number(u.listings_count || 0) > 0).length;
  const buyersCount = users.filter(u => Number(u.favorites_count || 0) > 0 || Number(u.buyer_chats_count || 0) > 0 || !u.listings_count).length;

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>
            <i className="fa-solid fa-users" style={{ color: '#38bdf8' }}></i> Users & Customers (Dual Buyer/Seller Accounts)
          </h2>
          <div className="admin-section-subtitle">
            Every customer account has full dual capabilities: buying vehicles & selling cars seamlessly under unified login.
          </div>
        </div>
      </div>

      {/* Dual Role Metrics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="kpi-card" style={{ padding: '14px 18px' }}>
          <div className="kpi-label">Total Accounts (DB)</div>
          <div className="kpi-value" style={{ fontSize: 22, color: '#f8fafc' }}>{totalRecords}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Unified Buyer/Seller Profiles</div>
        </div>
        <div className="kpi-card" style={{ padding: '14px 18px', borderLeft: '3px solid #38bdf8' }}>
          <div className="kpi-label">Dual Active (Buy + Sell)</div>
          <div className="kpi-value" style={{ fontSize: 22, color: '#38bdf8' }}>{dualUsersCount || Math.round(totalRecords * 0.4)}</div>
          <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}>Active Listings & Inquiries</div>
        </div>
        <div className="kpi-card" style={{ padding: '14px 18px', borderLeft: '3px solid #10b981' }}>
          <div className="kpi-label">Active Sellers</div>
          <div className="kpi-value" style={{ fontSize: 22, color: '#10b981' }}>{sellersCount || Math.round(totalRecords * 0.5)}</div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>Vehicles in Live Inventory</div>
        </div>
        <div className="kpi-card" style={{ padding: '14px 18px', borderLeft: '3px solid #f59e0b' }}>
          <div className="kpi-label">Active Buyers</div>
          <div className="kpi-value" style={{ fontSize: 22, color: '#f59e0b' }}>{buyersCount || totalRecords}</div>
          <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>Favorites & Chat Enquiries</div>
        </div>
      </div>

      {/* SERVER-SIDE DATATABLE TOOLBAR */}
      <div className="admin-search-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ width: '100%', paddingLeft: 34 }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}>
            Search
          </button>
        </form>

        <select
          value={modeFilter}
          onChange={(e) => handleModeChange(e.target.value)}
          className="admin-filter-select"
        >
          <option value="ALL">All Account Modes</option>
          <option value="dual">Dual: Buyer & Seller</option>
          <option value="seller">Sellers (Has Inventory)</option>
          <option value="buyer">Buyers (Inquiries Only)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="admin-filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="active">Active Only</option>
          <option value="blocked">Blocked Only</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="admin-filter-select"
            style={{ width: 'auto', padding: '6px 10px' }}
          >
            <option value="5">5 rows</option>
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
          </select>
        </div>

        <span className="admin-badge-count-pill" style={{ marginLeft: 'auto' }}>
          {totalRecords} Total Users
        </span>
      </div>

      {/* DATATABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th>Customer / User Profile</th>
            <th>Contact Info</th>
            <th>Account Dual Mode</th>
            <th>Selling Activity</th>
            <th>Buying Activity</th>
            <th>Status</th>
            <th style={{ textAlign: 'right', width: 170 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const listings = Number(u.listings_count || 0);
            const buyerActivity = Number(u.favorites_count || 0) + Number(u.buyer_chats_count || 0);
            const isDual = u.user_mode?.includes('Dual') || (listings > 0 && buyerActivity > 0);

            return (
              <tr key={u.id}>
                <td><strong>#{u.id}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.1)' }}
                      alt=""
                    />
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: 14 }}>{u.name}</strong>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>⭐ {u.rating || '4.8'}</span>
                        <span style={{ color: '#10b981' }}>• KYC Verified ✓</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>+91 {u.phone}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email || `${u.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</div>
                </td>
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background: isDual ? 'rgba(56, 189, 248, 0.15)' : listings > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isDual ? '#38bdf8' : listings > 0 ? '#34d399' : '#fbbf24',
                      border: `1px solid ${isDual ? 'rgba(56, 189, 248, 0.3)' : listings > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}
                  >
                    <i className={isDual ? "fa-solid fa-arrows-rotate" : listings > 0 ? "fa-solid fa-tag" : "fa-solid fa-cart-shopping"}></i>
                    {u.user_mode || (isDual ? 'Dual: Buyer & Seller' : listings > 0 ? 'Seller Mode' : 'Buyer Mode')}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: 12, fontWeight: 700, color: listings > 0 ? '#10b981' : '#64748b' }}>
                    <i className="fa-solid fa-car-side" style={{ marginRight: 5 }}></i>
                    {listings > 0 ? `${listings} Listed Car${listings > 1 ? 's' : ''}` : 'No cars listed'}
                  </div>
                  {listings > 0 && <div style={{ fontSize: 10, color: '#94a3b8' }}>Active Seller Profile</div>}
                </td>
                <td>
                  <div style={{ fontSize: 12, fontWeight: 700, color: buyerActivity > 0 ? '#38bdf8' : '#94a3b8' }}>
                    <i className="fa-solid fa-heart" style={{ marginRight: 5 }}></i>
                    {buyerActivity > 0 ? `${buyerActivity} Saved / Inquiries` : 'Buyer Enabled'}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Enquiry & Buying Ready</div>
                </td>
                <td>
                  <span className={`status-pill status-${u.status || 'active'}`}>
                    {u.status === 'blocked' ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      className="admin-action-pill-btn secondary"
                      onClick={() => setSelectedUser(u)}
                      title="View Dual Profile"
                      style={{ padding: '6px 10px' }}
                    >
                      <i className="fa-solid fa-id-card"></i> View
                    </button>
                    <button
                      className={`admin-action-pill-btn ${u.status === 'blocked' ? 'success' : 'danger'}`}
                      onClick={() => onToggleBlock(u.id)}
                      style={{ padding: '6px 10px' }}
                    >
                      {u.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                <i className="fa-solid fa-user-slash" style={{ fontSize: 28, marginBottom: 8, display: 'block', opacity: 0.5 }}></i>
                No customers found matching search query "{search}".
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* SERVER-SIDE PAGINATION CONTROLS BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
          padding: '12px 16px',
          background: '#111827',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ fontSize: 13, color: '#94a3b8' }}>
          Showing <strong style={{ color: '#f8fafc' }}>{startRecord}</strong> to{' '}
          <strong style={{ color: '#f8fafc' }}>{endRecord}</strong> of{' '}
          <strong style={{ color: '#60a5fa' }}>{totalRecords}</strong> users (Server-Side)
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: currentPage <= 1 ? 'rgba(255,255,255,0.04)' : '#1e293b',
              color: currentPage <= 1 ? '#475569' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 700
            }}
            title="First Page"
          >
            « First
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: currentPage <= 1 ? 'rgba(255,255,255,0.04)' : '#1e293b',
              color: currentPage <= 1 ? '#475569' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 700
            }}
          >
            ‹ Prev
          </button>

          {/* Dynamic Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((pageNum, idx, arr) => (
              <React.Fragment key={pageNum}>
                {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                  <span style={{ color: '#64748b', padding: '0 4px' }}>...</span>
                )}
                <button
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: currentPage === pageNum ? 'var(--primary-gradient)' : '#1e293b',
                    color: '#fff',
                    border: currentPage === pageNum ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                    fontWeight: currentPage === pageNum ? 800 : 600,
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: currentPage >= totalPages ? 'rgba(255,255,255,0.04)' : '#1e293b',
              color: currentPage >= totalPages ? '#475569' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 700
            }}
          >
            Next ›
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: currentPage >= totalPages ? 'rgba(255,255,255,0.04)' : '#1e293b',
              color: currentPage >= totalPages ? '#475569' : '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: 12,
              fontWeight: 700
            }}
            title="Last Page"
          >
            Last »
          </button>
        </div>
      </div>

      {/* DUAL ACCOUNT PROFILE DETAIL MODAL */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 520,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              color: '#f8fafc'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-id-card" style={{ color: '#38bdf8' }}></i>
                Unified Account Profile: #{selectedUser.id}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, background: '#1e293b', padding: 14, borderRadius: 10 }}>
              <img
                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                alt=""
              />
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{selectedUser.name}</h4>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Phone: +91 {selectedUser.phone}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Email: {selectedUser.email || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  <i className="fa-solid fa-tag" style={{ marginRight: 4 }}></i> Seller Capabilities
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
                  {selectedUser.listings_count || 0} Listed Cars
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Can create & publish vehicles</div>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  <i className="fa-solid fa-cart-shopping" style={{ marginRight: 4 }}></i> Buyer Capabilities
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
                  {(Number(selectedUser.favorites_count || 0) + Number(selectedUser.buyer_chats_count || 0))} Enquiries
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Can book token & test drives</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className={`admin-action-pill-btn ${selectedUser.status === 'blocked' ? 'success' : 'danger'}`}
                onClick={() => {
                  onToggleBlock(selectedUser.id);
                  setSelectedUser(null);
                }}
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {selectedUser.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedUser(null)}
                style={{ width: 'auto', padding: '8px 16px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// 3. Dealers & Sellers
export function DealersSection({ dealers, onToggleVerification, onAddDealer }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [tier, setTier] = useState('Gold Partner');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onAddDealer({ name, owner, phone, city, tier });
    setName('');
    setOwner('');
    setPhone('');
    setShowModal(false);
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-user-tie" style={{ color: '#10b981' }}></i> Dealers & Certified Sellers</h2>
          <div className="admin-section-subtitle">Verified dealership partners, certified showrooms, and commercial sellers network.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
          <i className="fa-solid fa-plus"></i> Register Dealership
        </button>
      </div>

      <div className="admin-card-grid">
        {dealers.map(d => (
          <div key={d.id} className="admin-data-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, color: '#fff' }}>{d.name}</h4>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>👤 {d.owner} • {d.city}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(37,99,235,0.2)', color: '#60a5fa' }}>
                {d.tier}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Active Stock</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{d.stock} Cars</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Total Sold</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{d.sold}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Rating</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>★ {d.rating}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>📞 {d.phone}</span>
              <button
                className={`admin-action-pill-btn ${d.verified ? 'secondary' : 'success'}`}
                onClick={() => onToggleVerification(d.id)}
              >
                {d.verified ? 'Verified ✓' : 'Approve Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card-container" onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0 }}>Register Certified Dealership</h3>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Dealership Business Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Contact Person / Owner</label>
                <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Partnership Tier</label>
                <select value={tier} onChange={(e) => setTier(e.target.value)} className="admin-filter-select" style={{ width: '100%' }}>
                  <option value="Platinum Partner">Platinum Partner</option>
                  <option value="Gold Partner">Gold Partner</option>
                  <option value="Silver Partner">Silver Partner</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Dealer</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// 4. All Cars / Inventory
export function InventorySection({ listings, search, setSearch, onApprove, onReject, onToggleFeature, onDelete, setActiveTab }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = listings.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesStatus;
  });

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-warehouse" style={{ color: '#a855f7' }}></i> All Cars / Inventory</h2>
          <div className="admin-section-subtitle">Live vehicle warehouse, approval queue, featured showcases and pricing moderation.</div>
        </div>
        <button className="btn-primary" onClick={() => setActiveTab('add-car')} style={{ width: 'auto' }}>
          <i className="fa-solid fa-plus"></i> Add New Car
        </button>
      </div>

      <div className="admin-search-filter-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, brand, seller or city..."
          className="admin-search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-filter-select">
          <option value="all">All Statuses</option>
          <option value="active">Active (Published)</option>
          <option value="pending">Pending Approvals</option>
          <option value="sold">Sold</option>
          <option value="rejected">Rejected</option>
        </select>
        <span className="admin-badge-count-pill">{filtered.length} Vehicles</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Vehicle Title & Specs</th>
            <th>Seller Info</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(car => (
            <tr key={car.id}>
              <td>#{car.id}</td>
              <td>
                <img src={car.primary_image || '/assets/cars/creta.jpg'} style={{ width: 50, height: 36, objectFit: 'cover', borderRadius: 6 }} alt="" />
              </td>
              <td>
                <strong>{car.title}</strong>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {car.reg_city} • {car.fuel_type} • {car.transmission} • {car.km_driven ? Number(car.km_driven).toLocaleString('en-IN') + ' km' : 'Low KM'}
                </div>
              </td>
              <td>{car.seller_name || 'Direct Seller'}</td>
              <td style={{ color: '#60a5fa', fontWeight: 700 }}>₹{Number(car.price).toLocaleString('en-IN')}</td>
              <td><span className={`status-pill status-${car.status}`}>{car.status}</span></td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {car.status === 'pending' ? (
                    <>
                      <button className="admin-action-pill-btn primary" onClick={() => onApprove(car.id)}>Approve</button>
                      <button className="admin-action-pill-btn danger" onClick={() => onReject(car.id)}>Reject</button>
                    </>
                  ) : (
                    <>
                      <button className="admin-action-pill-btn secondary" onClick={() => onToggleFeature(car.id)}>
                        {car.is_featured ? '★ Starred' : '☆ Feature'}
                      </button>
                      <button className="admin-action-pill-btn danger" onClick={() => onDelete(car.id)}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 5. Add New Car (Admin Form)
export function AddCarSection({ brands, cities, onAddCar }) {
  const [title, setTitle] = useState('');
  const [brandId, setBrandId] = useState(1);
  const [modelName, setModelName] = useState('');
  const [manufacturingYear, setManufacturingYear] = useState('2022');
  const [regCity, setRegCity] = useState('Jaipur');
  const [price, setPrice] = useState('');
  const [kmDriven, setKmDriven] = useState('28000');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [ownership, setOwnership] = useState('1st Owner');
  const [images, setImages] = useState(['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80']);
  const [description, setDescription] = useState('Top condition certified vehicle with complete service history and zero-dep insurance.');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert('Please enter vehicle title and asking price.');
      return;
    }
    onAddCar({
      title,
      brandId,
      modelName: modelName || title.split(' ')[0],
      manufacturingYear,
      regYear: manufacturingYear,
      regCity,
      price,
      kmDriven,
      fuelType,
      transmission,
      ownership,
      description,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80']
    });
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-circle-plus" style={{ color: '#2563eb' }}></i> Add New Car to Inventory</h2>
          <div className="admin-section-subtitle">Create verified vehicle listings directly with instant publishing into the marketplace.</div>
        </div>
      </div>

      <div className="admin-card-container" style={{ maxWidth: 840 }}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label className="admin-form-label">Vehicle Title</label>
              <input
                type="text"
                placeholder="e.g. 2022 Hyundai Creta 1.5 SX Executive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Brand</label>
              <select value={brandId} onChange={(e) => setBrandId(Number(e.target.value))} className="admin-filter-select">
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Model Name</label>
              <input
                type="text"
                placeholder="e.g. Creta, Swift, Fortuner"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Asking Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Manufacturing Year</label>
              <input
                type="number"
                value={manufacturingYear}
                onChange={(e) => setManufacturingYear(e.target.value)}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Registration City</label>
              <select value={regCity} onChange={(e) => setRegCity(e.target.value)} className="admin-filter-select">
                {cities.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">KM Driven</label>
              <input
                type="number"
                value={kmDriven}
                onChange={(e) => setKmDriven(e.target.value)}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Fuel Type</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="admin-filter-select">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Transmission</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="admin-filter-select">
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Ownership</label>
              <select value={ownership} onChange={(e) => setOwnership(e.target.value)} className="admin-filter-select">
                <option value="1st Owner">1st Owner</option>
                <option value="2nd Owner">2nd Owner</option>
                <option value="3rd Owner">3rd Owner</option>
              </select>
            </div>

            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <AdminImagePicker
                label="Vehicle Photos & Gallery"
                hint="Upload car exterior, interior, or odometer photos (Drag & drop or browse)"
                multiple={true}
                value={images}
                onChange={setImages}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label className="admin-form-label">Vehicle Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>
              <i className="fa-solid fa-cloud-arrow-up"></i> Publish Car to Inventory
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// 6. Categories, Brands & Locations (Comprehensive Multi-Submenu Catalog CRUD)
export function CategoriesBrandsSection({
  activeSubTab = 'brands',
  onSubTabChange,
  brands = [],
  categories = [],
  cities = [],
  onAddBrand,
  onUpdateBrand,
  onToggleBrandStatus,
  onDeleteBrand,
  onAddCategory,
  onUpdateCategory,
  onToggleCategoryStatus,
  onDeleteCategory,
  onAddCity,
  onUpdateCity,
  onToggleCityStatus,
  onDeleteCity
}) {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'brands');

  // Keep internal sub-tab in sync if parent passed updated activeSubTab
  React.useEffect(() => {
    if (activeSubTab && activeSubTab !== currentSubTab) {
      setCurrentSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const switchSubTab = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSubTabChange) onSubTabChange(tabId);
  };

  // Search filters
  const [brandSearch, setBrandSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Modals state: null | { mode: 'add' | 'edit', data: object }
  const [brandModal, setBrandModal] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [cityModal, setCityModal] = useState(null);

  // Form states with isActive flag
  const [brandForm, setBrandForm] = useState({ name: '', logoIcon: '🚗', country: 'India', isPopular: true, isActive: true });
  const [catForm, setCatForm] = useState({ name: '', icon: '🚙', description: '', popularModels: '', avgBudget: '', isActive: true });
  const [cityForm, setCityForm] = useState({ name: '', state: '', isPopular: true, isActive: true });

  // Open Add Modals
  const openAddBrand = () => {
    setBrandForm({ name: '', logoIcon: '🚗', country: 'India', isPopular: true, isActive: true });
    setBrandModal({ mode: 'add' });
  };

  const openEditBrand = (b) => {
    setBrandForm({ id: b.id, name: b.name, logoIcon: b.logo_icon || '🚗', country: b.country || 'India', isPopular: !!b.is_popular, isActive: b.is_active !== 0 });
    setBrandModal({ mode: 'edit', id: b.id });
  };

  const openAddCategory = () => {
    setCatForm({ name: '', icon: '🚙', description: '', popularModels: '', avgBudget: '', isActive: true });
    setCatModal({ mode: 'add' });
  };

  const openEditCategory = (c) => {
    setCatForm({
      id: c.id,
      name: c.name,
      icon: c.icon || '🚙',
      description: c.description || '',
      popularModels: c.popular_models || '',
      avgBudget: c.avg_budget || '',
      isActive: c.is_active !== 0
    });
    setCatModal({ mode: 'edit', id: c.id });
  };

  const openAddCity = () => {
    setCityForm({ name: '', state: '', isPopular: true, isActive: true });
    setCityModal({ mode: 'add' });
  };

  const openEditCity = (c) => {
    setCityForm({ id: c.id, name: c.name, state: c.state, isPopular: !!c.is_popular, isActive: c.is_active !== 0 });
    setCityModal({ mode: 'edit', id: c.id });
  };

  // Submit Handlers
  const handleSaveBrand = (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return alert('Please enter brand name');
    if (brandModal.mode === 'add') {
      onAddBrand({
        name: brandForm.name.trim(),
        logoIcon: brandForm.logoIcon.trim() || '🚗',
        country: brandForm.country.trim() || 'India',
        isPopular: brandForm.isPopular,
        isActive: brandForm.isActive !== false
      });
    } else {
      onUpdateBrand(brandModal.id, {
        name: brandForm.name.trim(),
        logoIcon: brandForm.logoIcon.trim() || '🚗',
        country: brandForm.country.trim() || 'India',
        isPopular: brandForm.isPopular,
        isActive: brandForm.isActive !== false
      });
    }
    setBrandModal(null);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return alert('Please enter vehicle category name');
    if (catModal.mode === 'add') {
      onAddCategory({
        name: catForm.name.trim(),
        icon: catForm.icon.trim() || '🚙',
        description: catForm.description.trim(),
        popularModels: catForm.popularModels.trim(),
        avgBudget: catForm.avgBudget.trim(),
        isActive: catForm.isActive !== false
      });
    } else {
      onUpdateCategory(catModal.id, {
        name: catForm.name.trim(),
        icon: catForm.icon.trim() || '🚙',
        description: catForm.description.trim(),
        popularModels: catForm.popularModels.trim(),
        avgBudget: catForm.avgBudget.trim(),
        isActive: catForm.isActive !== false
      });
    }
    setCatModal(null);
  };

  const handleSaveCity = (e) => {
    e.preventDefault();
    if (!cityForm.name.trim() || !cityForm.state.trim()) return alert('Please enter city name and state');
    if (cityModal.mode === 'add') {
      onAddCity({
        name: cityForm.name.trim(),
        state: cityForm.state.trim(),
        isPopular: cityForm.isPopular,
        isActive: cityForm.isActive !== false
      });
    } else {
      onUpdateCity(cityModal.id, {
        name: cityForm.name.trim(),
        state: cityForm.state.trim(),
        isPopular: cityForm.isPopular,
        isActive: cityForm.isActive !== false
      });
    }
    setCityModal(null);
  };

  // Filtered lists
  const filteredBrands = brands.filter(b =>
    b.name?.toLowerCase().includes(brandSearch.toLowerCase()) ||
    (b.country && b.country.toLowerCase().includes(brandSearch.toLowerCase()))
  );

  const filteredCategories = categories.filter(c =>
    c.name?.toLowerCase().includes(catSearch.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(catSearch.toLowerCase())) ||
    (c.popular_models && c.popular_models.toLowerCase().includes(catSearch.toLowerCase()))
  );

  const filteredCities = cities.filter(c =>
    c.name?.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.state?.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <section>
      {/* SECTION HEADER */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>
            <i className="fa-solid fa-tags" style={{ color: '#eab308' }}></i> Categories, Brands & Locations
          </h2>
          <div className="admin-section-subtitle">
            Configure car manufacturers, vehicle body segments, and supported marketplace territories with dedicated CRUD controls.
          </div>
        </div>
      </div>

      {/* DEDICATED SUB-MENU NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          background: '#111827',
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => switchSubTab('brands')}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: currentSubTab === 'brands' ? '1.5px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
            background: currentSubTab === 'brands' ? 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(30,58,138,0.35))' : '#1e293b',
            color: currentSubTab === 'brands' ? '#60a5fa' : '#94a3b8',
            fontWeight: currentSubTab === 'brands' ? 800 : 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <i className="fa-solid fa-certificate" style={{ color: currentSubTab === 'brands' ? '#60a5fa' : '#64748b' }}></i>
            1. Car Brands & Makes
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
              background: currentSubTab === 'brands' ? '#2563eb' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 700
            }}
          >
            {brands.length} Makes
          </span>
        </button>

        <button
          onClick={() => switchSubTab('categories')}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: currentSubTab === 'categories' ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
            background: currentSubTab === 'categories' ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,78,59,0.3))' : '#1e293b',
            color: currentSubTab === 'categories' ? '#34d399' : '#94a3b8',
            fontWeight: currentSubTab === 'categories' ? 800 : 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <i className="fa-solid fa-shapes" style={{ color: currentSubTab === 'categories' ? '#34d399' : '#64748b' }}></i>
            2. Vehicle Body Segments
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
              background: currentSubTab === 'categories' ? '#059669' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 700
            }}
          >
            {categories.length} Segments
          </span>
        </button>

        <button
          onClick={() => switchSubTab('locations')}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: currentSubTab === 'locations' ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
            background: currentSubTab === 'locations' ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(120,53,15,0.3))' : '#1e293b',
            color: currentSubTab === 'locations' ? '#fbbf24' : '#94a3b8',
            fontWeight: currentSubTab === 'locations' ? 800 : 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: currentSubTab === 'locations' ? '#fbbf24' : '#64748b' }}></i>
            3. Locations & Territories
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
              background: currentSubTab === 'locations' ? '#d97706' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 700
            }}
          >
            {cities.length} Cities
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-MENU 1: CAR BRANDS & MANUFACTURERS                         */}
      {/* ============================================================== */}
      {currentSubTab === 'brands' && (
        <div className="admin-card-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-certificate" style={{ color: '#3b82f6' }}></i>
                Car Manufacturers & Brands ({filteredBrands.length})
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                Manage all automobile OEM brands available for sellers to select while listing vehicles.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands (e.g. Maruti, Tata)..."
                className="admin-search-input"
                style={{ width: 240 }}
              />
              <button
                className="btn-primary"
                onClick={openAddBrand}
                style={{ width: 'auto', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="fa-solid fa-plus"></i> Add Brand
              </button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Brand / Make</th>
                <th>Origin / Country</th>
                <th>Popularity</th>
                <th>Database Status</th>
                <th style={{ textAlign: 'right', width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map(b => (
                <tr key={b.id}>
                  <td><strong>#{b.id}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24, width: 36, height: 36, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                        {b.logo_icon || '🚗'}
                      </span>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: 14 }}>{b.name}</strong>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>OEM Manufacturer</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>{b.country || 'Global / India'}</span>
                  </td>
                  <td>
                    {b.is_popular ? (
                      <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        🔥 Popular Maker
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', padding: '3px 8px', borderRadius: 6, fontSize: 11 }}>
                        Standard
                      </span>
                    )}
                  </td>
                  <td>
                    {b.is_active !== 0 ? (
                      <span className="status-pill status-active">
                        <i className="fa-solid fa-circle-check" style={{ marginRight: 4 }}></i> Active
                      </span>
                    ) : (
                      <span className="status-pill status-rejected">
                        <i className="fa-solid fa-circle-xmark" style={{ marginRight: 4 }}></i> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className={`admin-action-pill-btn ${b.is_active !== 0 ? 'danger' : 'success'}`}
                        onClick={() => onToggleBrandStatus && onToggleBrandStatus(b.id)}
                        title={b.is_active !== 0 ? 'Deactivate Brand' : 'Activate Brand'}
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className={`fa-solid ${b.is_active !== 0 ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                        {' '}
                        {b.is_active !== 0 ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="admin-action-pill-btn secondary"
                        onClick={() => openEditBrand(b)}
                        title="Edit Brand"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button
                        className="admin-action-pill-btn danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete brand "${b.name}"?`)) {
                            onDeleteBrand(b.id);
                          }
                        }}
                        title="Delete Brand"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBrands.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                    No brands found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MENU 2: VEHICLE BODY SEGMENTS                              */}
      {/* ============================================================== */}
      {currentSubTab === 'categories' && (
        <div className="admin-card-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-shapes" style={{ color: '#10b981' }}></i>
                Vehicle Body Segments & Categories ({filteredCategories.length})
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                Configure vehicle classification body types (SUV, Sedan, Hatchback, EV) shown across filter bars and search engines.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Search segments (e.g. SUV, EV)..."
                className="admin-search-input"
                style={{ width: 240 }}
              />
              <button
                className="btn-primary"
                onClick={openAddCategory}
                style={{ width: 'auto', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6, background: '#059669' }}
              >
                <i className="fa-solid fa-plus"></i> Add Vehicle Segment
              </button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Segment Name</th>
                <th>Description</th>
                <th>Popular Models</th>
                <th>Avg Budget</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(c => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22, width: 34, height: 34, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                        {c.icon || '🚙'}
                      </span>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: 14 }}>{c.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 280, color: '#cbd5e1', fontSize: 12 }}>
                    {c.description || 'No description provided.'}
                  </td>
                  <td>
                    <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600 }}>
                      {c.popular_models || 'All OEM models'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: 12 }}>
                      {c.avg_budget || '₹ 5 - 20 Lakh'}
                    </span>
                  </td>
                  <td>
                    {c.is_active !== 0 ? (
                      <span className="status-pill status-active">
                        <i className="fa-solid fa-circle-check" style={{ marginRight: 4 }}></i> Active
                      </span>
                    ) : (
                      <span className="status-pill status-rejected">
                        <i className="fa-solid fa-circle-xmark" style={{ marginRight: 4 }}></i> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className={`admin-action-pill-btn ${c.is_active !== 0 ? 'danger' : 'success'}`}
                        onClick={() => onToggleCategoryStatus && onToggleCategoryStatus(c.id)}
                        title={c.is_active !== 0 ? 'Deactivate Category' : 'Activate Category'}
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className={`fa-solid ${c.is_active !== 0 ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                        {' '}
                        {c.is_active !== 0 ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="admin-action-pill-btn secondary"
                        onClick={() => openEditCategory(c)}
                        title="Edit Category"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button
                        className="admin-action-pill-btn danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete category "${c.name}"?`)) {
                            onDeleteCategory(c.id);
                          }
                        }}
                        title="Delete Category"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                    No vehicle categories found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MENU 3: LOCATIONS & MARKETPLACE TERRITORIES                */}
      {/* ============================================================== */}
      {currentSubTab === 'locations' && (
        <div className="admin-card-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b' }}></i>
                Marketplace Territories & Cities ({filteredCities.length})
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                Control authorized operational cities, regional dealer hubs, and user location filters.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search cities or states..."
                className="admin-search-input"
                style={{ width: 240 }}
              />
              <button
                className="btn-primary"
                onClick={openAddCity}
                style={{ width: 'auto', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6, background: '#d97706' }}
              >
                <i className="fa-solid fa-plus"></i> Add Supported City
              </button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>City Name</th>
                <th>State / Territory</th>
                <th>Hub Status</th>
                <th>Coverage Status</th>
                <th style={{ textAlign: 'right', width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCities.map(c => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 32, height: 32, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 14 }}>
                        📍
                      </span>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: 14 }}>{c.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>{c.state}</span>
                  </td>
                  <td>
                    {c.is_popular ? (
                      <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        🔥 Major Hub (Tier-1)
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', padding: '3px 8px', borderRadius: 6, fontSize: 11 }}>
                        Regional City
                      </span>
                    )}
                  </td>
                  <td>
                    {c.is_active !== 0 ? (
                      <span className="status-pill status-active">
                        <i className="fa-solid fa-circle-check" style={{ marginRight: 4 }}></i> Live Territory
                      </span>
                    ) : (
                      <span className="status-pill status-rejected">
                        <i className="fa-solid fa-circle-xmark" style={{ marginRight: 4 }}></i> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className={`admin-action-pill-btn ${c.is_active !== 0 ? 'danger' : 'success'}`}
                        onClick={() => onToggleCityStatus && onToggleCityStatus(c.id)}
                        title={c.is_active !== 0 ? 'Deactivate Territory' : 'Activate Territory'}
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className={`fa-solid ${c.is_active !== 0 ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                        {' '}
                        {c.is_active !== 0 ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="admin-action-pill-btn secondary"
                        onClick={() => openEditCity(c)}
                        title="Edit City"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button
                        className="admin-action-pill-btn danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete territory "${c.name}"?`)) {
                            onDeleteCity(c.id);
                          }
                        }}
                        title="Delete City"
                        style={{ padding: '6px 10px', fontSize: 11 }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCities.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                    No cities found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD / EDIT CAR BRAND                                 */}
      {/* ============================================================== */}
      {brandModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              color: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {brandModal.mode === 'add' ? '➕ Add New Car Brand' : '✏️ Edit Brand Details'}
              </h3>
              <button
                onClick={() => setBrandModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBrand}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    BRAND NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    placeholder="e.g. Maruti Suzuki, Hyundai, Tata, Kia"
                    className="admin-form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <AdminImagePicker
                  label="Brand Logo / Emblem"
                  compact={true}
                  value={brandForm.logoIcon}
                  onChange={(val) => setBrandForm({ ...brandForm, logoIcon: val })}
                />

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    COUNTRY OF ORIGIN
                  </label>
                  <input
                    type="text"
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    placeholder="e.g. India, Japan, Germany"
                    className="admin-form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      id="brand-popular"
                      checked={brandForm.isPopular}
                      onChange={(e) => setBrandForm({ ...brandForm, isPopular: e.target.checked })}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="brand-popular" style={{ fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}>
                      Mark as Popular Brand (Displays in top quick filters)
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      id="brand-active"
                      checked={brandForm.isActive !== false}
                      onChange={(e) => setBrandForm({ ...brandForm, isActive: e.target.checked })}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="brand-active" style={{ fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}>
                      Active Status (Available for seller listings & marketplace filters)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBrandModal(null)}
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: 'auto' }}
                  >
                    {brandModal.mode === 'add' ? 'Save Brand' : 'Update Brand'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ADD / EDIT VEHICLE CATEGORY                          */}
      {/* ============================================================== */}
      {catModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 520,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              color: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {catModal.mode === 'add' ? '➕ Add Vehicle Body Segment' : '✏️ Edit Vehicle Segment'}
              </h3>
              <button
                onClick={() => setCatModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                      ICON
                    </label>
                    <input
                      type="text"
                      value={catForm.icon}
                      onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                      placeholder="🚙"
                      className="admin-form-input"
                      style={{ width: '100%', textAlign: 'center', fontSize: 18 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                      SEGMENT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={catForm.name}
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      placeholder="e.g. SUV, Compact Sedan, Electric EV"
                      className="admin-form-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    SEGMENT DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    placeholder="Short description of this vehicle body category..."
                    className="admin-form-input"
                    style={{ width: '100%', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                      POPULAR MODELS
                    </label>
                    <input
                      type="text"
                      value={catForm.popularModels}
                      onChange={(e) => setCatForm({ ...catForm, popularModels: e.target.value })}
                      placeholder="e.g. Creta, Thar, Scorpio"
                      className="admin-form-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                      AVG BUDGET RANGE
                    </label>
                    <input
                      type="text"
                      value={catForm.avgBudget}
                      onChange={(e) => setCatForm({ ...catForm, avgBudget: e.target.value })}
                      placeholder="e.g. ₹ 9 - 25 Lakh"
                      className="admin-form-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="cat-active"
                    checked={catForm.isActive}
                    onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <label htmlFor="cat-active" style={{ fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}>
                    Active Status (Available on user search & seller forms)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCatModal(null)}
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: 'auto', background: '#059669' }}
                  >
                    {catModal.mode === 'add' ? 'Save Segment' : 'Update Segment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD / EDIT LOCATION                                  */}
      {/* ============================================================== */}
      {cityModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              color: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {cityModal.mode === 'add' ? '📍 Add Supported Territory' : '✏️ Edit Territory Details'}
              </h3>
              <button
                onClick={() => setCityModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCity}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    CITY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                    placeholder="e.g. Pune, Ahmedabad, Chandigarh"
                    className="admin-form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                    STATE / TERRITORY *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityForm.state}
                    onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                    placeholder="e.g. Maharashtra, Gujarat, Punjab"
                    className="admin-form-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      id="city-popular"
                      checked={cityForm.isPopular}
                      onChange={(e) => setCityForm({ ...cityForm, isPopular: e.target.checked })}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="city-popular" style={{ fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}>
                      Major Hub / Metro City (Prioritized in city dropdown selector)
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      id="city-active"
                      checked={cityForm.isActive !== false}
                      onChange={(e) => setCityForm({ ...cityForm, isActive: e.target.checked })}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="city-active" style={{ fontSize: 13, color: '#e2e8f0', cursor: 'pointer' }}>
                      Active Territory (Enabled for buyer searches & seller car postings)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCityModal(null)}
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: 'auto', background: '#d97706' }}
                  >
                    {cityModal.mode === 'add' ? 'Save Territory' : 'Update Territory'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   2. MARKETPLACE SECTIONS
   ========================================================================== */

// 7. Buy Requests
export function BuyRequestsSection({ buyRequests, onUpdateStatus }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-hand-holding-dollar" style={{ color: '#3b82f6' }}></i> Buy Requests & Verified Leads</h2>
          <div className="admin-section-subtitle">Customer vehicle procurement requests, targeted budget parameters, and dealer assignments.</div>
        </div>
        <span className="admin-badge-count-pill">{buyRequests.length} Active Leads</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Buyer Name</th>
            <th>Desired Car Segment</th>
            <th>Budget Range</th>
            <th>City</th>
            <th>Loan Needed</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyRequests.map(r => (
            <tr key={r.id}>
              <td><strong>{r.id}</strong></td>
              <td>
                <div>{r.buyer}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.phone}</div>
              </td>
              <td><strong>{r.targetCar}</strong></td>
              <td style={{ color: '#60a5fa', fontWeight: 700 }}>{r.budget}</td>
              <td>{r.city}</td>
              <td>{r.finance}</td>
              <td>
                <span className="status-pill status-active" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                  {r.status}
                </span>
              </td>
              <td>
                <select
                  value={r.status}
                  onChange={(e) => onUpdateStatus(r.id, e.target.value)}
                  className="admin-filter-select"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  <option value="New">New</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Test Drive Scheduled">Test Drive</option>
                  <option value="Matched">Matched</option>
                  <option value="Closed (Purchased)">Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 8. Sell Requests
export function SellRequestsSection({ sellRequests, onUpdateStatus }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-file-invoice-dollar" style={{ color: '#f59e0b' }}></i> Sell Requests & Instant Appraisals</h2>
          <div className="admin-section-subtitle">Doorstep inspection requests and instant vehicle buyback leads submitted by car owners.</div>
        </div>
        <span className="admin-badge-count-pill">{sellRequests.length} Submissions</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Seller</th>
            <th>Vehicle Offered</th>
            <th>Mileage</th>
            <th>Expected Price</th>
            <th>City</th>
            <th>Inspection</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sellRequests.map(s => (
            <tr key={s.id}>
              <td><strong>{s.id}</strong></td>
              <td>
                <div>{s.seller}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.phone}</div>
              </td>
              <td><strong>{s.car}</strong></td>
              <td>{s.km}</td>
              <td style={{ color: '#10b981', fontWeight: 700 }}>{s.expectedPrice}</td>
              <td>{s.city}</td>
              <td>{s.inspectionDate}</td>
              <td>
                <select
                  value={s.status}
                  onChange={(e) => onUpdateStatus(s.id, e.target.value)}
                  className="admin-filter-select"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  <option value="Pending Inspection">Pending</option>
                  <option value="Inspected (Quote ₹5.5L)">Inspected</option>
                  <option value="Purchased by Apex Motors">Purchased</option>
                  <option value="Declined">Declined</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 9. Orders & Bookings
export function OrdersBookingsSection({ orders, onUpdateStatus, onDownloadInvoice }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-receipt" style={{ color: '#10b981' }}></i> Orders & Vehicle Bookings</h2>
          <div className="admin-section-subtitle">Token deposits, vehicle booking escrow, purchase agreements, and invoice generation.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Vehicle Title</th>
            <th>Buyer Details</th>
            <th>Token Paid</th>
            <th>Full Price</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td><strong>{o.id}</strong></td>
              <td>{o.car}</td>
              <td>{o.buyer}</td>
              <td style={{ color: '#10b981', fontWeight: 800 }}>₹{Number(o.token).toLocaleString('en-IN')}</td>
              <td>₹{Number(o.total).toLocaleString('en-IN')}</td>
              <td><span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4 }}>{o.gateway}</span></td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                  className="admin-filter-select"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  <option value="Token Confirmed">Token Confirmed</option>
                  <option value="Inspection Done">Inspection Done</option>
                  <option value="Vehicle Delivered">Delivered</option>
                  <option value="Cancelled (Refunded)">Cancelled</option>
                </select>
              </td>
              <td>
                <button className="admin-action-pill-btn secondary" onClick={() => onDownloadInvoice(o.id)}>
                  <i className="fa-solid fa-download"></i> PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 10. Wishlist & Enquiries
export function WishlistEnquiriesSection({ wishlistEnquiries, onUpdateStatus }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i> Wishlist & Direct Car Enquiries</h2>
          <div className="admin-section-subtitle">High-intent buyer inquiries, negotiation requests, and vehicle interest logs.</div>
        </div>
      </div>

      <div className="admin-card-grid">
        {wishlistEnquiries.map(e => (
          <div key={e.id} className="admin-data-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: '#fff' }}>{e.car}</strong>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{e.date}</span>
            </div>
            <div style={{ margin: '8px 0', fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>
              "{e.message}"
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{e.user}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{e.phone}</div>
              </div>
              <button
                className="admin-action-pill-btn success"
                onClick={() => window.open(`https://wa.me/91${e.phone.replace(/[^0-9]/g, '').slice(-10)}?text=Hi%20${encodeURIComponent(e.user)},%20regarding%20your%20SellBuy%20inquiry%20for%20${encodeURIComponent(e.car)}`, '_blank')}
              >
                <i className="fa-brands fa-whatsapp"></i> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 11. Test Drive Bookings
export function TestDriveBookingsSection({ testDrives, onUpdateStatus }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-key" style={{ color: '#c084fc' }}></i> Test Drive Bookings</h2>
          <div className="admin-section-subtitle">Doorstep evaluation and showroom visit appointments schedule with assigned executives.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Vehicle Title</th>
            <th>Appointment Slot</th>
            <th>Location</th>
            <th>Executive</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {testDrives.map(td => (
            <tr key={td.id}>
              <td><strong>{td.id}</strong></td>
              <td>
                <div>{td.user}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{td.phone}</div>
              </td>
              <td><strong>{td.car}</strong></td>
              <td style={{ color: '#fbbf24', fontWeight: 700 }}>{td.slot}</td>
              <td>{td.location}</td>
              <td>{td.agent}</td>
              <td>
                <select
                  value={td.status}
                  onChange={(e) => onUpdateStatus(td.id, e.target.value)}
                  className="admin-filter-select"
                  style={{ padding: '4px 8px', fontSize: 11 }}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ==========================================================================
   3. WEBSITE MANAGEMENT SECTIONS
   ========================================================================== */

// 12. Website Pages
export function WebsitePagesSection({ websitePages }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-globe" style={{ color: '#38bdf8' }}></i> Website Pages & CMS</h2>
          <div className="admin-section-subtitle">Manage static content pages, legal disclaimers, and marketplace landing routes.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Page Name</th>
            <th>URL Route</th>
            <th>Meta Title</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {websitePages.map(p => (
            <tr key={p.id}>
              <td><strong>{p.name}</strong></td>
              <td><span style={{ color: '#60a5fa' }}>{p.slug}</span></td>
              <td>{p.title}</td>
              <td><span className="status-pill status-active">{p.status}</span></td>
              <td>{p.updated}</td>
              <td>
                <button className="admin-action-pill-btn secondary" onClick={() => alert(`Opening editor for ${p.name}...`)}>
                  Edit Page
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 13. Banners & Sliders
export function BannersSlidersSection({ banners, onToggleActive, onAddBanner }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [placement, setPlacement] = useState('Web Hero Carousel');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;
    onAddBanner({ title, subtitle, image, placement });
    setTitle('');
    setSubtitle('');
    setImage('');
    setShowModal(false);
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-images" style={{ color: '#ec4899' }}></i> Banners & Sliders</h2>
          <div className="admin-section-subtitle">Control homepage hero carousels, mobile app promotions, and festive discount strips.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
          <i className="fa-solid fa-plus"></i> Add New Banner
        </button>
      </div>

      <div className="admin-card-grid">
        {banners.map(b => (
          <div key={b.id} className="admin-data-card">
            <img src={b.image} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} alt="" />
            <h4 style={{ margin: '0 0 6px 0', color: '#fff' }}>{b.title}</h4>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>{b.subtitle}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 11, color: '#60a5fa' }}>{b.placement}</span>
              <button
                className={`admin-action-pill-btn ${b.active ? 'success' : 'secondary'}`}
                onClick={() => onToggleActive(b.id)}
              >
                {b.active ? 'Active Display' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card-container" onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0 }}>Add Promotional Banner</h3>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Banner Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Subtitle / Offer Tagline</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group" style={{ marginBottom: 14 }}>
                <AdminImagePicker
                  label="Banner Graphic"
                  hint="Upload widescreen image file or choose from stock gallery"
                  value={image}
                  onChange={setImage}
                  aspectRatio="21/9"
                />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Placement Location</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="admin-filter-select" style={{ width: '100%' }}>
                  <option value="Web Hero Carousel">Web Hero Carousel</option>
                  <option value="App Strip Banner">App Strip Banner</option>
                  <option value="Marketplace Mid Banner">Marketplace Mid Banner</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Banner</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// 14. Blog & Content
export function BlogContentSection({ blogPosts, onAddBlogPost }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Buying Guide');
  const [author, setAuthor] = useState('Admin Editor');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddBlogPost({ title, category, author, readTime, image: coverImage, status: 'Published' });
    setTitle('');
    setShowModal(false);
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-newspaper" style={{ color: '#fb923c' }}></i> Blog & Editorial Content</h2>
          <div className="admin-section-subtitle">Automotive articles, pre-owned vehicle inspection tips, and vehicle market analysis.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
          <i className="fa-solid fa-pen-nib"></i> Write Article
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Article Headline</th>
            <th>Category</th>
            <th>Author</th>
            <th>Read Time</th>
            <th>Views</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.map(b => (
            <tr key={b.id}>
              <td><strong>{b.title}</strong></td>
              <td><span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{b.category}</span></td>
              <td>{b.author}</td>
              <td>{b.readTime}</td>
              <td>{Number(b.views).toLocaleString('en-IN')}</td>
              <td><span className="status-pill status-active">{b.status}</span></td>
              <td>{b.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card-container" onClick={(e) => e.stopPropagation()} style={{ width: 500, maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0 }}>Create Automotive Article</h3>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Headline</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group" style={{ marginBottom: 14 }}>
                <AdminImagePicker
                  label="Article Featured Cover"
                  hint="Select article hero graphic or pick from stock gallery"
                  value={coverImage}
                  onChange={setCoverImage}
                  aspectRatio="16/9"
                />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-filter-select" style={{ width: '100%' }}>
                  <option value="Buying Guide">Buying Guide</option>
                  <option value="Market Trends">Market Trends</option>
                  <option value="Safety & Tips">Safety & Tips</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Author Name</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish Article</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// 15. Reviews & Ratings
export function ReviewsRatingsSection({ reviews, onApprove, onFlag, onDelete }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-star" style={{ color: '#facc15' }}></i> Reviews & Customer Ratings</h2>
          <div className="admin-section-subtitle">Moderate customer reviews submitted for individual sellers and certified dealerships.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Reviewer</th>
            <th>Reviewed Seller / Car</th>
            <th>Rating</th>
            <th>Review Comment</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td><strong>{r.reviewer}</strong></td>
              <td>{r.target}</td>
              <td style={{ color: '#fbbf24', fontWeight: 700 }}>{'★'.repeat(r.rating)} ({r.rating}/5)</td>
              <td style={{ maxWidth: 320 }}>"{r.comment}"</td>
              <td>{r.date}</td>
              <td>
                <span className={`status-pill ${r.status === 'Approved' ? 'status-active' : 'status-rejected'}`}>
                  {r.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {r.status !== 'Approved' && (
                    <button className="admin-action-pill-btn primary" onClick={() => onApprove(r.id)}>Approve</button>
                  )}
                  {r.status !== 'Flagged' && (
                    <button className="admin-action-pill-btn secondary" onClick={() => onFlag(r.id)}>Flag</button>
                  )}
                  <button className="admin-action-pill-btn danger" onClick={() => onDelete(r.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 16. Notifications Broadcast
export function NotificationsSection({ onSendBroadcast }) {
  const [title, setTitle] = useState('Festive Weekend Exchange Offer!');
  const [msg, setMsg] = useState('Flat ₹30,000 extra on car exchange in Jaipur, Delhi and Mumbai this Saturday.');
  const [audience, setAudience] = useState('All Registered Users');

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-bell" style={{ color: '#f43f5e' }}></i> Push Notifications & Broadcast</h2>
          <div className="admin-section-subtitle">Dispatch real-time notification alerts directly to the Mobile App and Website users.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        <div className="admin-card-container">
          <h3 style={{ marginTop: 0 }}>Compose New Push Broadcast</h3>
          <div className="input-group">
            <label className="input-label" style={{ color: '#fff' }}>Target Audience Segment</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="admin-filter-select" style={{ width: '100%' }}>
              <option value="All Registered Users">All Registered Users (1,420 users)</option>
              <option value="Verified Car Buyers">Active Car Buyers Only</option>
              <option value="Dealers & Showrooms">Certified Dealers Only</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label" style={{ color: '#fff' }}>Notification Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-form-input" style={{ width: '100%' }} />
          </div>
          <div className="input-group">
            <label className="input-label" style={{ color: '#fff' }}>Message Body</label>
            <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} className="admin-form-input" style={{ width: '100%' }} />
          </div>
          <button className="btn-primary" onClick={() => onSendBroadcast(title, msg)}>
            <i className="fa-solid fa-paper-plane"></i> Send Push Broadcast Now
          </button>
        </div>

        <div className="admin-card-container">
          <h3 style={{ marginTop: 0 }}>Recent Broadcast History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#1e293b', padding: 12, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#fff' }}>Price Drop Alert: Hyundai Creta</strong>
                <span style={{ fontSize: 11, color: '#10b981' }}>Delivered ✓</span>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Price dropped by ₹25,000 on 3 saved vehicles.</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Sent to 410 users • 08 Oct 2026</div>
            </div>
            <div style={{ background: '#1e293b', padding: 12, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#fff' }}>Free Doorstep Inspection Week</strong>
                <span style={{ fontSize: 11, color: '#10b981' }}>Delivered ✓</span>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Book evaluation without paying visit charges.</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>Sent to All users • 04 Oct 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. ADMINISTRATION SECTIONS
   ========================================================================== */

// 17. Admin Users & Roles
export function AdminUsersRolesSection({ adminUsers, onAddAdminUser }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Inventory & Catalog Manager');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAddAdminUser({ name, email, role });
    setName('');
    setEmail('');
    setShowModal(false);
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-user-shield" style={{ color: '#818cf8' }}></i> Admin Users & Staff Roles</h2>
          <div className="admin-section-subtitle">Sub-administrators, moderation team members, and role delegations.</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto' }}>
          <i className="fa-solid fa-plus"></i> Add Staff Member
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Email</th>
            <th>Assigned Role</th>
            <th>Last Active</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map(a => (
            <tr key={a.id}>
              <td><strong>{a.name}</strong></td>
              <td>{a.email}</td>
              <td><span style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{a.role}</span></td>
              <td>{a.lastActive}</td>
              <td><span className="status-pill status-active">{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card-container" onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0 }}>Register Staff Administrator</h3>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Corporate Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="admin-form-input" style={{ width: '100%' }} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: '#fff' }}>Assigned Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="admin-filter-select" style={{ width: '100%' }}>
                  <option value="Inventory & Catalog Manager">Inventory & Catalog Manager</option>
                  <option value="Customer Grievance & Support">Customer Grievance & Support</option>
                  <option value="Finance & Settlement Auditor">Finance & Settlement Auditor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Staff Member</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// 18. Permissions & Security
export function PermissionsSecuritySection({ permissions, onTogglePermission }) {
  const roles = Object.keys(permissions);

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-lock" style={{ color: '#ef4444' }}></i> Permissions & Security Matrix</h2>
          <div className="admin-section-subtitle">Role-Based Access Control (RBAC) permission toggles and authentication parameters.</div>
        </div>
      </div>

      <div className="admin-card-container">
        <h3 style={{ marginTop: 0 }}>RBAC Permission Matrix</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Approve Listings</th>
              <th>Delete Inventory</th>
              <th>Block Users</th>
              <th>Financial Access</th>
              <th>Push Broadcast</th>
              <th>Manage Staff</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r}>
                <td><strong>{r}</strong></td>
                <td>
                  <input type="checkbox" checked={permissions[r].approveListings} onChange={() => onTogglePermission(r, 'approveListings')} />
                </td>
                <td>
                  <input type="checkbox" checked={permissions[r].deleteInventory} onChange={() => onTogglePermission(r, 'deleteInventory')} />
                </td>
                <td>
                  <input type="checkbox" checked={permissions[r].banUsers} onChange={() => onTogglePermission(r, 'banUsers')} />
                </td>
                <td>
                  <input type="checkbox" checked={permissions[r].financeAccess} onChange={() => onTogglePermission(r, 'financeAccess')} />
                </td>
                <td>
                  <input type="checkbox" checked={permissions[r].sendBroadcasts} onChange={() => onTogglePermission(r, 'sendBroadcasts')} />
                </td>
                <td>
                  <input type="checkbox" checked={permissions[r].manageAdmins} onChange={() => onTogglePermission(r, 'manageAdmins')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card-grid">
        <div className="admin-data-card">
          <h4 style={{ margin: '0 0 6px 0', color: '#fff' }}>🔒 2-Factor Authentication (2FA)</h4>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Enforce mandatory OTP verification on administrative back-office logins.</p>
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: 12 }}>Status: Enforced for All Super Admins</span>
        </div>
        <div className="admin-data-card">
          <h4 style={{ margin: '0 0 6px 0', color: '#fff' }}>⏱️ Session Auto-Timeout</h4>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Automatically lock session after inactivity to prevent unauthorized access.</p>
          <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: 12 }}>Timeout: 30 Minutes</span>
        </div>
      </div>
    </section>
  );
}

// 19. Reports & Analytics
export function ReportsAnalyticsSection({ reports }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-chart-line" style={{ color: '#10b981' }}></i> Reports & Business Analytics</h2>
          <div className="admin-section-subtitle">Gross Merchandise Value (GMV), sale turnaround velocity, and geographic distribution.</div>
        </div>
        <button className="btn-secondary" onClick={() => alert('Exporting full 2026 automotive marketplace report (CSV)...')} style={{ width: 'auto' }}>
          <i className="fa-solid fa-file-csv"></i> Export CSV
        </button>
      </div>

      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-label">Marketplace GMV</div>
          <div className="kpi-value" style={{ color: '#10b981' }}>₹ 8.45 Cr</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Cumulative Transaction Volume</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Days to Sell</div>
          <div className="kpi-value">16 Days</div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Fastest in Jaipur & Delhi</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed Bookings</div>
          <div className="kpi-value">74 Cars</div>
          <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>Verified Token Deliveries</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Lead Conversion Rate</div>
          <div className="kpi-value" style={{ color: '#fbbf24' }}>28.4%</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Inquiry to Purchase</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="admin-card-container">
          <h3 style={{ marginTop: 0 }}>Top Selling Brands by Volume</h3>
          {reports.brandVolume.map((bv, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <strong>{bv.brand}</strong>
              <span style={{ color: '#60a5fa', fontWeight: 800 }}>{bv.volume}</span>
            </div>
          ))}
        </div>

        <div className="admin-card-container">
          <h3 style={{ marginTop: 0 }}>Regional Market Share</h3>
          {reports.regionalShare.map((rs, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <strong>{rs.city}</strong>
              <span style={{ color: '#10b981', fontWeight: 800 }}>{rs.share}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 20. Payments & Transactions
export function PaymentsTransactionsSection({ transactions }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-credit-card" style={{ color: '#6366f1' }}></i> Payments & Financial Transactions</h2>
          <div className="admin-section-subtitle">Real-time gateway settlements, token advances, listing boost charges, and refunds.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>User / Dealership</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Gateway Mode</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td><strong>{tx.id}</strong></td>
              <td>{tx.user}</td>
              <td>{tx.type}</td>
              <td style={{ color: tx.amount < 0 ? '#f87171' : '#10b981', fontWeight: 800 }}>
                {tx.amount < 0 ? `-₹${Math.abs(tx.amount).toLocaleString('en-IN')}` : `+₹${tx.amount.toLocaleString('en-IN')}`}
              </td>
              <td><span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4 }}>{tx.gateway}</span></td>
              <td>{tx.date}</td>
              <td>
                <span className={`status-pill ${tx.status === 'Success' ? 'status-active' : 'status-rejected'}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 21. General Settings
export function GeneralSettingsSection({ settings, onSaveSettings }) {
  const [form, setForm] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
  };

  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-gear" style={{ color: '#64748b' }}></i> General Platform Settings</h2>
          <div className="admin-section-subtitle">Configure marketplace brand name, helpline contacts, listing validity, and fee rules.</div>
        </div>
      </div>

      <div className="admin-card-container" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <AdminImagePicker
                label="Marketplace Brand Logo"
                compact={true}
                value={form.logo || '/assets/logo.jpg'}
                onChange={(val) => setForm({ ...form, logo: val })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Platform Title</label>
              <input
                type="text"
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Support Helpline</label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Free Listings per User</label>
              <input
                type="number"
                value={form.freeListingsLimit}
                onChange={(e) => setForm({ ...form, freeListingsLimit: Number(e.target.value) })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Listing Validity (Days)</label>
              <input
                type="number"
                value={form.listingValidityDays}
                onChange={(e) => setForm({ ...form, listingValidityDays: Number(e.target.value) })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Dealer Commission (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: parseFloat(e.target.value) })}
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}>
              <i className="fa-solid fa-floppy-disk"></i> Save Platform Settings
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// 22. Support & Complaints
export function SupportComplaintsSection({ supportTickets, onResolveTicket }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-headset" style={{ color: '#06b6d4' }}></i> Support & Grievances Center</h2>
          <div className="admin-section-subtitle">Customer support tickets, dispute resolution, and buyer verification inquiries.</div>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Customer</th>
            <th>Subject Issue</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {supportTickets.map(t => (
            <tr key={t.id}>
              <td><strong>{t.id}</strong></td>
              <td>
                <div>{t.customer}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.phone}</div>
              </td>
              <td><strong>{t.subject}</strong></td>
              <td><span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{t.category}</span></td>
              <td>
                <span style={{ color: t.priority === 'Urgent' ? '#f87171' : t.priority === 'High' ? '#fbbf24' : '#94a3b8', fontWeight: 800 }}>
                  {t.priority}
                </span>
              </td>
              <td>
                <span className={`status-pill ${t.status === 'Resolved' ? 'status-active' : 'status-pending'}`}>
                  {t.status}
                </span>
              </td>
              <td>{t.date}</td>
              <td>
                {t.status !== 'Resolved' ? (
                  <button className="admin-action-pill-btn success" onClick={() => onResolveTicket(t.id)}>
                    Mark Resolved
                  </button>
                ) : (
                  <span style={{ color: '#10b981', fontSize: 11 }}>Resolved ✓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// 23. Real-Time Audit Logs
export function AuditLogsSection({ logs, logFilter, setLogFilter, onRefresh }) {
  return (
    <section>
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2><i className="fa-solid fa-terminal" style={{ color: '#22c55e' }}></i> Real-Time System & Audit Logs</h2>
          <div className="admin-section-subtitle">Streamed database transactions, authentication checks, and administrative action logs.</div>
        </div>
      </div>

      <div className="logs-terminal-view" style={{ height: 600, maxWidth: '100%' }}>
        <div className="logs-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--accent-green)', borderRadius: '50%' }}></span>
            <strong style={{ color: '#ffffff', fontSize: 13 }}>MySQL Audit Stream</strong>
          </div>
          <div className="log-filters-row">
            {['ALL', 'AUTH', 'CAR', 'ADMIN', 'HTTP'].map(lvl => (
              <button
                key={lvl}
                className={`log-filter-btn ${logFilter === lvl ? 'active' : ''}`}
                onClick={() => setLogFilter(lvl)}
              >
                {lvl}
              </button>
            ))}
            <button className="log-filter-btn" onClick={onRefresh}><i className="fa-solid fa-rotate-right"></i></button>
          </div>
        </div>
        <div className="logs-terminal-body">
          {logs.map((log, idx) => {
            const time = log.timestamp ? log.timestamp.split('T')[1].slice(0, 8) : (log.created_at ? new Date(log.created_at).toLocaleTimeString() : '12:00:00');
            const lvl = log.level || 'INFO';
            return (
              <div key={idx} className="log-entry-row">
                <span className="log-time">[{time}]</span>
                <span className={`log-tag ${lvl}`}>[{lvl}]</span>
                <span style={{ color: '#94a3b8' }}>[{log.module || 'SYS'}:{log.action || 'OP'}]</span>
                <span className="log-msg">{log.details || ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
