import React, { useState, useEffect } from 'react';

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
  onSaveProfile
}) {
  const [phone, setPhone] = useState(propPhone || '9876543210');
  const [otp, setOtp] = useState('123456');
  const [timer, setTimer] = useState(60);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propPhone) setPhone(propPhone);
  }, [propPhone]);

  useEffect(() => {
    if (step === 'login' && phone === '9876543210') {
      setName('Rakesh Sharma');
      setEmail('rakesh.sharma@example.com');
    }
  }, [step, phone]);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    await onRequestOtp(phone);
    setTimer(60);
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    await onVerifyOtp(otp);
    setLoading(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSaveProfile({
      name,
      email,
      phone,
      avatar: selectedAvatar,
      isVerified: true
    });
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* STEP 1: LOGIN WITH PHONE */}
        {step === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="auth-demo-hint">
                <i className="fa-solid fa-circle-info"></i>
                <span>Use demo number or your real phone number. Demo OTP is <strong>123456</strong>.</span>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Continue with OTP →</span>}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <div>
            <button className="auth-back-btn" onClick={() => setStep('login')}>
              <i className="fa-solid fa-arrow-left"></i> Back
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
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

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Verify & Sign In ✓</span>}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: COMPLETE PROFILE */}
        {step === 'profile' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 className="auth-title">Complete Your Profile</h2>
              <p className="auth-subtitle">Add your name and avatar to start buying and selling</p>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="input-group" style={{ textAlign: 'center' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: 8 }}>Choose Avatar</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt=""
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rakesh Sharma"
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
                  placeholder="name@example.com"
                  required
                />
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>Save & Continue 🎉</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
