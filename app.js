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
function goToAddProperty() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login to list a property');
        openModal('loginModal');
        return;
    }
    showPage('addproperty');
}
function goToMyListings() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login first');
        openModal('loginModal');
        return;
    }
    showPage('mylistings');
    loadMyListings();
}

async function loadMyListings() {
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('action', 'get_my_listings');
    formData.append('user_id', user.id);

    const response = await fetch('api/properties.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const grid = document.getElementById('myListingsGrid');

    if (data.success && data.properties.length > 0) {
        data.properties = data.properties.map(p => {
            if (typeof p.amenities === 'string') {
                p.amenities = p.amenities.replace('{', '').replace('}', '').split(',');
            }
            if (typeof p.images === 'string') {
                p.images = p.images.replace('{', '').replace('}', '').split(',');
            }
            return p;
        });
        grid.innerHTML = data.properties.map(p => myListingCardHTML(p)).join('');
    } else {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-icon">🏠</div>
                <h3>No listings yet</h3>
                <p>You have not listed any properties yet.</p>
                <button class="btn-primary" onclick="goToAddProperty()" style="margin-top:16px">List a Property</button>
            </div>`;
    }
}

let _currentChat = null;

function goToMessages() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login first');
        openModal('loginModal');
        return;
    }
    showPage('messages');
    backToInbox();
}

function backToInbox() {
    _currentChat = null;
    document.getElementById('chatView').style.display = 'none';
    document.getElementById('messagesInbox').style.display = 'block';
    loadConversations();
}

async function loadConversations() {
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('action', 'get_conversations');
    formData.append('user_id', user.id);

    const response = await fetch('api/messages.php', { method: 'POST', body: formData });
    const data = await response.json();
    const container = document.getElementById('messagesContainer');

    if (data.success && data.conversations.length > 0) {
        container.innerHTML = data.conversations.map(c => {
            const isSender = c.sender_id == user.id;
            const otherName = c.name;
            const preview = c.message.length > 80 ? c.message.substring(0, 80) + '...' : c.message;
            const date = new Date(c.created_at);
            const timeStr = date.toLocaleDateString();
            return `
            <div onclick="openChat(${c.other_id}, ${c.property_id || 'null'}, '${(c.property_name || '').replace(/'/g, "\\'")}')"
                 style="background:var(--glass);backdrop-filter:blur(12px);border:1px solid var(--glass-border);border-radius:var(--radius);padding:16px 20px;margin-bottom:12px;cursor:pointer;transition:var(--transition);"
                 onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--glass-border)'">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;">
                            ${otherName.charAt(0).toUpperCase()}
                        </div>
                        <span style="font-weight:700;font-size:15px;color:var(--text);">${otherName}</span>
                    </div>
                    <span style="font-size:12px;color:var(--text-light);">${timeStr}</span>
                </div>
                <div style="font-size:13px;color:var(--primary);margin-bottom:4px;margin-left:46px;">
                    🏠 ${c.property_name || 'General'}
                </div>
                <p style="font-size:13px;color:var(--text-muted);margin-left:46px;line-height:1.4;">${isSender ? 'You: ' : ''}${preview}</p>
            </div>`;
        }).join('');
    } else {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-icon">💬</div>
                <h3>No messages yet</h3>
                <p>Start a conversation by contacting a landlord.</p>
            </div>`;
    }
}

