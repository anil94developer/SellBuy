import React, { useState, useEffect, useRef } from 'react';

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
];

export function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  savedCount = 0,
  listingsCount = 0,
  chatsCount = 0,
  selectedCity,
  onOpenCityModal,
  onOpenMyListings,
  onOpenSavedCars,
  onOpenChat,
  onOpenNotifications,
  onOpenSellWizard,
  onSaveProfile,
  onUploadAvatar,
  onLogout,
  toggleLang,
  lang
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATARS[0]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || AVATARS[0]);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10MB');
      return;
    }

    setUploadingAvatar(true);
    setUploadError('');

    try {
      const preview = URL.createObjectURL(file);
      setAvatar(preview);

      const uploadFn = onUploadAvatar;
      if (!uploadFn) throw new Error('Upload handler not available');
      const res = await uploadFn(file);

      if (res && res.success && res.url) {
        setAvatar(res.url);
      } else {
        setUploadError(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setUploadError('Failed to upload image');
    } finally {
      setUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      id: currentUser?.id,
      phone: currentUser?.phone,
      name: name.trim(),
      email: email.trim(),
      avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-compact-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            <i className="fa-solid fa-user-circle" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
            Account Profile & Settings
          </h2>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* User Snapshot Header with Dual Role Badge */}
        <div className="profile-hero-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={currentUser?.avatar || '/assets/logo.jpg'} alt="" className="profile-hero-avatar" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {currentUser?.name || 'Verified User'}
                </h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0284c7, #16a34a)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <i className="fa-solid fa-arrows-rotate"></i> Buyer & Seller
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                +91 {currentUser?.phone || '9876543210'}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {currentUser?.email || 'user@sellbuy.in'} • {currentUser?.city || selectedCity}
              </div>
            </div>

            <button
              className="profile-edit-trigger-btn"
              onClick={() => setIsEditing(!isEditing)}
              title="Edit Profile"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>

          {/* Dual Role Activity Counters */}
          <div className="profile-stats-row">
            <div className="profile-stat-item" onClick={() => { onClose(); onOpenMyListings(); }} style={{ cursor: 'pointer' }}>
              <div className="stat-number" style={{ color: '#16a34a' }}>{listingsCount}</div>
              <div className="stat-label">Selling: Cars</div>
            </div>
            <div className="profile-stat-item" onClick={() => { onClose(); onOpenSavedCars(); }} style={{ cursor: 'pointer' }}>
              <div className="stat-number" style={{ color: '#ef4444' }}>{savedCount}</div>
              <div className="stat-label">Buying: Saved</div>
            </div>
            <div className="profile-stat-item" onClick={() => { onClose(); onOpenChat(); }} style={{ cursor: 'pointer' }}>
              <div className="stat-number" style={{ color: '#0284c7' }}>{chatsCount}</div>
              <div className="stat-label">Chats & Leads</div>
            </div>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '16px 0 12px 0' }}>
          <button
            onClick={() => { onClose(); onOpenMyListings(); }}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #86efac',
              background: '#f0fdf4',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#166534' }}>
              <i className="fa-solid fa-car"></i> Seller Mode
            </div>
            <div style={{ fontSize: 11, color: '#15803d', marginTop: 3 }}>
              {listingsCount} Listed Cars • Post & Sell
            </div>
          </button>

          <button
            onClick={() => { onClose(); onOpenSavedCars(); }}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1.5px solid #93c5fd',
              background: '#eff6ff',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#1e40af' }}>
              <i className="fa-solid fa-cart-shopping"></i> Buyer Mode
            </div>
            <div style={{ fontSize: 11, color: '#1d4ed8', marginTop: 3 }}>
              {savedCount} Wishlist • Test Drives
            </div>
          </button>
        </div>

        {/* Edit Profile Sub-form */}
        {isEditing && (
          <form onSubmit={handleEditSubmit} className="profile-edit-subform">
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Update Information</h4>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarUpload}
            />

            {uploadError && <div className="auth-error-msg" style={{ marginBottom: 10 }}>{uploadError}</div>}

            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                className="avatar-upload-preview-wrapper"
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                title="Click to upload new photo"
                style={{ width: 80, height: 80, marginBottom: 8 }}
              >
                <img
                  src={avatar || AVATARS[0]}
                  alt="Avatar preview"
                  className="avatar-upload-preview-img"
                  style={{ width: 80, height: 80 }}
                />
                {uploadingAvatar ? (
                  <div className="avatar-upload-spinner-overlay">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  </div>
                ) : (
                  <div className="avatar-upload-badge" title="Change photo">
                    <i className="fa-solid fa-camera"></i>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-upload-avatar-trigger"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                style={{ fontSize: 12, padding: '6px 14px', marginBottom: 10 }}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload Custom Photo'}</span>
              </button>

              <span style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Or select from presets:</span>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {AVATARS.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt=""
                    className={`avatar-pick-thumb ${avatar === av ? 'active' : ''}`}
                    onClick={() => setAvatar(av)}
                  />
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="text-input boxed-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="text-input boxed-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                Save Profile ✓
              </button>
            </div>
          </form>
        )}

        {/* Action Shortcuts */}
        <div className="profile-shortcuts-list">
          {/* Seller Section */}
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#15803d', margin: '8px 4px 4px 4px' }}>
            <i className="fa-solid fa-tag"></i> Seller Activities (विक्रेता)
          </div>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenMyListings(); }}>
            <div className="shortcut-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <i className="fa-solid fa-car"></i>
            </div>
            <div className="shortcut-label">My Listed Vehicles ({listingsCount})</div>
            <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: 11 }}></i>
          </button>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenSellWizard && onOpenSellWizard(); }}>
            <div className="shortcut-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <i className="fa-solid fa-plus"></i>
            </div>
            <div className="shortcut-label">Post Another Vehicle for Sale (+ Sell Car)</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>Sell Now</span>
          </button>

          {/* Buyer Section */}
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#1d4ed8', margin: '14px 4px 4px 4px' }}>
            <i className="fa-solid fa-cart-shopping"></i> Buyer Activities (खरीददार)
          </div>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenSavedCars(); }}>
            <div className="shortcut-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <i className="fa-solid fa-heart"></i>
            </div>
            <div className="shortcut-label">Saved Cars / Wishlist ({savedCount})</div>
            <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: 11 }}></i>
          </button>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenChat(); }}>
            <div className="shortcut-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="shortcut-label">Chats & Leads ({chatsCount})</div>
            <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: 11 }}></i>
          </button>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenNotifications(); }}>
            <div className="shortcut-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="shortcut-label">Notifications Center</div>
            <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: 11 }}></i>
          </button>

          {/* Preferences */}
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b', margin: '14px 4px 4px 4px' }}>
            <i className="fa-solid fa-gear"></i> Preferences
          </div>

          <button className="profile-shortcut-item" onClick={() => { onClose(); onOpenCityModal(); }}>
            <div className="shortcut-icon" style={{ background: '#f8fafc', color: '#475569' }}>
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="shortcut-label">Default City: {selectedCity}</div>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>Change</span>
          </button>

          <button className="profile-shortcut-item" onClick={toggleLang}>
            <div className="shortcut-icon" style={{ background: '#f8fafc', color: '#475569' }}>
              <i className="fa-solid fa-globe"></i>
            </div>
            <div className="shortcut-label">Language / भाषा</div>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-logout-full" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
