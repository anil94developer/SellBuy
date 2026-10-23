import React, { useState } from 'react';
import { CarModel } from '../models/CarModel';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
];

export function SellCarWizardModal({
  isOpen,
  onClose,
  brands = [],
  step = 1,
  setStep,
  onSubmit
}) {
  // Wizard state
  const [photos, setPhotos] = useState([SAMPLE_PHOTO_PRESETS[0], SAMPLE_PHOTO_PRESETS[1]]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [brand, setBrand] = useState('Hyundai');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [price, setPrice] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [ownership, setOwnership] = useState('1st Owner');
  const [city, setCity] = useState('Jaipur, Rajasthan');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddPhoto = () => {
    if (photoUrlInput.trim()) {
      setPhotos(prev => [...prev, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    } else {
      // Pick random sample photo
      const nextPreset = SAMPLE_PHOTO_PRESETS[photos.length % SAMPLE_PHOTO_PRESETS.length];
      setPhotos(prev => [...prev, nextPreset]);
    }
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNextFromInfo = (e) => {
    e.preventDefault();
    if (!model.trim()) {
      alert('Please enter car model name');
      return;
    }
    setStep(4);
  };

  const handleNextFromDetails = (e) => {
    e.preventDefault();
    if (!price || !kmDriven) {
      alert('Please enter expected price and kilometers driven');
      return;
    }
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    await onSubmit({
      title: `${brand} ${model} ${year}`,
      brand,
      model,
      year: Number(year),
      price: Number(price),
      kmDriven: Number(kmDriven),
      fuelType,
      transmission,
      ownership,
      city,
      description: description || `Well maintained ${brand} ${model} ${year}. Single owner, excellent condition.`,
      images: photos.length ? photos : [SAMPLE_PHOTO_PRESETS[0]]
    });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sell-wizard-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Wizard Header with Steps progress */}
        <div className="sell-wizard-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="wizard-step-label">Step {step} of 5</span>
              <h2 className="wizard-main-title">
                {step === 1 && 'Sell Your Car at Best Price'}
                {step === 2 && 'Add Vehicle Photos'}
                {step === 3 && 'Car Basic Information'}
                {step === 4 && 'Price & Vehicle Details'}
                {step === 5 && 'Preview & Post Your Listing'}
              </h2>
            </div>
            <button className="modal-close-x-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* 5-step progress bar */}
          <div className="wizard-progress-bar-wrap">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`wizard-progress-segment ${step >= s ? 'active' : ''}`}
                style={{ flex: 1 }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: START SELLING INTRO */}
        {step === 1 && (
          <div className="wizard-body-step">
            <div className="sell-start-hero-box">
              <div style={{ fontSize: 36, marginBottom: 10 }}>🚗💨</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                Sell in 3 Easy Steps on SellBuy
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', maxWidth: 440, margin: '0 auto 20px auto' }}>
                Connect with 50,000+ verified direct buyers in your city without middlemen commissions.
              </p>

              <div className="sell-benefit-cards-row">
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-bolt" style={{ color: '#2563eb' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>Fastest Sale</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Get calls within 24 hrs</div>
                </div>
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#16a34a' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>0% Commission</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Keep 100% money</div>
                </div>
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-shield-halved" style={{ color: '#f59e0b' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>Verified Buyers</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>OTP verified leads</div>
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 24, padding: '14px 20px' }} onClick={() => setStep(2)}>
              <span>Start Listing Now →</span>
            </button>
          </div>
        )}

        {/* STEP 2: ADD PHOTOS */}
        {step === 2 && (
          <div className="wizard-body-step">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                High-quality photos get <strong>5x more buyer responses</strong>. Minimum 1 photo required.
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                {photos.length} Photos Added
              </span>
            </div>

            {/* Photo Preview Grid */}
            <div className="wizard-photos-grid">
              {photos.map((p, idx) => (
                <div key={idx} className="wizard-photo-slot">
                  <img src={p} alt="" className="wizard-photo-thumb" />
                  {idx === 0 && <span className="wizard-cover-tag">Cover</span>}
                  <button className="wizard-photo-del-btn" onClick={() => handleRemovePhoto(idx)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              {/* Add Photo Slot Button */}
              <button className="wizard-photo-add-slot" onClick={handleAddPhoto}>
                <i className="fa-solid fa-camera"></i>
                <span>Add Photo</span>
              </button>
            </div>

            {/* URL input fallback */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <input
                type="url"
                placeholder="Or paste an image URL here..."
                className="text-input boxed-input"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
              />
              <button className="btn-secondary" onClick={handleAddPhoto} type="button">
                Add URL
              </button>
            </div>

            <div className="wizard-nav-buttons-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (photos.length === 0) {
                    alert('Please add at least one vehicle photo');
                    return;
                  }
                  setStep(3);
                }}
              >
                Next: Vehicle Info →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CAR BASIC INFORMATION */}
        {step === 3 && (
          <form className="wizard-body-step" onSubmit={handleNextFromInfo}>
            <div className="input-group">
              <label className="input-label">Select Brand / Make</label>
              <select
                className="text-input boxed-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              >
                {brands.map(b => (
                  <option key={b.id || b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Model Name & Variant</label>
              <input
                type="text"
                placeholder="e.g. Creta SX, Swift VDI, Nexon XZ+..."
                className="text-input boxed-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Manufacturing / Registration Year</label>
              <select
                className="text-input boxed-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {Array.from({ length: 15 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Fuel Type</label>
              <div className="filter-chips-wrap">
                {['Petrol', 'Diesel', 'CNG', 'Electric'].map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`filter-chip ${fuelType === f ? 'active' : ''}`}
                    onClick={() => setFuelType(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Transmission</label>
              <div className="filter-chips-wrap">
                {['Manual', 'Automatic'].map(tr => (
                  <button
                    key={tr}
                    type="button"
                    className={`filter-chip ${transmission === tr ? 'active' : ''}`}
                    onClick={() => setTransmission(tr)}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>

            <div className="wizard-nav-buttons-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Next: Pricing & City →
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: PRICING & MORE DETAILS */}
        {step === 4 && (
          <form className="wizard-body-step" onSubmit={handleNextFromDetails}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Expected Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 850000"
                  className="text-input boxed-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">KM Driven</label>
                <input
                  type="number"
                  placeholder="e.g. 32000"
                  className="text-input boxed-input"
                  value={kmDriven}
                  onChange={(e) => setKmDriven(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Ownership History</label>
                <select
                  className="text-input boxed-input"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                >
                  <option value="1st Owner">1st Owner</option>
                  <option value="2nd Owner">2nd Owner</option>
                  <option value="3rd Owner">3rd Owner</option>
                  <option value="4th Owner+">4th Owner+</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Car Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="text-input boxed-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description (Optional)</label>
              <textarea
                placeholder="Mention features, insurance validity, service history, tyre condition, etc."
                className="text-input boxed-input"
                style={{ height: 80, resize: 'none' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="wizard-nav-buttons-row">
              <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Preview Listing →
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: LIVE CARD PREVIEW & SUBMIT */}
        {step === 5 && (
          <div className="wizard-body-step">
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
                ✓ Everything looks ready
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                Here is how your car will appear to buyers:
              </h3>
            </div>

            {/* Live Preview Card */}
            <div className="wizard-preview-car-card">
              <img
                src={photos[0] || SAMPLE_PHOTO_PRESETS[0]}
                alt=""
                className="wizard-preview-img"
              />
              <div style={{ padding: 16 }}>
                <span className="car-brand-tag">{brand}</span>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 6px 0' }}>
                  {brand} {model} {year}
                </h4>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                  {CarModel.formatPrice(price || 0)}
                </div>
                <div className="car-specs-row">
                  <span className="spec-chip"><i className="fa-solid fa-location-dot"></i> {city}</span>
                  <span className="spec-chip"><i className="fa-solid fa-road"></i> {CarModel.formatKm(kmDriven || 0)}</span>
                  <span className="spec-chip"><i className="fa-solid fa-gas-pump"></i> {fuelType}</span>
                  <span className="spec-chip"><i className="fa-solid fa-gear"></i> {transmission}</span>
                  <span className="spec-chip"><i className="fa-solid fa-user"></i> {ownership}</span>
                </div>
              </div>
            </div>

            <div className="wizard-nav-buttons-row">
              <button className="btn-secondary" onClick={() => setStep(4)} disabled={submitting}>
                ← Edit Details
              </button>
              <button className="btn-primary" onClick={handleFinalSubmit} disabled={submitting}>
                {submitting ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Publishing...</span>
                ) : (
                  <span><i className="fa-solid fa-rocket"></i> Post Listing Live 🎉</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