async function openChat(otherId, propertyId, propertyName) {
    const user = JSON.parse(localStorage.getItem('user'));
    _currentChat = { otherId, propertyId, propertyName };

    document.getElementById('messagesInbox').style.display = 'none';
    document.getElementById('chatView').style.display = 'block';
    document.getElementById('chatTitle').textContent = propertyName || 'Conversation';
    document.getElementById('chatSubtitle').textContent = 'Loading...';

    const formData = new FormData();
    formData.append('action', 'get_thread');
    formData.append('user_id', user.id);
    formData.append('other_id', otherId);
    if (propertyId) formData.append('property_id', propertyId);

    const response = await fetch('api/messages.php', { method: 'POST', body: formData });
    const data = await response.json();
    const chatBox = document.getElementById('chatMessages');

    if (data.success && data.messages.length > 0) {
        const otherName = data.messages.find(m => m.sender_id != user.id)?.name || 'User';
        document.getElementById('chatSubtitle').textContent = 'Chat with ' + otherName;

        chatBox.innerHTML = data.messages.map(m => {
            const isMe = m.sender_id == user.id;
            return `
            <div style="display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'};">
                <div style="max-width:70%;padding:10px 16px;border-radius:${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};background:${isMe ? 'var(--primary-dark)' : 'var(--glass)'};border:1px solid ${isMe ? 'transparent' : 'var(--glass-border)'};color:var(--text);font-size:14px;line-height:1.5;">
                    ${m.message}
                </div>
                <span style="font-size:11px;color:var(--text-light);margin-top:4px;padding:0 4px;">
                    ${m.name} · ${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>`;
        }).join('');
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        chatBox.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No messages yet.</p>';
        document.getElementById('chatSubtitle').textContent = '';
    }
}

