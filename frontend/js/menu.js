/* menu.js - renders tabs + products from the API */

let menuProducts = [];

function productCardHTML(p) {
  const soldOut = p.in_stock === false || p.stock === 0;
  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <img src="${escapeHtml(imageUrl(p.image))}" alt="${escapeHtml(p.name)}" class="product-img" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.description)}</p>
        <div class="product-footer">
          <span class="product-price">${formatRand(p.price)}</span>
          <button class="btn btn-add" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${escapeHtml(imageUrl(p.image))}" ${soldOut ? "disabled" : ""}>
            ${soldOut ? "Sold out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>`;
}

function renderMenu(categories, products) {
  const tabs = document.getElementById("category-tabs");
  const section = document.querySelector(".menu-section");

  section.querySelectorAll(".menu-category").forEach((el) => el.remove());

  // Only show categories that actually have products
  const visible = categories.filter((c) => products.some((p) => p.category?.id === c.id));

  tabs.innerHTML = visible
    .map((c, i) => `<button class="tab ${i === 0 ? "active" : ""}" data-category="${c.id}">${escapeHtml(c.name)}</button>`)
    .join("");

  visible.forEach((c, i) => {
    const items = products.filter((p) => p.category?.id === c.id);
    const div = document.createElement("div");
    div.className = "menu-category" + (i === 0 ? " active" : "");
    div.id = `cat-${c.id}`;
    div.innerHTML = `<div class="products-grid">${items.map(productCardHTML).join("")}</div>`;
    section.appendChild(div);
  });

  if (!visible.length) {
    section.insertAdjacentHTML("beforeend", `<p class="muted-text">The menu is empty right now.</p>`);
  }
}

async function loadMenu() {
  const section = document.querySelector(".menu-section");
  const loading = document.getElementById("menu-loading");
  try {
    const [categories, products] = await Promise.all([Categories.list(), Products.list()]);
    menuProducts = products;
    if (loading) loading.remove();
    renderMenu(categories, products);
  } catch (err) {
    if (loading) loading.remove();
    section.insertAdjacentHTML(
      "beforeend",
      `<p class="muted-text">Couldn't load the menu: ${escapeHtml(err.message)}</p>`
    );
  }
}

// Tab switching (delegated, since tabs are rendered dynamically)
document.addEventListener("click", (e) => {
  const tab = e.target.closest("#category-tabs .tab");
  if (!tab) return;
  document.querySelectorAll("#category-tabs .tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".menu-category").forEach((c) => c.classList.remove("active"));
  tab.classList.add("active");
  document.getElementById(`cat-${tab.dataset.category}`)?.classList.add("active");
});

document.addEventListener("DOMContentLoaded", loadMenu);
