/* ===========================
   menu.js
   Handles menu category tab switching.
   Add to cart is handled by addToCart() in main.js.
   =========================== */

const tabs = document.querySelectorAll('.tab');
const categories = document.querySelectorAll('.menu-category');

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    const target = tab.getAttribute('data-category');

    // Update active tab
    tabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');

    // Show matching category, hide others
    categories.forEach(function (cat) {
      if (cat.id === 'cat-' + target) {
        cat.classList.add('active');
      } else {
        cat.classList.remove('active');
      }
    });
  });
});
