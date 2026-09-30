/* ===========================
   cart.js
   Renders the cart page contents.
   Handles quantity changes and item removal.
   =========================== */

function renderCart() {
  const cart = getCart();
  const emptyEl = document.getElementById('cart-empty');
  const layoutEl = document.getElementById('cart-layout');
  const itemsEl = document.getElementById('cart-items');

  if (!emptyEl || !layoutEl || !itemsEl) return;

  if (cart.length === 0) {
    emptyEl.classList.add('visible');
    layoutEl.classList.remove('visible');
    return;
  }

  emptyEl.classList.remove('visible');
  layoutEl.classList.add('visible');

  // Build cart item HTML
  itemsEl.innerHTML = cart.map(function (item) {
    return '<div class="cart-item" data-id="' + item.id + '">' +
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img" />' +
      '<div class="cart-item-details">' +
        '<p class="cart-item-name">' + item.name + '</p>' +
        '<p class="cart-item-price">R' + item.price + ' each</p>' +
        '<div class="cart-item-controls">' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">−</button>' +
          '<span class="qty-value">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
          '<button class="cart-item-remove" onclick="removeItem(' + item.id + ')">Remove</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  updateTotals(cart);
}

function updateTotals(cart) {
  const subtotal = cart.reduce(function (sum, item) { return sum + (item.price * item.qty); }, 0);
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = 'R' + subtotal;
  if (totalEl) totalEl.textContent = 'R' + subtotal;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === id; });
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    // Remove item if quantity reaches zero
    const updated = cart.filter(function (i) { return i.id !== id; });
    saveCart(updated);
  } else {
    saveCart(cart);
  }

  updateCartCount();
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(function (i) { return i.id !== id; });
  saveCart(cart);
  updateCartCount();
  renderCart();
}

// Render on page load
renderCart();
