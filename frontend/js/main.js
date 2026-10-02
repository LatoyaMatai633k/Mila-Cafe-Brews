/* ---- Dark Mode ---- */

function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☾' : '☀';
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

initTheme();

/* ---- Mobile Hamburger ---- */

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });
}

/* ---- Cart count badge ---- */

// Sets the number shown on the nav cart icon.
// (api.js calls this after fetching the cart from the backend.)
let badgeReady = false; // skip the pop animation on the first render of a page
function updateCartCount(total) {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const prev = Number(badge.textContent) || 0;
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
  if (badgeReady && total > prev && badge.animate) {
    badge.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
      { duration: 300, easing: 'ease-out' }
    );
  }
  badgeReady = true;
}

/* ---- Cart Drawer ---- */

// image should already be a full URL (use imageUrl() from api.js)
function openCartDrawer(name, price, image, qty) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer) return;

  document.getElementById('drawer-item-name').textContent = name;
  document.getElementById('drawer-item-price').textContent = formatRand(price);
  const img = document.getElementById('drawer-item-image');
  img.src = image;
  img.alt = name;

  const qtyEl = drawer.querySelector('.drawer-item-qty');
  if (qtyEl) qtyEl.textContent = 'Quantity: ' + qty;

  drawer.classList.add('open');
  if (overlay) overlay.classList.add('visible');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
}

// Close drawer on close button
const drawerClose = document.getElementById('cart-drawer-close');
if (drawerClose) drawerClose.addEventListener('click', closeCartDrawer);

// Close drawer on "Continue Shopping"
const continueShopping = document.getElementById('continue-shopping');
if (continueShopping) continueShopping.addEventListener('click', closeCartDrawer);

// Close drawer on overlay click
const cartOverlay = document.getElementById('cart-overlay');
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

/* ---- Add to cart (shared by home + menu pages) ---- */
// Any <button class="btn-add" data-id data-name data-price data-image> works.
// Static cards on index.html fall back to the data-* on their .product-card.
document.addEventListener('click', async function (e) {
  const btn = e.target.closest('.btn-add[data-id]');
  if (!btn || btn.disabled) return;

  const src = Object.assign({}, btn.closest('.product-card') && btn.closest('.product-card').dataset, btn.dataset);
  const product = {
    id: Number(src.id),
    name: src.name,
    price: Number(src.price),
    image: src.image
  };

  await Cart.addItem(product, 1);
  const cart = await refreshCartCount(); // badge: 1, then 2, 3... on repeat adds
  const line = cart.items.find(function (i) { return i.id === product.id; });
  openCartDrawer(product.name, product.price, product.image || API_CONFIG.PLACEHOLDER_IMG, line ? line.quantity : 1);
});

/* ---- Initialise on page load ---- */
// Pages that render the cart themselves (cart.js) also update the badge,
// this just makes sure every page shows the right number.
if (typeof refreshCartCount === 'function') refreshCartCount();
