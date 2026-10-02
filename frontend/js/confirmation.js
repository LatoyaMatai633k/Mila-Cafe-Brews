/* confirmation.js - shows the order saved by checkout */

function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return (hr % 12 || 12) + ":" + m + " " + (hr >= 12 ? "PM" : "AM");
}

function renderConfirmation() {
  const order = Orders.last();
  if (!order) { location.href = "index.html"; return; }

  document.getElementById("conf-order-number").textContent = order.number;
  document.getElementById("conf-order-type").textContent = order.type === "delivery" ? "Delivery" : "Pickup";

  const row = document.getElementById("conf-time-row");
  const label = row.querySelector(".conf-label");
  const value = document.getElementById("conf-time");
  if (order.type === "delivery") {
    label.textContent = "Delivery Address";
    value.textContent = order.address || "Not specified";
  } else if (order.pickupTime) {
    label.textContent = "Pickup Time";
    value.textContent = fmtTime(order.pickupTime);
  } else {
    row.style.display = "none";
  }

  document.getElementById("conf-items-list").innerHTML = order.items.map((i) => `
    <div class="summary-item">
      <span class="summary-item-name">${escapeHtml(i.product.name)}</span>
      <span class="summary-item-qty">x${i.quantity}</span>
      <span class="summary-item-price">${formatRand(i.subtotal)}</span>
    </div>`).join("");
  document.getElementById("conf-total").textContent = formatRand(order.total);
}

document.addEventListener("DOMContentLoaded", renderConfirmation);
