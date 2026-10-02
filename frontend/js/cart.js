/* cart.js - cart page backed by the API */

function cartItemHTML(item) {
  const p = item.product;
  return `
    <div class="cart-item" data-item-id="${item.id}">
      <img src="${escapeHtml(p.image || API_CONFIG.PLACEHOLDER_IMG)}" alt="${escapeHtml(p.name)}" class="cart-item-img" />
      <div class="cart-item-details">
        <h3 class="cart-item-name">${escapeHtml(p.name)}</h3>
        <p class="cart-item-price">${formatRand(p.price)}</p>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-side">
        <span class="cart-item-subtotal">${formatRand(item.subtotal)}</span>
        <button class="cart-remove" data-action="remove" aria-label="Remove item">Remove</button>
      </div>
    </div>`;
}

function renderCart(cart) {
  const items = cart.items || [];
  const empty = document.getElementById("cart-empty");
  const layout = document.getElementById("cart-layout");

  empty.classList.toggle("visible", items.length === 0);
  layout.classList.toggle("visible", items.length > 0);

  document.getElementById("cart-items").innerHTML = items.map(cartItemHTML).join("");
  document.getElementById("cart-subtotal").textContent = formatRand(cart.total);
  document.getElementById("cart-total").textContent = formatRand(cart.total);

  updateCartCount(items.reduce((s, i) => s + i.quantity, 0));
}

async function loadCart() {
    try {
    renderCart(await Cart.get());
  } catch (err) {
    document.getElementById("cart-empty").classList.add("visible");
    document.getElementById("cart-empty").insertAdjacentHTML(
      "beforeend",
      `<p class="muted-text">Couldn't load your cart: ${escapeHtml(err.message)}</p>`
    );
  }
}

document.getElementById("cart-items").addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const row = btn.closest(".cart-item");
  const itemId = Number(row.dataset.itemId);
  const qty = Number(row.querySelector(".qty-value").textContent);
  const action = btn.dataset.action;

  row.querySelectorAll("button").forEach((b) => (b.disabled = true));

  try {
    if (action === "remove" || (action === "dec" && qty <= 1)) {
      await Cart.removeItem(itemId);
    } else {
      await Cart.updateItem(itemId, action === "inc" ? qty + 1 : qty - 1);
    }
    await loadCart();
  } catch (err) {
    alert(err.message); // e.g. out-of-stock on increase
    row.querySelectorAll("button").forEach((b) => (b.disabled = false));
  }
});

document.addEventListener("DOMContentLoaded", loadCart);
