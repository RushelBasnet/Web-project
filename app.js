// ===========================
// DATA
// ===========================
let PROPERTIES = [];

const AMENITY_LABELS = {
  parking: "🚗 Parking",
  gym: "💪 Gym",
  pool: "🏊 Pool",
  "pet-friendly": "🐾 Pet Friendly",
  washer: "🧺 Washer/Dryer",
  dishwasher: "🍽️ Dishwasher",
  ac: "❄️ Air Conditioning"
};

// ===========================
// STATE
// ===========================
let currentPage = 'home';
let filteredProperties = [...PROPERTIES];
let favorites = new Set();
let currentView = 'grid';
let currentTypeFilter = '';
let currentBedsFilter = '';

// ===========================
// PAGE NAVIGATION
// ===========================
function showPage(page, data) {
  document.querySelectorAll('[id^="page-"]').forEach(el => el.style.display = 'none');
  document.getElementById('page-' + page).style.display = 'block';
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'listings') renderListings();
  if (page === 'detail' && data) renderDetail(data);
}

// ===========================
// HERO SEARCH
// ===========================
function doSearch() {
  const location = document.getElementById('heroLocation').value.trim();
  const type = document.getElementById('heroType').value;
  const price = document.getElementById('heroPrice').value;

  showPage('listings');

  if (location) document.getElementById('filterLocation').value = location;
  if (type) {
    currentTypeFilter = type;
    updateChips('typeChips', 'type', type);
  }
  if (price) document.getElementById('priceMax').value = price;

  applyFilters();
}

function quickSearch(city) {
  showPage('listings');
  document.getElementById('filterLocation').value = city;
  applyFilters();
}

function filterByType(type) {
  currentTypeFilter = type;
  showPage('listings');
  updateChips('typeChips', 'type', type);
  applyFilters();
}

// ===========================
// FILTERS
// ===========================
function applyFilters() {
  const location = (document.getElementById('filterLocation').value || '').toLowerCase();
  const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
  const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;
  const sortBy = document.getElementById('sortBy').value;

  const checkedAmenities = Array.from(
    document.querySelectorAll('[data-amenity]:checked')
  ).map(el => el.dataset.amenity);

  filteredProperties = PROPERTIES.filter(p => {
    if (location && !p.location.toLowerCase().includes(location) && !p.city.toLowerCase().includes(location)) return false;
    if (currentTypeFilter && p.type !== currentTypeFilter) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (currentBedsFilter !== '') {
      const beds = parseInt(currentBedsFilter);
      if (beds === 3 && p.beds < 3) return false;
      if (beds !== 3 && p.beds !== beds) return false;
    }
    if (checkedAmenities.length > 0) {
      if (!checkedAmenities.every(a => p.amenities.includes(a))) return false;
    }
    return true;
  });

  // Sort
  if (sortBy === 'price-asc') filteredProperties.sort((a,b) => a.price - b.price);
  else if (sortBy === 'price-desc') filteredProperties.sort((a,b) => b.price - a.price);
  else if (sortBy === 'newest') filteredProperties.sort((a,b) => b.id - a.id);
  else filteredProperties.sort((a,b) => (b.badge === 'featured' ? 1 : 0) - (a.badge === 'featured' ? 1 : 0));

  renderListings();
}

function clearFilters() {
  document.getElementById('filterLocation').value = '';
  document.getElementById('priceMin').value = '';
  document.getElementById('priceMax').value = '';
  document.getElementById('sortBy').value = 'featured';
  document.querySelectorAll('[data-amenity]').forEach(el => el.checked = false);
  currentTypeFilter = '';
  currentBedsFilter = '';
  updateChips('typeChips', 'type', '');
  updateChips('bedroomChips', 'beds', '');
  filteredProperties = [...PROPERTIES];
  renderListings();
}

function updateChips(containerId, attr, val) {
  document.querySelectorAll(`#${containerId} .chip`).forEach(chip => {
    chip.classList.toggle('active', chip.dataset[attr] === val);
  });
}

// Chip click handlers
document.getElementById('typeChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  currentTypeFilter = chip.dataset.type;
  updateChips('typeChips', 'type', chip.dataset.type);
  applyFilters();
});

document.getElementById('bedroomChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  currentBedsFilter = chip.dataset.beds;
  updateChips('bedroomChips', 'beds', chip.dataset.beds);
  applyFilters();
});