async function sendReply(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !_currentChat) return;

    const input = document.getElementById('chatReplyInput');
    const message = input.value.trim();
    if (!message) return;

    const formData = new FormData();
    formData.append('action', 'send_reply');
    formData.append('sender_id', user.id);
    formData.append('receiver_id', _currentChat.otherId);
    if (_currentChat.propertyId) formData.append('property_id', _currentChat.propertyId);
    formData.append('property_name', _currentChat.propertyName || '');
    formData.append('name', user.name || user.email);
    formData.append('email', user.email);
    formData.append('message', message);

    const response = await fetch('api/messages.php', { method: 'POST', body: formData });
    const data = await response.json();

    if (data.success) {
        input.value = '';
        openChat(_currentChat.otherId, _currentChat.propertyId, _currentChat.propertyName);
    } else {
        showToast(data.message || 'Failed to send reply');
    }
}
async function archiveProperty(id) {
    if (!confirm('Archive this property? It will be hidden from listings.')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('action', 'archive_property');
    formData.append('id', id);
    formData.append('user_id', user.id);

    const response = await fetch('api/properties.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        showToast('Property archived successfully');
        loadMyListings();
    } else {
        showToast('Something went wrong');
    }
}

async function deleteProperty(id) {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('action', 'delete_property');
    formData.append('id', id);
    formData.append('user_id', user.id);

    const response = await fetch('api/properties.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        showToast('Property deleted successfully');
        loadMyListings();
    } else {
        showToast('Something went wrong');
    }
}

function editProperty(id) {
    const p = PROPERTIES.find(x => x.id == id);
    if (!p) return;
    showPage('addproperty');

    // Fill form with existing data
    document.getElementById('propTitle').value = p.title;
    document.getElementById('propLocation').value = p.location;
    document.getElementById('propCity').value = p.city;
    document.getElementById('propPrice').value = p.price;
    document.getElementById('propType').value = p.type;
    document.getElementById('propBeds').value = p.beds;
    document.getElementById('propBaths').value = p.baths;
    document.getElementById('propSqft').value = p.sqft || '';
    document.getElementById('propDescription').value = p.description || '';
    document.getElementById('propAvailable').value = p.available || '';
    document.getElementById('propImages').value = p.images.join('\n');

    // Check amenities
    document.querySelectorAll('#page-addproperty input[type="checkbox"]').forEach(cb => {
        cb.checked = p.amenities.includes(cb.value);
    });

    // Change button text and store id for update
    document.getElementById('addPropBtn').textContent = 'Update Property';
    document.getElementById('addPropBtn').dataset.editId = id;
}

async function handleAddProperty(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('Please login to list a property');
        openModal('loginModal');
        return;
    }

    // Get amenities
    const amenities = Array.from(
        document.querySelectorAll('#page-addproperty input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    // Get images
    const images = document.getElementById('propImages').value
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== '');

    const btn = document.getElementById('addPropBtn');
    const editId = btn.dataset.editId;

    const formData = new FormData();
    formData.append('action', editId ? 'update_property' : 'add_property');
    if (editId) formData.append('id', editId);
    formData.append('title', document.getElementById('propTitle').value);
    formData.append('location', document.getElementById('propLocation').value);
    formData.append('city', document.getElementById('propCity').value);
    formData.append('price', document.getElementById('propPrice').value);
    formData.append('type', document.getElementById('propType').value);
    formData.append('beds', document.getElementById('propBeds').value);
    formData.append('baths', document.getElementById('propBaths').value);
    formData.append('sqft', document.getElementById('propSqft').value);
    formData.append('description', document.getElementById('propDescription').value);
    formData.append('available', document.getElementById('propAvailable').value);
    formData.append('amenities', JSON.stringify(amenities));
    formData.append('images', JSON.stringify(images));
    formData.append('landlord', user.name);
    formData.append('landlord_initial', user.name.charAt(0).toUpperCase());
    formData.append('user_id', user.id);

    btn.textContent = editId ? 'Updating...' : 'Listing...';
    btn.disabled = true;

    const response = await fetch('api/properties.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.success) {
        showToast(editId ? 'Property updated successfully!' : 'Property listed successfully!');
        delete btn.dataset.editId;
        btn.textContent = 'List Property';
        btn.disabled = false;
        showPage('listings');
        loadProperties();
    } else {
        showToast(data.message || 'Something went wrong');
        btn.textContent = editId ? 'Update Property' : 'List Property';
        btn.disabled = false;
    }
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
        <div class="card-price">Rs ${p.price.toLocaleString()}<span>/mo</span></div>
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
function myListingCardHTML(p) {
    const badgeHTML = p.badge ? `<div class="card-badge ${p.badge}">${p.badge}</div>` : '';
    const bedsLabel = p.beds === 0 ? 'Studio' : `${p.beds} bed${p.beds > 1 ? 's' : ''}`;

    return `
        <div class="property-card">
            <div class="card-image">
                <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
                ${badgeHTML}
            </div>
            <div class="card-body">
                <div class="card-price">Rs ${p.price.toLocaleString()}<span>/mo</span></div>
                <div class="card-title">${p.title}</div>
                <div class="card-location">📍 ${p.location}</div>
                <div class="card-meta">
                    <div class="card-meta-item">${bedsLabel}</div>
                    <div class="card-meta-item">${p.baths} bath${p.baths > 1 ? 's' : ''}</div>
                    <div class="card-meta-item">${p.sqft ? p.sqft.toLocaleString() + ' sq ft' : ''}</div>
                </div>
                <div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
                    <button class="btn-outline" style="flex:1;padding:8px;" onclick="editProperty(${p.id})">✏️ Edit</button>
                    <button class="btn-outline" style="flex:1;padding:8px;" onclick="archiveProperty(${p.id})">📦 Archive</button>
                    <button style="flex:1;padding:8px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:var(--radius-sm);cursor:pointer;font-weight:600;font-size:14px;" onclick="deleteProperty(${p.id})">🗑️ Delete</button>
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
          <div class="detail-price">Rs ${p.price.toLocaleString()}</div>
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
          <button class="btn-primary" onclick="openContactModal('${p.title.replace(/'/g, "\\'")}', ${p.id}, ${p.user_id})">
            📧 Contact Landlord
          </button>
          <br/>
          <button class="btn-outline" onclick="openContactModal('${p.title.replace(/'/g, "\\'")}', ${p.id}, ${p.user_id})">
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
    const user = JSON.parse(localStorage.getItem('user')); // ← this line must be here
    const navActions = document.getElementById('navActions');

    if (user) {
        const adminBtn = user.role === 'admin' ? `<button class="btn-primary" onclick="goToAdmin()" style="background:#a78bfa;color:#0f172a;">Admin Panel</button>` : '';
        navActions.innerHTML = `
            <span style="font-size:14px;font-weight:600;color:#111827">Hi, ${user.name}</span>
            ${adminBtn}
            <button class="btn-outline" onclick="goToMyListings()">My Listings</button>
            <button class="btn-outline" onclick="goToMessages()">Messages</button>
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

let _contactPropertyId = null;
let _contactReceiverId = null;

function openContactModal(propertyName, propertyId, receiverId) {
  const user=JSON.parse(localStorage.getItem('user'));
  if(!user){
    showToast('Please login to contact landlord');
    openModal('loginModal');
    return;
  }
    _contactPropertyId = propertyId || null;
    _contactReceiverId = receiverId || null;
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
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
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
if (!nameRegex.test(name)) {
    showToast('Name can only contain letters and spaces');
    return;
    }
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address');
    return;
}
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
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
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('action', 'send_message');
    if(user) formData.append('sender_id', user.id);
    if(_contactReceiverId) formData.append('receiver_id', _contactReceiverId);
    if(_contactPropertyId) formData.append('property_id', _contactPropertyId);
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

// ===========================
// ADMIN PANEL
// ===========================
let adminProperties = [];
let adminUsers = [];

function goToAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        showToast('Admin access required');
        return;
    }
    showPage('admin');
    adminRefreshAll();
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('admin-' + tab).style.display = 'block';
    document.querySelector(`.admin-tab[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'dashboard') loadAdminStats();
    if (tab === 'properties') loadAdminProperties();
    if (tab === 'users') loadAdminUsers();
}

async function adminRefreshAll() {
    await Promise.all([loadAdminStats(), loadAdminProperties(), loadAdminUsers()]);
    showToast('Data refreshed');
}

async function adminFetch(action, extraData = {}) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return null;
    const formData = new FormData();
    formData.append('action', action);
    formData.append('user_id', user.id);
    for (const [key, val] of Object.entries(extraData)) {
        formData.append(key, val);
    }
    const response = await fetch('api/admin.php', { method: 'POST', body: formData });
    return response.json();
}

async function loadAdminStats() {
    const data = await adminFetch('get_stats');
    if (!data || !data.success) return;
    document.getElementById('statTotalProps').textContent = data.stats.total_properties;
    document.getElementById('statActiveProps').textContent = data.stats.active_properties;
    document.getElementById('statArchivedProps').textContent = data.stats.archived_properties;
    document.getElementById('statTotalUsers').textContent = data.stats.total_users;
}

async function loadAdminProperties() {
    const data = await adminFetch('get_all_properties');
    if (!data || !data.success) return;
    adminProperties = data.properties;
    renderAdminProperties(adminProperties);
}

function renderAdminProperties(props) {
    const tbody = document.getElementById('adminPropertiesBody');
    if (props.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted);">No properties found</td></tr>';
        return;
    }
    tbody.innerHTML = props.map(p => {
        const statusClass = p.status === 'active' ? 'status-active' : p.status === 'archived' ? 'status-archived' : p.status === 'rejected' ? 'status-rejected' : 'status-pending';
        return `<tr>
            <td>${p.id}</td>
            <td class="admin-td-title">${escapeHTML(p.title)}</td>
            <td>${escapeHTML(p.city || p.location)}</td>
            <td>Rs ${Number(p.price).toLocaleString()}</td>
            <td>${p.type}</td>
            <td>${escapeHTML(p.owner_name || 'N/A')}<br><small style="color:var(--text-muted)">${escapeHTML(p.owner_email || '')}</small></td>
            <td><span class="admin-status ${statusClass}">${p.status || 'active'}</span></td>
            <td>${p.badge === 'featured' ? '<span class="admin-badge-featured">Featured</span>' : '—'}</td>
            <td class="admin-actions-cell">
                <select onchange="adminChangePropertyStatus(${p.id}, this.value)" class="admin-action-select">
                    <option value="" disabled selected>Status</option>
                    <option value="active">Active</option>
                    <option value="archived">Archive</option>
                    <option value="rejected">Reject</option>
                </select>
                <button class="admin-btn-sm admin-btn-feature" onclick="adminToggleFeatured(${p.id})" title="${p.badge === 'featured' ? 'Remove featured' : 'Mark featured'}">⭐</button>
                <button class="admin-btn-sm admin-btn-delete" onclick="adminDeleteProperty(${p.id})" title="Delete permanently">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

function filterAdminProperties() {
    const search = document.getElementById('adminPropSearch').value.toLowerCase();
    const status = document.getElementById('adminPropFilter').value;
    const filtered = adminProperties.filter(p => {
        const matchSearch = !search || p.title.toLowerCase().includes(search) || (p.location || '').toLowerCase().includes(search) || (p.city || '').toLowerCase().includes(search);
        const matchStatus = !status || p.status === status;
        return matchSearch && matchStatus;
    });
    renderAdminProperties(filtered);
}

async function adminChangePropertyStatus(propId, status) {
    const data = await adminFetch('update_property_status', { property_id: propId, status: status });
    if (data && data.success) {
        showToast(data.message);
        loadAdminProperties();
        loadAdminStats();
    } else {
        showToast(data?.message || 'Error updating status');
    }
}

async function adminToggleFeatured(propId) {
    const data = await adminFetch('toggle_featured', { property_id: propId });
    if (data && data.success) {
        showToast(data.message);
        loadAdminProperties();
    } else {
        showToast('Error toggling featured');
    }
}

async function adminDeleteProperty(propId) {
    if (!confirm('Permanently delete this property? This cannot be undone.')) return;
    const data = await adminFetch('admin_delete_property', { property_id: propId });
    if (data && data.success) {
        showToast(data.message);
        loadAdminProperties();
        loadAdminStats();
    } else {
        showToast('Error deleting property');
    }
}

async function loadAdminUsers() {
    const data = await adminFetch('get_all_users');
    if (!data || !data.success) return;
    adminUsers = data.users;
    renderAdminUsers(adminUsers);
}

function renderAdminUsers(users) {
    const tbody = document.getElementById('adminUsersBody');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No users found</td></tr>';
        return;
    }
    tbody.innerHTML = users.map(u => {
        const roleClass = u.role === 'admin' ? 'role-admin' : u.role === 'banned' ? 'role-banned' : 'role-user';
        const isMe = u.id == currentUser.id;
        return `<tr>
            <td>${u.id}</td>
            <td>${escapeHTML(u.name)} ${isMe ? '<small style="color:var(--primary)">(you)</small>' : ''}</td>
            <td>${escapeHTML(u.email)}</td>
            <td><span class="admin-role ${roleClass}">${u.role || 'user'}</span></td>
            <td>${u.property_count}</td>
            <td>${u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
            <td class="admin-actions-cell">
                ${isMe ? '<span style="color:var(--text-muted);font-size:12px;">—</span>' : `
                    <select onchange="adminChangeUserRole(${u.id}, this.value)" class="admin-action-select">
                        <option value="" disabled selected>Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="banned">Ban</option>
                    </select>
                    <button class="admin-btn-sm admin-btn-delete" onclick="adminDeleteUser(${u.id})" title="Delete user">🗑️</button>
                `}
            </td>
        </tr>`;
    }).join('');
}

function filterAdminUsers() {
    const search = document.getElementById('adminUserSearch').value.toLowerCase();
    const filtered = adminUsers.filter(u => {
        return !search || u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
    });
    renderAdminUsers(filtered);
}

async function adminChangeUserRole(targetId, role) {
    const data = await adminFetch('update_user_role', { target_user_id: targetId, role: role });
    if (data && data.success) {
        showToast(data.message);
        loadAdminUsers();
    } else {
        showToast(data?.message || 'Error updating role');
    }
}

async function adminDeleteUser(targetId) {
    if (!confirm('Delete this user and ALL their properties? This cannot be undone.')) return;
    const data = await adminFetch('delete_user', { target_user_id: targetId });
    if (data && data.success) {
        showToast(data.message);
        loadAdminUsers();
        loadAdminProperties();
        loadAdminStats();
    } else {
        showToast(data?.message || 'Error deleting user');
    }
}


function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===========================
// INIT
// ===========================
loadProperties();
updateNav();