import React, { useState, useRef, useEffect } from 'react';
import { CarModel } from '../models/CarModel';

export function SellCarWizardModal({
  isOpen,
  onClose,
  brands = [],
  cities = [],
  step = 1,
  setStep,
  onSubmit,
  onUploadImage
}) {
  const fileInputRef = useRef(null);

  // Manual car data state
  const [photos, setPhotos] = useState([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [price, setPrice] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [ownership, setOwnership] = useState('1st Owner');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic cities added by Admin in database
  const [adminCities, setAdminCities] = useState(cities || []);

  useEffect(() => {
    if (Array.isArray(cities) && cities.length > 0) {
      setAdminCities(cities);
    } else {
      // Fetch active cities created by Admin
      fetch('/api/meta/cities')
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.cities)) {
            setAdminCities(data.cities);
          }
        })
        .catch(() => {});
    }
  }, [cities, isOpen]);

  if (!isOpen) return null;

  // Manual file upload from user's device
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingPhotos(true);
    setErrorMsg('');

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 15 * 1024 * 1024) {
          setErrorMsg('Each image must be under 15MB');
          continue;
        }

        if (onUploadImage) {
          const res = await onUploadImage(file);
          if (res && res.success && res.url) {
            setPhotos(prev => [...prev, res.url]);
          } else {
            const preview = URL.createObjectURL(file);
            setPhotos(prev => [...prev, preview]);
          }
        } else {
          const formData = new FormData();
          formData.append('image', file);
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await uploadRes.json();
          if (data && data.success && data.url) {
            setPhotos(prev => [...prev, data.url]);
          } else {
            const preview = URL.createObjectURL(file);
            setPhotos(prev => [...prev, preview]);
          }
        }
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      setErrorMsg('Failed to upload image. You can also paste image URLs directly.');
    } finally {
      setUploadingPhotos(false);
      if (e.target) e.target.value = '';
    }
  };

  // Add manual photo URL
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setPhotos(prev => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const effectiveBrand = brand === 'Other' ? customBrand.trim() : brand;

  const handleNextFromInfo = (e) => {
    e.preventDefault();
    if (!effectiveBrand) {
      alert('Please select or enter the vehicle brand');
      return;
    }
    if (!model.trim()) {
      alert('Please enter car model name & variant');
      return;
    }
    if (!year) {
      alert('Please select manufacturing year');
      return;
    }
    setStep(4);
  };

  const handleNextFromDetails = (e) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      alert('Please enter a valid asking price');
      return;
    }
    if (kmDriven === '' || Number(kmDriven) < 0) {
      alert('Please enter total kilometers driven');
      return;
    }
    if (!city.trim()) {
      alert('Please enter vehicle registration city / location');
      return;
    }
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    if (photos.length === 0) {
      alert('Please upload at least one real photo of your car');
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title: `${effectiveBrand} ${model.trim()} ${year}`,
        brand: effectiveBrand,
        model: model.trim(),
        year: Number(year),
        price: Number(price),
        kmDriven: Number(kmDriven),
        fuelType,
        transmission,
        ownership,
        city: city.trim(),
        description: description.trim() || `Well maintained ${effectiveBrand} ${model.trim()} ${year}. Single owner, excellent condition.`,
        images: photos
      });
    } finally {
      setSubmitting(false);
    }
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
                {step === 2 && 'Upload Vehicle Photos'}
                {step === 3 && 'Vehicle Basic Information'}
                {step === 4 && 'Pricing & Registration Details'}
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
                Post Your Car for Sale Manually
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', maxWidth: 440, margin: '0 auto 20px auto' }}>
                Enter your exact vehicle specifications, upload real photos from your device, and reach thousands of verified direct buyers in your city.
              </p>

              <div className="sell-benefit-cards-row">
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-bolt" style={{ color: '#2563eb' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>Fast Direct Sale</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Direct calls & buyer chats</div>
                </div>
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#16a34a' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>0% Commission</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Keep 100% money</div>
                </div>
                <div className="sell-benefit-card">
                  <i className="fa-solid fa-shield-halved" style={{ color: '#f59e0b' }}></i>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 4 }}>Verified Buyers</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>OTP verified users only</div>
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 24, padding: '14px 20px' }} onClick={() => setStep(2)}>
              <span>Enter Vehicle Details Manually →</span>
            </button>
          </div>
        )}

        {/* STEP 2: ADD REAL PHOTOS (MANUAL UPLOAD) */}
        {step === 2 && (
          <div className="wizard-body-step">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                Upload clear photos of front, rear, sides, and interior. Minimum 1 photo required.
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                {photos.length} Photo{photos.length !== 1 ? 's' : ''} Added
              </span>
            </div>

            {errorMsg && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }}></i>
                {errorMsg}
              </div>
            )}

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {/* Interactive Manual Drag & Drop / Upload Trigger Box */}
            <div
              className="wizard-upload-box"
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--primary)',
                borderRadius: 14,
                padding: '24px 16px',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                marginBottom: 16,
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: 'var(--primary)', marginBottom: 8 }}></i>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                {uploadingPhotos ? 'Uploading photos to server...' : 'Choose Car Photos from Device / Gallery'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                Click to browse files (JPG, PNG, WebP up to 15MB each). Multiple selection supported.
              </div>
            </div>

            {/* Photo Preview Grid */}
            <div className="wizard-photos-grid">
              {photos.map((p, idx) => (
                <div key={idx} className="wizard-photo-slot">
                  <img src={p} alt="" className="wizard-photo-thumb" />
                  {idx === 0 && <span className="wizard-cover-tag">Cover</span>}
                  <button className="wizard-photo-del-btn" onClick={() => handleRemovePhoto(idx)} title="Remove photo">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              {/* Add Photo Slot Button */}
              <button
                className="wizard-photo-add-slot"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhotos}
                type="button"
                title="Upload more photos"
              >
                <i className="fa-solid fa-camera"></i>
                <span>{uploadingPhotos ? 'Uploading...' : '+ Add Photo'}</span>
              </button>
            </div>

            {/* URL input fallback */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <input
                type="url"
                placeholder="Or paste direct image URL here..."
                className="text-input boxed-input"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
              />
              <button className="btn-secondary" onClick={handleAddPhotoUrl} type="button">
                + Add URL
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
                    alert('Please upload at least 1 real photo of your vehicle to proceed');
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
              <label className="input-label">Select Brand / Make *</label>
              <select
                className="text-input boxed-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              >
                <option value="">-- Choose Car Brand / Manufacturer --</option>
                {brands.map(b => (
                  <option key={b.id || b.name} value={b.name}>{b.name}</option>
                ))}
                <option value="Other">Other / Custom Brand</option>
              </select>
            </div>

            {brand === 'Other' && (
              <div className="input-group">
                <label className="input-label">Type Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Skoda, Jeep, Isuzu, Volvo..."
                  className="text-input boxed-input"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Model Name & Variant *</label>
              <input
                type="text"
                placeholder="e.g. Creta SX 1.5, Swift VDI, Thar 4x4 Hard Top..."
                className="text-input boxed-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Manufacturing / Registration Year *</label>
              <select
                className="text-input boxed-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">-- Select Year --</option>
                {Array.from({ length: 22 }, (_, i) => 2026 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Fuel Type</label>
              <div className="filter-chips-wrap">
                {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
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
                <label className="input-label">Asking Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 850000"
                  className="text-input boxed-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                {price && Number(price) > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginTop: 4 }}>
                    {CarModel.formatPrice(price)}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Total KM Driven *</label>
                <input
                  type="number"
                  placeholder="e.g. 32000"
                  className="text-input boxed-input"
                  value={kmDriven}
                  onChange={(e) => setKmDriven(e.target.value)}
                  required
                />
                {kmDriven && Number(kmDriven) >= 0 && (
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                    {CarModel.formatKm(kmDriven)}
                  </div>
                )}
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
                <label className="input-label">Car Location / City * (Admin Approved)</label>
                <select
                  className="text-input boxed-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="">-- Choose Registered City --</option>
                  {adminCities.map(c => {
                    const cityName = typeof c === 'string' ? c : c.name;
                    const stateName = typeof c === 'object' && c.state ? c.state : '';
                    const fullVal = stateName ? `${cityName}, ${stateName}` : cityName;
                    return (
                      <option key={c.id || cityName} value={fullVal}>
                        {cityName} {stateName ? `(${stateName})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Quick city suggestions directly from Admin database */}
            {adminCities.length > 0 && (
              <div style={{ marginTop: -4, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                  Available Cities in Network:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {adminCities.map(c => {
                    const cityName = typeof c === 'string' ? c : c.name;
                    const stateName = typeof c === 'object' && c.state ? c.state : '';
                    const fullVal = stateName ? `${cityName}, ${stateName}` : cityName;
                    const isSelected = city === fullVal || city === cityName || (city && city.split(',')[0].trim() === cityName);
                    return (
                      <button
                        key={c.id || cityName}
                        type="button"
                        onClick={() => setCity(fullVal)}
                        style={{
                          fontSize: 11,
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: isSelected ? '1px solid var(--primary)' : '1px solid #cbd5e1',
                          background: isSelected ? 'var(--primary)' : '#f8fafc',
                          color: isSelected ? '#fff' : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        📍 {cityName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Vehicle Description (Optional)</label>
              <textarea
                placeholder="Mention features, insurance validity, service history, tyre condition, alloy wheels, accessories, etc."
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
                src={photos[0] || '/assets/cars/creta.jpg'}
                alt=""
                className="wizard-preview-img"
              />
              <div style={{ padding: 16 }}>
                <span className="car-brand-tag">{effectiveBrand}</span>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 6px 0' }}>
                  {effectiveBrand} {model} {year}
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
                {description && (
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 10, lineHeight: 1.4 }}>
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="wizard-nav-buttons-row">
              <button className="btn-secondary" onClick={() => setStep(4)} disabled={submitting}>
                ← Edit Details
              </button>
              <button className="btn-primary" onClick={handleFinalSubmit} disabled={submitting}>
                {submitting ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Publishing to Database...</span>
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
