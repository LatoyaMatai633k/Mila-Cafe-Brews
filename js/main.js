/* ===========================
   main.js
   Shared across all pages.
   Handles: dark mode, nav, cart count, cart drawer.
   =========================== */

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

/* ---- Cart Utilities ---- */

// Get cart array from localStorage
function getCart() {
  const data = localStorage.getItem('mila_cart');
  return data ? JSON.parse(data) : [];
}

// Save cart array to localStorage
function saveCart(cart) {
  localStorage.setItem('mila_cart', JSON.stringify(cart));
}

// Update the cart count badge in the nav
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

/* ---- Add To Cart ---- */
// Called directly from onclick attributes on product cards.

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === id; });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: id, name: name, price: price, image: image, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  openCartDrawer(name, price, image);
}

/* ---- Cart Drawer ---- */

function openCartDrawer(name, price, image) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer) return;

  // Fill in the drawer details
  document.getElementById('drawer-item-name').textContent = name;
  document.getElementById('drawer-item-price').textContent = 'R' + price;
  const img = document.getElementById('drawer-item-image');
  img.src = image;
  img.alt = name;

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

/* ---- Initialise on page load ---- */
updateCartCount();
