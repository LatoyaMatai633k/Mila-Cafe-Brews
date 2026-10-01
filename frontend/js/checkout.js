/* ===========================
   checkout.js
   Handles checkout form, order summary, and order confirmation.
   Also runs on confirmation.html to display order details.
   =========================== */

/* ---- Order Summary ---- */

function renderOrderSummary() {
  const cart = getCart();
  const summaryEl = document.getElementById('summary-items');
  const totalEl = document.getElementById('summary-total');
  if (!summaryEl) return;

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem;">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = 'R0';
    return;
  }

  const total = cart.reduce(function (sum, item) { return sum + (item.price * item.qty); }, 0);

  summaryEl.innerHTML = cart.map(function (item) {
    return '<div class="summary-item">' +
      '<span class="summary-item-name">' + item.name + '</span>' +
      '<span class="summary-item-qty">x' + item.qty + '</span>' +
      '<span class="summary-item-price">R' + (item.price * item.qty) + '</span>' +
    '</div>';
  }).join('');

  if (totalEl) totalEl.textContent = 'R' + total;
}

/* ---- Pickup / Delivery Toggle ---- */

const typePickup   = document.getElementById('type-pickup');
const typeDelivery = document.getElementById('type-delivery');
const pickupFields   = document.getElementById('pickup-fields');
const deliveryFields = document.getElementById('delivery-fields');

if (typePickup && typeDelivery) {
  typePickup.addEventListener('change', function () {
    pickupFields.classList.remove('hidden');
    deliveryFields.classList.add('hidden');
  });

  typeDelivery.addEventListener('change', function () {
    deliveryFields.classList.remove('hidden');
    pickupFields.classList.add('hidden');
  });
}

/* ---- Checkout Form Submission ---- */

const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !phone) {
      alert('Please fill in your name, email and phone number.');
      return;
    }

    const orderType = document.querySelector('input[name="order-type"]:checked').value;

    if (orderType === 'pickup') {
      const pickupTime = document.getElementById('pickup-time').value;
      if (!pickupTime) {
        alert('Please select a pickup time.');
        document.getElementById('pickup-time').focus();
        return;
      }
    }

    const cart = getCart();

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Build order data for future backend connection
    const orderData = {
      customer: { name: name, email: email, phone: phone },
      orderType: orderType,
      items: cart,
      total: cart.reduce(function (sum, item) { return sum + (item.price * item.qty); }, 0)
    };

    if (orderType === 'pickup') {
      orderData.pickupTime = document.getElementById('pickup-time').value;
    } else {
      orderData.deliveryAddress      = document.getElementById('delivery-address').value.trim();
      orderData.deliveryInstructions = document.getElementById('delivery-instructions').value.trim();
    }

    // -------------------------------------------------------
    // Backend API will be connected here later.
    // Example: submitOrder(orderData);
    // -------------------------------------------------------

    // Save order to localStorage so confirmation.html can read it
    const orderNumber = 'MC-' + (1000 + Math.floor(Math.random() * 900));
    orderData.orderNumber = orderNumber;
    localStorage.setItem('mila_last_order', JSON.stringify(orderData));

    // Clear the cart
    saveCart([]);
    updateCartCount();

    // Navigate to confirmation page
    window.location.href = 'confirmation.html';
  });
}

function submitOrder(orderData) {
  // Connect to the backend API here later.
}

/* ---- Confirmation Page ---- */

function renderConfirmation() {
  const confEl = document.getElementById('conf-order-number');
  if (!confEl) return; // Not on confirmation.html

  const orderStr = localStorage.getItem('mila_last_order');
  if (!orderStr) {
    // No order found, redirect home
    window.location.href = 'index.html';
    return;
  }

  const order = JSON.parse(orderStr);

  document.getElementById('conf-order-number').textContent = order.orderNumber || 'MC-1024';

  const typeText = order.orderType === 'pickup' ? 'Pickup' : 'Delivery';
  document.getElementById('conf-order-type').textContent = typeText;

  const timeRow = document.getElementById('conf-time-row');
  const timeEl  = document.getElementById('conf-time');

  if (order.orderType === 'pickup' && order.pickupTime) {
    // Format time
    const [hours, minutes] = order.pickupTime.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    timeEl.textContent = h12 + ':' + minutes + ' ' + ampm;
    if (timeRow) timeRow.style.display = '';
  } else if (order.orderType === 'delivery') {
    if (timeRow) {
      timeRow.querySelector('.conf-label').textContent = 'Delivery Address';
      timeEl.textContent = order.deliveryAddress || 'Not specified';
    }
  } else {
    if (timeRow) timeRow.style.display = 'none';
  }

  // Items list
  const itemsList = document.getElementById('conf-items-list');
  const totalEl   = document.getElementById('conf-total');

  if (itemsList && order.items) {
    itemsList.innerHTML = order.items.map(function (item) {
      return '<div class="summary-item">' +
        '<span class="summary-item-name">' + item.name + '</span>' +
        '<span class="summary-item-qty">x' + item.qty + '</span>' +
        '<span class="summary-item-price">R' + (item.price * item.qty) + '</span>' +
      '</div>';
    }).join('');
  }

  if (totalEl) totalEl.textContent = 'R' + (order.total || 0);
}

/* ---- Init ---- */
renderOrderSummary();
renderConfirmation();
