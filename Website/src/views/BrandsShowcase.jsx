import React from 'react';

export function BrandsShowcase({ t, brands, onBrandClick }) {
  return (
    <div className="web-container" id="explore-brands">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('popularBrands')}</h3>
        <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14, marginBottom: 40 }}>
        {brands.map(b => (
          <div key={b.id} className="web-brand-card" onClick={() => onBrandClick(b.name)}>
            <span style={{ fontSize: 28 }}>{b.logo_icon || '🚗'}</span>
            <strong style={{ fontSize: 13, color: '#0f172a', marginTop: 6 }}>{b.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
