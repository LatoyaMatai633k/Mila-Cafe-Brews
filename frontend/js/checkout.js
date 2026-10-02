/* checkout.js - demo checkout: order summary from the local cart, order saved locally */

const form = document.getElementById("checkout-form");
const pickupFields = document.getElementById("pickup-fields");
const deliveryFields = document.getElementById("delivery-fields");

async function loadSummary() {
  const cart = await Cart.get();
  if (!cart.items.length) {
    window.location.href = "cart.html";
    return;
  }
  document.getElementById("summary-items").innerHTML = cart.items
    .map(
      (i) => `
      <div class="cart-summary-row">
        <span>${escapeHtml(i.product.name)} × ${i.quantity}</span>
        <span>${formatRand(i.subtotal)}</span>
      </div>`
    )
    .join("");
  document.getElementById("summary-total").textContent = formatRand(cart.total);
}

function currentType() {
  return form.elements["order-type"].value;
}

function toggleOrderType() {
  const delivery = currentType() === "delivery";
  pickupFields.classList.toggle("hidden", delivery);
  deliveryFields.classList.toggle("hidden", !delivery);
}

form.querySelectorAll('input[name="order-type"]').forEach((r) =>
  r.addEventListener("change", toggleOrderType)
);

function validate() {
  const f = form.elements;
  const type = currentType();
  const errors = [];
  if (!f["full-name"].value.trim()) errors.push("Please enter your full name.");
  if (!/^\S+@\S+\.\S+$/.test(f["email"].value.trim())) errors.push("Please enter a valid email.");
  if (!f["phone"].value.trim()) errors.push("Please enter your phone number.");
  if (type === "pickup" && !f["pickup-time"].value) errors.push("Please choose a pickup time.");
  if (type === "delivery" && !f["delivery-address"].value.trim())
    errors.push("Please enter a delivery address.");
  return errors;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const errors = validate();
  if (errors.length) {
    alert(errors.join("\n"));
    return;
  }

  const cart = await Cart.get();
  if (!cart.items.length) {
    alert("Your cart is empty.");
    window.location.href = "cart.html";
    return;
  }

  const f = form.elements;
  Orders.place({
    type: currentType(),
    name: f["full-name"].value.trim(),
    email: f["email"].value.trim(),
    phone: f["phone"].value.trim(),
    pickupTime: f["pickup-time"].value,
    address: f["delivery-address"].value.trim(),
    instructions: f["delivery-instructions"].value.trim(),
  });
  window.location.href = "confirmation.html";
});

document.addEventListener("DOMContentLoaded", () => {
  toggleOrderType();
  loadSummary();
});
