// SellBuy Customer Website Logic
let allCarsList = [];
let currentWebCity = 'All Cities';

document.addEventListener('DOMContentLoaded', async () => {
  applyTranslations();
  await loadWebMetadata();
  await loadWebCars();
});

function toggleWebLanguage() {
  const newLang = currentLang === 'en' ? 'hi' : 'en';
  setLanguage(newLang);
}

async function loadWebMetadata() {
  const [brandsRes, citiesRes] = await Promise.all([
    API.getBrands(),
    API.getCities()
  ]);

  if (brandsRes.success) {
    const brandSel = document.getElementById('web-brand-filter');
    const brandsRow = document.getElementById('web-brands-showcase');
    const sellBrandSel = document.getElementById('web-sell-brand-select');

    if (brandSel) {
      brandSel.innerHTML = '<option value="">All Brands</option>' + brandsRes.brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
    }
    if (sellBrandSel) {
      sellBrandSel.innerHTML = brandsRes.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    }
    if (brandsRow) {
      brandsRow.innerHTML = brandsRes.brands.map(b => `
        <div class="web-brand-card" onclick="filterByWebBrand('${b.name}')">
          <span style="font-size: 28px;">${b.logo_icon || '🚗'}</span>
          <strong style="font-size: 13px; color: #0f172a; margin-top: 6px;">${b.name}</strong>
        </div>
      `).join('');
    }
  }

  if (citiesRes.success) {
    const citySel = document.getElementById('web-city-filter');
    if (citySel) {
      citySel.innerHTML = '<option value="">All Cities</option>' + citiesRes.cities.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
  }
}

async function loadWebCars(filters = {}) {
  const res = await API.getCars(filters);
  if (res.success && res.cars) {
    allCarsList = res.cars;
    renderWebCars(allCarsList);
  }
}

function renderWebCars(cars) {
  const grid = document.getElementById('web-cars-grid');
  const countEl = document.getElementById('web-cars-count');
  if (countEl) countEl.textContent = `${cars.length} Cars Available`;

  if (grid) {
    if (cars.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #64748b;">No cars found matching your search. Try adjusting filters.</div>`;
      return;
    }

    grid.innerHTML = cars.map(car => `
      <div class="car-card" onclick="openWebCarModal(${car.id})">
        <div class="car-card-img-wrap" style="height: 200px;">
          <img src="${car.primary_image || 'assets/cars/creta.jpg'}" class="car-card-img">
          ${car.is_certified ? '<div class="car-certified-badge"><i class="fa-solid fa-shield-check"></i> Certified</div>' : ''}
          <button class="car-fav-btn" onclick="event.stopPropagation(); alert('Added to favorites!');">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${car.title}</h3>
          <div class="car-card-price">₹${Number(car.price).toLocaleString('en-IN')}</div>
          <div class="car-specs-row">
            <span class="spec-chip"><i class="fa-solid fa-location-dot"></i> ${car.reg_city}</span>
            <span class="spec-chip"><i class="fa-solid fa-road"></i> ${Number(car.km_driven).toLocaleString('en-IN')} km</span>
            <span class="spec-chip"><i class="fa-solid fa-gas-pump"></i> ${car.fuel_type}</span>
            <span class="spec-chip"><i class="fa-solid fa-gear"></i> ${car.transmission}</span>
          </div>
          <div style="margin-top: 14px; display: flex; gap: 8px;">
            <button class="btn-primary" style="padding: 8px; font-size: 13px;" onclick="event.stopPropagation(); openWebCarModal(${car.id})">View Details</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function executeWebSearch() {
  const query = document.getElementById('web-search-keyword')?.value;
  const brand = document.getElementById('web-brand-filter')?.value;
  const city = document.getElementById('web-city-filter')?.value;
  const maxPrice = document.getElementById('web-budget-filter')?.value;

  loadWebCars({ q: query, brand, city, maxPrice });
}

function filterByWebBrand(brandName) {
  const sel = document.getElementById('web-brand-filter');
  if (sel) sel.value = brandName;
  executeWebSearch();
}

function filterByWebTab(tab, btn) {
  document.querySelectorAll('.web-tab-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadWebCars({ tab });
}

async function openWebCarModal(id) {
  const res = await API.getCarDetails(id);
  if (res.success && res.car) {
    const c = res.car;
    const body = document.getElementById('web-modal-car-content');
    if (body) {
      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
          <div>
            <img src="${c.images && c.images[0] ? c.images[0] : 'assets/cars/creta.jpg'}" style="width: 100%; height: 320px; object-fit: cover; border-radius: 14px;">
            <div style="display: flex; gap: 8px; margin-top: 10px;">
              ${(c.images || []).map(img => `<img src="${img}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; cursor: pointer;">`).join('')}
            </div>
          </div>
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a;">${c.title}</h2>
            <div style="font-size: 24px; font-weight: 800; color: var(--primary); margin: 8px 0;">₹${Number(c.price).toLocaleString('en-IN')}</div>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 16px;"><i class="fa-solid fa-location-dot"></i> ${c.reg_city}</div>

            <div class="specs-overview-grid" style="margin-bottom: 16px;">
              <div class="spec-grid-item"><div class="label">Year</div><div class="val">${c.manufacturing_year}</div></div>
              <div class="spec-grid-item"><div class="label">KM Driven</div><div class="val">${Number(c.km_driven).toLocaleString('en-IN')} km</div></div>
              <div class="spec-grid-item"><div class="label">Fuel</div><div class="val">${c.fuel_type}</div></div>
              <div class="spec-grid-item"><div class="label">Gearbox</div><div class="val">${c.transmission}</div></div>
              <div class="spec-grid-item"><div class="label">Owner</div><div class="val">${c.ownership || '1st Owner'}</div></div>
              <div class="spec-grid-item"><div class="label">Insurance</div><div class="val">Comprehensive</div></div>
            </div>

            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">${c.description}</p>

            <div class="seller-summary-card" style="margin-bottom: 20px;">
              <div class="seller-left-info">
                <img src="${c.seller_avatar || 'assets/logo.jpg'}" class="seller-avatar-img">
                <div>
                  <div class="seller-name-txt">${c.seller_name}</div>
                  <div class="seller-meta-txt">Member since 2022 • ⭐ ${c.seller_rating || 4.8}</div>
                </div>
              </div>
              <span style="font-size: 11px; color: var(--accent-green); font-weight: 700;">Verified Seller ✓</span>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn-chat-seller" onclick="alert('Inquiry dispatched! Seller will contact you shortly.')"><i class="fa-regular fa-comments"></i> Inquire Seller</button>
              <button class="btn-call-seller" onclick="alert('Calling seller: ${c.seller_phone || '+91 9876543210'}')"><i class="fa-solid fa-phone"></i> Contact Seller</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById('web-car-detail-modal').style.display = 'flex';
    }
  }
}

function closeWebCarModal() {
  document.getElementById('web-car-detail-modal').style.display = 'none';
}

// EMI Calculator
function calculateEMI() {
  const p = parseFloat(document.getElementById('emi-amount')?.value || 500000);
  const r = parseFloat(document.getElementById('emi-rate')?.value || 9.5) / 12 / 100;
  const n = parseFloat(document.getElementById('emi-tenure')?.value || 48);

  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const total = Math.round(emi * n);
  const interest = Math.round(total - p);

  document.getElementById('emi-monthly-result').textContent = '₹' + emi.toLocaleString('en-IN');
  document.getElementById('emi-total-interest').textContent = '₹' + interest.toLocaleString('en-IN');
}

// Quick Sell Modal
function openQuickSellModal() {
  document.getElementById('web-quick-sell-modal').style.display = 'flex';
}
function closeQuickSellModal() {
  document.getElementById('web-quick-sell-modal').style.display = 'none';
}

async function handleWebSellSubmit() {
  const brandId = document.getElementById('web-sell-brand-select').value;
  const model = document.getElementById('web-sell-model').value;
  const year = document.getElementById('web-sell-year').value;
  const price = document.getElementById('web-sell-price').value;
  const km = document.getElementById('web-sell-km').value;
  const city = document.getElementById('web-sell-city').value;

  if (!model || !price || !km) return alert('Please fill in required fields');

  const res = await API.createListing({
    userId: 1,
    brandId,
    modelName: model,
    manufacturingYear: year,
    price,
    kmDriven: km,
    regCity: city || 'Delhi',
    fuelType: 'Petrol',
    transmission: 'Manual'
  });

  if (res.success) {
    alert('Listing created successfully!');
    closeQuickSellModal();
    loadWebCars();
  }
}
