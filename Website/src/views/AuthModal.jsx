import React, { useState, useEffect, useRef } from 'react';

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
];

export function AuthModal({
  isOpen,
  onClose,
  step = 'login',
  setStep,
  phone: propPhone,
  onRequestOtp,
  onVerifyOtp,
  onSaveProfile,
  onUploadAvatar
}) {
  const [phone, setPhone] = useState(propPhone || '');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Keep phone in sync if passed
  useEffect(() => {
    if (propPhone) {
      setPhone(propPhone);
    }
  }, [propPhone]);

  // Reset errors when step changes
  useEffect(() => {
    setError('');
  }, [step, isOpen]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await onRequestOtp(cleanPhone);
      if (res && res.success === false) {
        setError(res.message || 'Failed to send OTP. Please try again.');
      } else {
        setTimer(60);
        setOtp('');
      }
    } catch (err) {
      setError(err.message || 'Error sending OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const res = await onVerifyOtp(cleanOtp, cleanPhone);
      if (res && res.success === false) {
        setError(res.message || 'Invalid OTP code. Please enter demo OTP 123456.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const res = await onSaveProfile({
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: cleanPhone,
        avatar: selectedAvatar,
        isVerified: true
      });
      if (res && res.success === false) {
        setError(res.message || 'Could not save profile');
      }
    } catch (err) {
      setError(err.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please select an image under 10MB.');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Immediate local preview for responsive UX
      const localPreview = URL.createObjectURL(file);
      setSelectedAvatar(localPreview);

      const uploadFn = onUploadAvatar;
      if (!uploadFn) throw new Error('Upload handler not available');
      const res = await uploadFn(file);

      if (res && res.success && res.url) {
        setSelectedAvatar(res.url);
      } else {
        setError(res?.message || 'Could not upload image to server');
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const fillDemoCredentials = () => {
    setPhone('9876543210');
    setOtp('123456');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x-btn" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* INLINE ERROR BANNER */}
        {error && (
          <div className="auth-error-banner">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: LOGIN WITH PHONE */}
        {step === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="auth-brand-badge">
                <i className="fa-solid fa-car-side"></i>
              </div>
              <h2 className="auth-title">Welcome to SellBuy</h2>
              <p className="auth-subtitle">Enter your mobile number to sign in or register instantly</p>
            </div>

            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <label className="input-label">Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">🇮🇳 +91</span>
                  <input
                    type="tel"
                    className="phone-input-field"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="auth-demo-hint">
                <i className="fa-solid fa-circle-info"></i>
                <span>Use any mobile number. Demo OTP is <strong>123456</strong>.</span>
              </div>

              <button
                type="button"
                className="auth-quick-fill-btn"
                onClick={fillDemoCredentials}
                title="Fill with test account"
              >
                ⚡ Test with Demo Account (9876543210)
              </button>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading} style={{ marginTop: 16 }}>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Continue with OTP →</span>}
              </button>
            </form>

          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <div>
            <button className="auth-back-btn" onClick={() => setStep('login')}>
              <i className="fa-solid fa-arrow-left"></i> Change Phone Number
            </button>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="auth-brand-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h2 className="auth-title">Verify 6-Digit OTP</h2>
              <p className="auth-subtitle">
                We sent a verification code to <strong>+91 {phone}</strong>
              </p>
            </div>

            <form onSubmit={handleVerify}>
              <div className="input-group">
                <label className="input-label">Enter 6-Digit Code</label>
                <input
                  type="text"
                  className="otp-input-field"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 20px 0', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>
                  {timer > 0 ? `Resend code in ${timer}s` : 'Did not receive code?'}
                </span>
                {timer === 0 && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { setTimer(60); onRequestOtp(phone); }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                className="auth-quick-fill-btn"
                onClick={() => setOtp('123456')}
                style={{ marginBottom: 14 }}
              >
                ⚡ Fill Demo OTP (123456)
              </button>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Verify & Sign In ✓</span>}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: COMPLETE PROFILE FOR NEW USER */}
        {step === 'profile' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div className="auth-brand-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h2 className="auth-title">Complete Your Profile</h2>
              <p className="auth-subtitle">Add your name and avatar to start buying and selling verified cars</p>
            </div>

            {error && <div className="auth-error-msg" style={{ marginBottom: 14 }}>{error}</div>}

            <form onSubmit={handleProfileSubmit}>
              {/* Hidden file input for avatar upload */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarFileChange}
              />

              <div className="auth-avatar-section">
                <div
                  className="avatar-upload-preview-wrapper"
                  onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                  title="Click to upload custom photo"
                >
                  <img
                    src={selectedAvatar || AVATARS[0]}
                    alt="Selected Avatar"
                    className="avatar-upload-preview-img"
                  />
                  {uploadingAvatar ? (
                    <div className="avatar-upload-spinner-overlay">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    </div>
                  ) : (
                    <div className="avatar-upload-badge" title="Upload custom photo">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-upload-avatar-trigger"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>{uploadingAvatar ? 'Uploading Image...' : 'Upload Profile Photo'}</span>
                </button>

                <div className="avatar-presets-divider">
                  <span>Or choose from presets</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt={`Preset avatar ${idx + 1}`}
                      className={`avatar-pick-thumb ${selectedAvatar === av ? 'active' : ''}`}
                      onClick={() => setSelectedAvatar(av)}
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Rahul Verma"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="text-input boxed-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={loading || uploadingAvatar}
                style={{ marginTop: 12 }}
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Save & Continue 🎉</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
