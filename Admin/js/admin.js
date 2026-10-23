// SellBuy Admin Panel Controller
let allAdminListings = [];

async function initAdminPanel() {
  await loadAdminStats();
  await loadAdminListings();
  await loadAdminUsers();
  await loadAdminBrands();
  await loadAdminCities();
}

function switchAdminTab(tab, el) {
  document.querySelectorAll('.admin-nav-item').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');

  const sections = ['dashboard', 'listings', 'users', 'brands', 'locations', 'broadcast'];
  sections.forEach(s => {
    const secEl = document.getElementById(`admin-sec-${s}`);
    if (secEl) secEl.style.display = s === tab ? 'block' : 'none';
  });

  if (tab === 'dashboard') loadAdminStats();
  if (tab === 'listings') loadAdminListings();
  if (tab === 'users') loadAdminUsers();
  if (tab === 'brands') loadAdminBrands();
  if (tab === 'locations') loadAdminCities();
}

async function loadAdminStats() {
  const res = await API.getAdminStats();
  if (res.success && res.stats) {
    const s = res.stats;
    document.getElementById('kpi-users').textContent = s.totalUsers;
    document.getElementById('kpi-active').textContent = s.activeListings;
    document.getElementById('kpi-pending').textContent = s.pendingApprovals;
    document.getElementById('kpi-value').textContent = '₹' + Number(s.totalMarketValue).toLocaleString('en-IN');
  }
}

async function loadAdminListings() {
  const res = await API.getAdminListings();
  if (res.success && res.listings) {
    allAdminListings = res.listings;
    renderAdminListingsTable(allAdminListings);
  }
}

