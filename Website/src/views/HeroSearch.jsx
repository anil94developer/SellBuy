import React from 'react';

export function HeroSearch({
  t,
  keyword,
  setKeyword,
  brands,
  selectedBrand,
  setSelectedBrand,
  cities,
  selectedCity,
  setSelectedCity,
  maxBudget,
  setMaxBudget,
  onSearch
}) {
  return (
    <>
      <section className="web-hero-banner">
        <div className="web-container">
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 30, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 14 }}>
            India's #1 Car Marketplace
          </span>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5 }}>
            Find Your Perfect Car with Complete Peace of Mind
          </h2>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 650, margin: '0 auto' }}>
            Browse verified pre-owned & brand-new vehicles from certified sellers across 10+ major Indian cities.
          </p>
        </div>
      </section>

      <div className="web-search-filter-card">
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>KEYWORD SEARCH</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder={t('searchPlaceholder')}
            className="text-input boxed-input"
            style={{ padding: 10 }}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>BRAND</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-input boxed-input"
            style={{ padding: 10 }}
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>CITY</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-input boxed-input"
            style={{ padding: 10 }}
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>MAX BUDGET</label>
          <select
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="text-input boxed-input"
            style={{ padding: 10 }}
          >
            <option value="">Any Budget</option>
            <option value="600000">Under ₹6 Lakh</option>
            <option value="1000000">Under ₹10 Lakh</option>
            <option value="1500000">Under ₹15 Lakh</option>
            <option value="2500000">Under ₹25 Lakh</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, visibility: 'hidden', display: 'block', marginBottom: 4 }}>BTN</label>
          <button className="btn-primary" style={{ padding: 12, fontSize: 14 }} onClick={onSearch}>
            <i className="fa-solid fa-magnifying-glass"></i> {t('searchButton')}
          </button>
        </div>
      </div>
    </>
  );
}