// ===========================
// VIEW TOGGLE
// ===========================
function setView(view) {
  currentView = view;
  const grid = document.getElementById('listingsGrid');
  if (view === 'list') {
    grid.classList.add('list-view');
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
  } else {
    grid.classList.remove('list-view');
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
  }
}

// ===========================
// RENDER LISTINGS
// ===========================
function renderListings() {
  const grid = document.getElementById('listingsGrid');
  const count = document.getElementById('resultsCount');
  count.textContent = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`;

  if (filteredProperties.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1/-1">
        <div class="no-icon">🔍</div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or search in a different area.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filteredProperties.map(p => propertyCardHTML(p)).join('');
}

function renderFeatured() {
  const featured = PROPERTIES.filter(p => p.badge === 'featured').slice(0, 3).concat(
    PROPERTIES.filter(p => p.badge !== 'featured').slice(0, 3)
  ).slice(0, 6);
  const grid = document.getElementById('featuredGrid');
  if (grid) grid.innerHTML = featured.map(p => propertyCardHTML(p)).join('');
}

function propertyCardHTML(p) {
  const isFav = favorites.has(p.id);
  const badgeHTML = p.badge ? `<div class="card-badge ${p.badge}">${p.badge}</div>` : '';
  const bedsLabel = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds > 1 ? 's' : ''}`;

  return `
    <div class="property-card" onclick="openDetail(${p.id})">
      <div class="card-image">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
        ${badgeHTML}
        <button class="card-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${p.id})" title="Save">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-price">$${p.price.toLocaleString()}<span>/mo</span></div>
        <div class="card-title">${p.title}</div>
        <div class="card-location">📍 ${p.location}</div>
        <div class="card-meta">
          <div class="card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            ${bedsLabel}
          </div>
          <div class="card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><path d="M2 12h20"/><path d="M12 2v10"/></svg>
            ${p.baths} bath${p.baths > 1 ? 's' : ''}
          </div>
          <div class="card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            ${p.sqft.toLocaleString()} sq ft
          </div>
        </div>
      </div>
    </div>`;
}

// ===========================
// FAVORITES
// ===========================
function toggleFav(event, id) {
  event.stopPropagation();
  const btn = event.currentTarget;
  if (favorites.has(id)) {
    favorites.delete(id);
    btn.innerHTML = '🤍';
    btn.classList.remove('active');
    showToast('Removed from saved');
  } else {
    favorites.add(id);
    btn.innerHTML = '❤️';
    btn.classList.add('active');
    showToast('Saved to favorites');
  }
}

// ===========================
// PROPERTY DETAIL
// ===========================
function openDetail(id) {
  const p = PROPERTIES.find(x => x.id === id);
  if (!p) return;
  showPage('detail', p);
}

