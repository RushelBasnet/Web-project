// ===========================
// DATA
// ===========================
const PROPERTIES = [
  {
    id: 1,
    title: "Luxury Downtown Apartment",
    location: "Manhattan, New York",
    city: "New York",
    price: 3200,
    type: "apartment",
    beds: 2,
    baths: 2,
    sqft: 1100,
    badge: "featured",
    available: "Available now",
    description: "Stunning luxury apartment in the heart of Manhattan. Floor-to-ceiling windows with breathtaking skyline views, modern gourmet kitchen, and premium finishes throughout. Walking distance to Central Park, world-class dining, and top transportation hubs.",
    amenities: ["parking", "gym", "pool", "washer", "dishwasher", "ac", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80"
    ],
    landlord: "James Wilson",
    landlordInitial: "J"
  },
  {
    id: 2,
    title: "Modern Studio in Midtown",
    location: "Midtown, New York",
    city: "New York",
    price: 1800,
    type: "studio",
    beds: 0,
    baths: 1,
    sqft: 480,
    badge: "new",
    available: "Available now",
    description: "Bright and modern studio apartment in prime Midtown location. Efficient layout with high-end appliances, great natural light, and proximity to major transit lines. Perfect for young professionals.",
    amenities: ["ac", "dishwasher", "gym"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80"
    ],
    landlord: "Sarah Chen",
    landlordInitial: "S"
  },
  {
    id: 3,
    title: "Charming Family Home",
    location: "Beverly Hills, Los Angeles",
    city: "Los Angeles",
    price: 4500,
    type: "house",
    beds: 4,
    baths: 3,
    sqft: 2400,
    badge: "featured",
    available: "Available Mar 1",
    description: "Beautiful Spanish-style family home in the prestigious Beverly Hills neighborhood. Features a spacious backyard, private pool, gourmet kitchen, and a two-car garage. Close to top-rated schools and shopping.",
    amenities: ["parking", "pool", "washer", "dishwasher", "ac", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400&q=80"
    ],
    landlord: "Robert Miller",
    landlordInitial: "R"
  },
  {
    id: 4,
    title: "Lakefront Condo with Views",
    location: "Gold Coast, Chicago",
    city: "Chicago",
    price: 2600,
    type: "condo",
    beds: 2,
    baths: 2,
    sqft: 1250,
    badge: "",
    available: "Available now",
    description: "Stunning lakefront condo with panoramic views of Lake Michigan. Open floor plan with premium finishes, chef's kitchen, and a private balcony. Building features 24-hour doorman, fitness center, and rooftop deck.",
    amenities: ["parking", "gym", "washer", "dishwasher", "ac"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
    ],
    landlord: "Emily Park",
    landlordInitial: "E"
  },
  {
    id: 5,
    title: "Cozy Wynwood Apartment",
    location: "Wynwood, Miami",
    city: "Miami",
    price: 2100,
    type: "apartment",
    beds: 1,
    baths: 1,
    sqft: 720,
    badge: "new",
    available: "Available Feb 15",
    description: "Stylish apartment in the heart of Miami's vibrant Wynwood Arts District. Exposed brick, high ceilings, and modern updates. Steps from world-famous street art, trendy restaurants, and nightlife.",
    amenities: ["ac", "washer", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80"
    ],
    landlord: "Carlos Rivera",
    landlordInitial: "C"
  },
  {
    id: 6,
    title: "East Austin Townhouse",
    location: "East Austin, Texas",
    city: "Austin",
    price: 2900,
    type: "townhouse",
    beds: 3,
    baths: 2,
    sqft: 1800,
    badge: "",
    available: "Available now",
    description: "Modern townhouse in the trendy East Austin neighborhood. Features rooftop terrace, private backyard, two-car garage, and an open-concept living area. Walking distance to local cafes, live music venues, and restaurants.",
    amenities: ["parking", "washer", "dishwasher", "ac", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&q=80"
    ],
    landlord: "Amanda Torres",
    landlordInitial: "A"
  },
  {
    id: 7,
    title: "Mission District Apartment",
    location: "Mission District, San Francisco",
    city: "San Francisco",
    price: 3800,
    type: "apartment",
    beds: 2,
    baths: 1,
    sqft: 980,
    badge: "",
    available: "Available now",
    description: "Beautiful Victorian apartment in the heart of the Mission District. Original hardwood floors, bay windows, high ceilings, and modern kitchen. Vibrant neighborhood with excellent transit options.",
    amenities: ["washer", "dishwasher", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80"
    ],
    landlord: "Daniel Lee",
    landlordInitial: "D"
  },
  {
    id: 8,
    title: "Buckhead Studio Loft",
    location: "Buckhead, Atlanta",
    city: "Atlanta",
    price: 1400,
    type: "studio",
    beds: 0,
    baths: 1,
    sqft: 520,
    badge: "new",
    available: "Available now",
    description: "Modern studio loft in Buckhead's premier residential building. Floor-to-ceiling windows, polished concrete floors, and high-end appliances. Building amenities include pool, gym, and concierge.",
    amenities: ["gym", "pool", "ac", "dishwasher"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&q=80",
      "https://images.unsplash.com/photo-1461151304267-38566d8a2462?w=400&q=80"
    ],
    landlord: "Michelle Johnson",
    landlordInitial: "M"
  },
  {
    id: 9,
    title: "Capitol Hill Historic Home",
    location: "Capitol Hill, Seattle",
    city: "Seattle",
    price: 3500,
    type: "house",
    beds: 3,
    baths: 2,
    sqft: 1900,
    badge: "",
    available: "Available Mar 15",
    description: "Beautifully restored Craftsman home in the heart of Capitol Hill. Original character features including built-ins, fireplace, and hardwood floors, combined with a fully updated kitchen and baths. Spacious backyard with mature trees.",
    amenities: ["parking", "washer", "dishwasher", "pet-friendly"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      "https://images.unsplash.com/photo-1560440021-33f9b867899d?w=400&q=80",
      "https://images.unsplash.com/photo-1556909114-9e37a54e8b37?w=400&q=80"
    ],
    landlord: "Kevin Brown",
    landlordInitial: "K"
  }
];

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

function handleLogin(e) {
  e.preventDefault();
  closeModal(null, 'loginModal');
  showToast('Signed in successfully!');
}

function handleContact(e) {
  e.preventDefault();
  closeModal(null, 'contactModal');
  showToast('Message sent to landlord!');
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

// ===========================
// INIT
// ===========================
renderFeatured();
