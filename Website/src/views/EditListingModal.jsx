import React, { useState } from 'react';

export function EditListingModal({
  car,
  onClose,
  onUpdate
}) {
  const [price, setPrice] = useState(car ? car.price : '');
  const [description, setDescription] = useState(car ? car.description : '');
  const [kmDriven, setKmDriven] = useState(car ? (car.km_driven || car.mileage || '') : '');
  const [status, setStatus] = useState(car ? (car.status || 'active') : 'active');
  const [submitting, setSubmitting] = useState(false);

  if (!car) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onUpdate(car.id, {
      price: Number(price),
      formattedPrice: '₹ ' + Number(price).toLocaleString('en-IN'),
      description,
      km_driven: Number(kmDriven),
      mileage: Number(kmDriven),
      status
    });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-compact-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
            Edit Listing: {car.title}
          </h3>
          <button className="modal-close-x-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Updated Asking Price (₹)</label>
            <input
              type="number"
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
              className="text-input boxed-input"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Listing Status</label>
            <select
              className="text-input boxed-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active (Live in Marketplace)</option>
              <option value="pending">Under Review</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="text-input boxed-input"
              style={{ height: 80, resize: 'none' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Updates ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