function renderDetail(p) {
  const container = document.getElementById('detailContainer');
  const bedsLabel = p.beds === 0 ? 'Studio' : `${p.beds}`;
  const bedsText = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds > 1 ? 's' : ''}`;
  if (typeof p.amenities === 'string') {
    p.amenities = p.amenities.replace('{', '').replace('}', '').split(',');
}
  const amenityHTML = p.amenities.map(a =>
    `<div class="amenity-pill">${AMENITY_LABELS[a] || a}</div>`
  ).join('');

  container.innerHTML = `
    <button class="detail-back" onclick="showPage('listings')">
      ← Back to listings
    </button>

    <div class="detail-images">
      <div class="detail-img-main">
        <img src="${p.images[0]}" alt="${p.title}" />
      </div>
      <div class="detail-img-small">
        <img src="${p.images[1]}" alt="${p.title}" />
      </div>
      <div class="detail-img-small">
        <img src="${p.images[2]}" alt="${p.title}" />
      </div>
    </div>

    <div class="detail-layout">
      <div class="detail-left">
        <div class="detail-header">
          <div class="detail-badge-row">
            <span class="detail-badge">${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</span>
            ${p.badge ? `<span class="detail-badge" style="background:#fef9c3;color:#92400e;">${p.badge}</span>` : ''}
          </div>
          <h1 class="detail-title">${p.title}</h1>
          <div class="detail-location">📍 ${p.location}</div>
        </div>

        <div class="detail-price-row">
          <div class="detail-price">$${p.price.toLocaleString()}</div>
          <div class="detail-price-sub">per month</div>
        </div>

        <div class="detail-stats">
          <div class="detail-stat">
            <div class="detail-stat-num">${p.beds === 0 ? 'Studio' : p.beds}</div>
            <div class="detail-stat-label">${p.beds === 1 ? 'Bedroom' : p.beds === 0 ? '' : 'Bedrooms'}</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-num">${p.baths}</div>
            <div class="detail-stat-label">${p.baths === 1 ? 'Bathroom' : 'Bathrooms'}</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-num">${p.sqft.toLocaleString()}</div>
            <div class="detail-stat-label">Sq Ft</div>
          </div>
        </div>

        <div class="detail-section">
          <h3>About this property</h3>
          <p>${p.description}</p>
        </div>

        <div class="detail-section">
          <h3>Amenities</h3>
          <div class="amenities-grid">${amenityHTML}</div>
        </div>

        <div class="detail-section">
          <h3>Location</h3>
          <p>${p.location}</p>
          <div style="background:#f1f5f9;border-radius:12px;height:160px;display:flex;align-items:center;justify-content:center;margin-top:12px;color:#94a3b8;font-size:14px;">
            📍 Map view — ${p.location}
          </div>
        </div>
      </div>

      <div class="detail-right">
        <div class="contact-card">
          <div class="detail-available">
            <span>✅</span> ${p.available}
          </div>
          <div class="landlord-info">
            <div class="landlord-avatar">${p.landlordInitial}</div>
            <div>
              <div class="landlord-name">${p.landlord}</div>
              <div class="landlord-tag">Verified Landlord</div>
            </div>
          </div>
          <button class="btn-primary" onclick="openContactModal('${p.title.replace(/'/g, "\\'")}')">
            📧 Contact Landlord
          </button>
          <br/>
          <button class="btn-outline" onclick="openContactModal('${p.title.replace(/'/g, "\\'")}')">
            📅 Schedule Viewing
          </button>
          <p class="card-note">Usually responds within 2 hours</p>
        </div>
      </div>
    </div>`;
}
function logout() {
    localStorage.removeItem('user');
    updateNav();
    showToast('Logged out successfully!');
}
function updateNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navActions = document.getElementById('navActions');

    if (user) {
        navActions.innerHTML = `
            <span style="font-size:14px;font-weight:600;color:#111827">Hi, ${user.name}</span>
            <button class="btn-outline" onclick="logout()">Log out</button>
        `;
    } else {
        navActions.innerHTML = `
            <button class="btn-outline" onclick="openModal('loginModal')">Log in</button>
            <button class="btn-primary" onclick="openModal('signupModal')">Sign up</button>
        `;
    }
}
function switchModal(closeId, openId) {
    closeModal(null, closeId);
    openModal(openId);
}

function openContactModal(propertyName) {
  document.getElementById('contactPropertyName').textContent = propertyName;
  openModal('contactModal');
}

// ===========================
// MODALS
// ===========================
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(event, id) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('api/auth.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        closeModal(null, 'loginModal');
        showToast('Signed in successfully!');
        updateNav();
    } else {
        showToast(data.message);
    }
}
async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('api/auth.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        closeModal(null, 'signupModal');
        showToast('Account created successfully!');
        updateNav();
    } else {
        showToast(data.message);
    }
}
async function handleContact(e) {
  e.preventDefault();
  const name=document.getElementById('contactName').value;
  const email=document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    const propertyName = document.getElementById('contactPropertyName').textContent;
const formData = new FormData();
    formData.append('action', 'send_message');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('message', message);
    formData.append('property_name', propertyName);

    const response = await fetch('api/messages.php', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();

    if (data.success) {
        closeModal(null, 'contactModal');
        showToast('Message sent to landlord!');
    } else {
        showToast(data.message);
    }
}

// Close modals on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

// ===========================
// TOAST
// ===========================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===========================
// MOBILE MENU
// ===========================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const isOpen = menu.style.display === 'flex';
  menu.style.display = isOpen ? 'none' : 'flex';
}

// ===========================
// NAVBAR SCROLL
// ===========================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 10) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

async function loadProperties(){
  const formData=new FormData();
  formData.append('action','get_all');

  const response=await fetch('api/properties.php',{
    method:'POST',
    body: formData
  });
    const data = await response.json();

    if (data.success) {
    PROPERTIES = data.properties.map(p => {
        if (typeof p.amenities === 'string') {
            p.amenities = p.amenities.replace('{', '').replace('}', '').split(',');
        }
        if (typeof p.images === 'string') {
            p.images = p.images.replace('{', '').replace('}', '').split(',');
        }
        return p;
    });
    filteredProperties = [...PROPERTIES];
    renderFeatured();
}
}

loadProperties();
updateNav();