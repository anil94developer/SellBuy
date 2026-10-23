import React, { useState } from 'react';

export function QuickSellModal({ brands, isOpen, onClose, onSubmit, t }) {
  const [brandId, setBrandId] = useState('1');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2021');
  const [price, setPrice] = useState('');
  const [km, setKm] = useState('');
  const [city, setCity] = useState('Jaipur, Rajasthan');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!model || !price || !km) {
      alert('Please fill in required fields');
      return;
    }
    const success = await onSubmit({
      brandId,
      modelName: model,
      manufacturingYear: year,
      price,
      kmDriven: km,
      regCity: city,
      fuelType: 'Petrol',
      transmission: 'Manual'
    });
    if (success) {
      alert('Your vehicle listing has been submitted successfully!');
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#ffffff', maxWidth: 500, width: '100%', borderRadius: 20, padding: 28, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px 0' }}>{t('sellCar')}</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>Get maximum value for your car from verified direct buyers.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="text-input boxed-input"
            >
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Creta SX, Swift VXI..."
              className="text-input boxed-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="input-group">
              <label className="input-label">Manufacturing Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="text-input boxed-input"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">KM Driven</label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="e.g. 35000"
                className="text-input boxed-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Expected Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 850000"
              className="text-input boxed-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Registration City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-input boxed-input"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
            <i className="fa-solid fa-check"></i> Post Free Listing
          </button>
        </form>
      </div>
    </div>
  );
}
