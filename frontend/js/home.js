/* home.js - featured products on the home page, loaded from the API.
   If the API is down, the static cards in index.html stay as a fallback.
   Add to Cart is handled by the shared handler in main.js. */

function featuredCardHTML(p) {
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

async function loadFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  try {
    const products = (await Products.list()).slice(0, 6);
    if (products.length) grid.innerHTML = products.map(featuredCardHTML).join("");
  } catch {
    /* keep the static cards */
  }
}

document.addEventListener("DOMContentLoaded", loadFeatured);