function renderAdminListingsTable(listings) {
  const dashboardTbody = document.getElementById('admin-dashboard-listings-tbody');
  const allListingsTbody = document.getElementById('admin-all-listings-tbody');

  if (dashboardTbody) {
    dashboardTbody.innerHTML = listings.slice(0, 5).map(car => `
      <tr>
        <td>#${car.id}</td>
        <td><strong>${car.title}</strong></td>
        <td>${car.seller_name}</td>
        <td style="color: #60a5fa; font-weight: 700;">₹${Number(car.price).toLocaleString('en-IN')}</td>
        <td><span class="status-pill status-${car.status}">${car.status}</span></td>
        <td>${car.is_featured ? '⭐ Featured' : 'Standard'}</td>
        <td>
          ${car.status === 'pending' ? `
            <button class="btn-primary" style="padding: 4px 8px; font-size: 11px; width: auto; display: inline-flex;" onclick="adminApproveListing(${car.id})">Approve</button>
            <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto; display: inline-flex;" onclick="adminRejectListing(${car.id})">Reject</button>
          ` : `
            <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto; display: inline-flex;" onclick="adminToggleFeature(${car.id})">${car.is_featured ? 'Unfeature' : 'Feature'}</button>
          `}
        </td>
      </tr>
    `).join('');
  }

  if (allListingsTbody) {
    allListingsTbody.innerHTML = listings.map(car => `
      <tr>
        <td>#${car.id}</td>
        <td><img src="${car.primary_image || '/assets/cars/creta.jpg'}" style="width: 44px; height: 32px; object-fit: cover; border-radius: 4px;"></td>
        <td><strong>${car.title}</strong><div style="font-size: 11px; color: #94a3b8;">${car.reg_city} • ${car.fuel_type} • ${car.transmission}</div></td>
        <td>${car.seller_name} (${car.seller_phone})</td>
        <td style="color: #60a5fa; font-weight: 700;">₹${Number(car.price).toLocaleString('en-IN')}</td>
        <td><span class="status-pill status-${car.status}">${car.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${car.status === 'pending' ? `
              <button class="btn-primary" style="padding: 4px 8px; font-size: 11px; width: auto;" onclick="adminApproveListing(${car.id})">Approve</button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto;" onclick="adminRejectListing(${car.id})">Reject</button>
            ` : `
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto;" onclick="adminToggleFeature(${car.id})">${car.is_featured ? '★ Starred' : '☆ Feature'}</button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto; color: #ef4444;" onclick="adminDeleteListing(${car.id})">Delete</button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function filterAdminListings(val) {
  const term = val.toLowerCase().trim();
  const filtered = allAdminListings.filter(l => 
    l.title.toLowerCase().includes(term) ||
    l.seller_name.toLowerCase().includes(term) ||
    l.reg_city.toLowerCase().includes(term)
  );
  renderAdminListingsTable(filtered);
}

async function adminApproveListing(id) {
  const res = await API.approveListing(id);
  if (res.success) {
    alert(`Listing #${id} approved!`);
    await loadAdminListings();
    await loadAdminStats();
    if (window.refreshHomeCars) window.refreshHomeCars();
  }
}

async function adminRejectListing(id) {
  const res = await API.rejectListing(id);
  if (res.success) {
    alert(`Listing #${id} rejected!`);
    await loadAdminListings();
    await loadAdminStats();
  }
}

async function adminToggleFeature(id) {
  const res = await API.toggleFeaturedListing(id);
  if (res.success) {
    await loadAdminListings();
    if (window.refreshHomeCars) window.refreshHomeCars();
  }
}

async function adminDeleteListing(id) {
  if (confirm(`Are you sure you want to delete listing #${id}?`)) {
    const res = await API.deleteListing(id);
    if (res.success) {
      await loadAdminListings();
      await loadAdminStats();
      if (window.refreshHomeCars) window.refreshHomeCars();
    }
  }
}

async function loadAdminUsers() {
  const res = await API.getAdminUsers();
  if (res.success && res.users) {
    const tbody = document.getElementById('admin-users-tbody');
    if (tbody) {
      tbody.innerHTML = res.users.map(u => `
        <tr>
          <td>#${u.id}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${u.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
              <strong>${u.name}</strong>
            </div>
          </td>
          <td>+91 ${u.phone}</td>
          <td><span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${u.role}</span></td>
          <td>⭐ ${u.rating}</td>
          <td><span class="status-pill status-${u.status}">${u.status}</span></td>
          <td>
            <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px; width: auto; color: ${u.status === 'blocked' ? '#10b981' : '#ef4444'};" onclick="adminToggleUserBlock(${u.id})">
              ${u.status === 'blocked' ? 'Unblock' : 'Block'}
            </button>
          </td>
        </tr>
      `).join('');
    }
  }
}

async function adminToggleUserBlock(id) {
  const res = await API.toggleUserBlock(id);
  if (res.success) {
    await loadAdminUsers();
  }
}

async function loadAdminBrands() {
  const res = await API.getBrands();
  if (res.success && res.brands) {
    const wrap = document.getElementById('admin-brands-list-wrap');
    if (wrap) {
      wrap.innerHTML = res.brands.map(b => `
        <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 8px;">
          <span>${b.logo_icon || '🚗'}</span>
          <strong style="color: #fff;">${b.name}</strong>
          ${b.is_popular ? '<span style="font-size: 10px; color: #fbbf24;">★ Popular</span>' : ''}
        </div>
      `).join('');
    }
  }
}

async function handleAddBrand() {
  const nameInput = document.getElementById('new-brand-name');
  if (!nameInput.value.trim()) return alert('Please enter brand name');
  const res = await API.addBrand({ name: nameInput.value.trim(), isPopular: true, logoIcon: '🚗' });
  if (res.success) {
    nameInput.value = '';
    await loadAdminBrands();
    alert('Brand added successfully');
  }
}

async function loadAdminCities() {
  const res = await API.getCities();
  if (res.success && res.cities) {
    const wrap = document.getElementById('admin-cities-list-wrap');
    if (wrap) {
      wrap.innerHTML = res.cities.map(c => `
        <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px;">
          <strong style="color: #fff;">${c.name}</strong>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">(${c.state})</span>
        </div>
      `).join('');
    }
  }
}

async function handleAddCity() {
  const nameInput = document.getElementById('new-city-name');
  const stateInput = document.getElementById('new-city-state');
  if (!nameInput.value.trim() || !stateInput.value.trim()) return alert('Please enter city and state');
  const res = await API.addCity({ name: nameInput.value.trim(), state: stateInput.value.trim(), isPopular: true });
  if (res.success) {
    nameInput.value = '';
    stateInput.value = '';
    await loadAdminCities();
    alert('City added successfully');
  }
}

async function handleSendBroadcast() {
  const title = document.getElementById('broadcast-title').value;
  const msg = document.getElementById('broadcast-msg').value;
  if (!title || !msg) return alert('Please fill in title and message');
  const res = await API.broadcastNotification(title, msg);
  if (res.success) {
    alert('Broadcast notification sent to all active users!');
  }
}
