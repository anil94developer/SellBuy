import React from 'react';

export function Footer({ onOpenCityModal, onSelectBrand }) {
  return (
    <footer className="olx-footer-wrapper">
      {/* Popular Locations & Searches Directory Strip (OLX style) */}
      <div className="olx-footer-directory-strip">
        <div className="olx-marketplace-container">
          <div className="olx-directory-grid">
            <div>
              <h4 className="olx-dir-title">POPULAR LOCATIONS</h4>
              <ul className="olx-dir-list">
                <li><a href="#explore-cars" onClick={() => onOpenCityModal && onOpenCityModal()}>Cars in Jaipur</a></li>
                <li><a href="#explore-cars" onClick={() => onOpenCityModal && onOpenCityModal()}>Cars in Delhi NCR</a></li>
                <li><a href="#explore-cars" onClick={() => onOpenCityModal && onOpenCityModal()}>Cars in Mumbai</a></li>
                <li><a href="#explore-cars" onClick={() => onOpenCityModal && onOpenCityModal()}>Cars in Bengaluru</a></li>
                <li><a href="#explore-cars" onClick={() => onOpenCityModal && onOpenCityModal()}>Cars in Hyderabad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="olx-dir-title">TRENDING BRANDS</h4>
              <ul className="olx-dir-list">
                <li><a href="#explore-cars" onClick={() => onSelectBrand && onSelectBrand('Maruti')}>Maruti Suzuki Swift & Baleno</a></li>
                <li><a href="#explore-cars" onClick={() => onSelectBrand && onSelectBrand('Hyundai')}>Hyundai Creta & i20</a></li>
                <li><a href="#explore-cars" onClick={() => onSelectBrand && onSelectBrand('Tata')}>Tata Nexon & Punch</a></li>
                <li><a href="#explore-cars" onClick={() => onSelectBrand && onSelectBrand('Mahindra')}>Mahindra Thar & Scorpio</a></li>
                <li><a href="#explore-cars" onClick={() => onSelectBrand && onSelectBrand('Kia')}>Kia Seltos & Sonet</a></li>
              </ul>
            </div>

            <div>
              <h4 className="olx-dir-title">ABOUT SELLBUY</h4>
              <ul className="olx-dir-list">
                <li><a href="#explore-cars">About SellBuy Group</a></li>
                <li><a href="#explore-cars">Certified Inspection Process</a></li>
                <li><a href="#explore-cars">SellBuy for Business & Dealers</a></li>
                <li><a href="#explore-cars">Trust, Safety & Security</a></li>
                <li><a href="#explore-cars">Careers & Press Releases</a></li>
              </ul>
            </div>

            <div>
              <h4 className="olx-dir-title">SELLBUY MOBILE APPS</h4>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
                Buy and sell on the go. Experience India's fastest verified car marketplace in your pocket.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div className="olx-app-store-badge">
                  <i className="fa-brands fa-google-play"></i>
                  <div>
                    <span style={{ fontSize: 8 }}>GET IT ON</span>
                    <strong>Google Play</strong>
                  </div>
                </div>
                <div className="olx-app-store-badge">
                  <i className="fa-brands fa-apple"></i>
                  <div>
                    <span style={{ fontSize: 8 }}>DOWNLOAD ON</span>
                    <strong>App Store</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="olx-footer-bottom-bar">
        <div className="olx-marketplace-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>SellBuy</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>|</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Free Classifieds & Automotive Portal in India</span>
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 16, color: '#94a3b8' }}>
              <a href="https://facebook.com" style={{ color: 'inherit' }}><i className="fa-brands fa-facebook"></i></a>
              <a href="https://instagram.com" style={{ color: 'inherit' }}><i className="fa-brands fa-instagram"></i></a>
              <a href="https://twitter.com" style={{ color: 'inherit' }}><i className="fa-brands fa-x-twitter"></i></a>
              <a href="https://youtube.com" style={{ color: 'inherit' }}><i className="fa-brands fa-youtube"></i></a>
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              © 2026 SellBuy Platforms India Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
