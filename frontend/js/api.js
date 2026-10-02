/* ==========================================================
   api.js - Mila Café Brews
   Load BEFORE main.js on every page:
     <script src="js/api.js"></script>
   ========================================================== */

const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/api", // no trailing slash

  // Must match your root urls.py include() prefixes
  PATHS: {
    products: "/products/",
    categories: "/categories/",
    bookings: "/bookings/",
  },

  PLACEHOLDER_IMG: "images/placeholder.jpeg",
};

// ---------- HELPERS ----------
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? "?" + s : "";
}

// Turns any DRF error body into one readable string
function extractMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map((d) => extractMessage(d, "")).join(" ");
  if (typeof data === "object") {
    if (data.detail) return String(data.detail);
    const parts = Object.entries(data).map(([k, v]) => {
      const msg = extractMessage(v, "");
      return k === "non_field_errors" ? msg : `${k}: ${msg}`;
    });
    return parts.join(" ") || fallback;
  }
  return fallback;
}

async function request(path, { method = "GET", body, params } = {}) {
  const opts = { method, headers: { Accept: "application/json" } };

  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(API_CONFIG.BASE_URL + path + buildQuery(params), opts);
  } catch {
    throw new ApiError("Can't reach the server. Please try again.", 0, null);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    throw new ApiError(
      extractMessage(data, `Request failed (${res.status})`),
      res.status,
      data
    );
  }
  return data;
}

// Handles both plain arrays and DRF pagination
async function fetchAll(path, params) {
  let data = await request(path, { params });
  if (Array.isArray(data)) return data;
  const all = [...(data.results || [])];
  const basePath = new URL(API_CONFIG.BASE_URL).pathname;
  while (data.next) {
    const u = new URL(data.next);
    data = await request(u.pathname.replace(basePath, "") + u.search);
    all.push(...(data.results || []));
  }
  return all;
}

// ---------- RESOURCES ----------
const Categories = {
  list: () => fetchAll(API_CONFIG.PATHS.categories),
};

const Products = {
  list: (params) => fetchAll(API_CONFIG.PATHS.products, params),
  get: (id) => request(`${API_CONFIG.PATHS.products}${id}/`),
};

const Bookings = {
  create: (data) => request(API_CONFIG.PATHS.bookings, { method: "POST", body: data }),
};

// ---------- LOCAL CART (demo: stored in the browser, no login) ----------
const CART_KEY = "mila_cart";
const ORDER_KEY = "mila_last_order";

function readLines() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  if (!Array.isArray(raw)) return [];

  // Sanitise: also accepts the old "qty" field and drops any broken lines
  return raw
    .map((l) => ({
      id: Number(l.id),
      name: l.name,
      price: Number(l.price),
      image: l.image,
      quantity: Number(l.quantity ?? l.qty),
    }))
    .filter((l) => Number.isFinite(l.id) && Number.isFinite(l.price) && l.quantity > 0);
}
function writeLines(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
}
// Same shape the cart/checkout pages already use:
// { items: [{ id, product: {id,name,price,image}, quantity, subtotal }], total }
function buildCart(lines) {
  const items = lines.map((l) => ({
    id: l.id,
    product: { id: l.id, name: l.name, price: l.price, image: l.image },
    quantity: l.quantity,
    subtotal: Number(l.price) * l.quantity,
  }));
  return { items, total: items.reduce((s, i) => s + i.subtotal, 0) };
}

const Cart = {
  get: async () => buildCart(readLines()),

  // product = { id, name, price, image }
  addItem: async (product, quantity = 1) => {
    const lines = readLines();
    const line = lines.find((l) => l.id === product.id);
    if (line) line.quantity += quantity;
    else lines.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, quantity });
    writeLines(lines);
  },

  updateItem: async (id, quantity) => {
    const lines = readLines();
    const line = lines.find((l) => l.id === id);
    if (line) line.quantity = quantity;
    writeLines(lines);
  },

  removeItem: async (id) => writeLines(readLines().filter((l) => l.id !== id)),

  clear: () => writeLines([]),
};

const Orders = {
  // Demo checkout: save the order locally, empty the cart, return the order.
  place(details) {
    const cart = buildCart(readLines());
    const order = {
      number: "MC-" + (1000 + Math.floor(Math.random() * 9000)),
      ...details,
      items: cart.items,
      total: cart.total,
    };
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    Cart.clear();
    return order;
  },
  last() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY)); } catch { return null; }
  },
};

// ---------- UI HELPERS ----------
function formatRand(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "R0";
  return "R" + (Number.isInteger(num) ? num : num.toFixed(2));
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// Product images from the API may be relative to the server
function imageUrl(src) {
  if (!src) return API_CONFIG.PLACEHOLDER_IMG;
  if (/^https?:\/\//i.test(src)) return src;
  return new URL(API_CONFIG.BASE_URL).origin + (src.startsWith("/") ? src : "/" + src);
}

// Updates the nav badge from the cart and returns the cart
async function refreshCartCount() {
  const cart = await Cart.get();
  updateCartCount(cart.items.reduce((s, i) => s + i.quantity, 0));
  return cart;
}
