# Mila Café Brews

A customer-facing frontend for a fictional neighbourhood café, built as part of an AWS re/Start project. The website is designed to be hosted as a static site on Amazon S3.

---

## Tech Stack

- HTML
- CSS (custom properties, no framework)
- Vanilla JavaScript (no libraries)
- Google Fonts — Source Sans 3

---

## Project Structure

```
index.html          ← Home page (hero, featured menu, testimonials)
menu.html           ← Full menu with category tabs
cart.html           ← Shopping cart
checkout.html       ← Checkout form (pickup or delivery)
confirmation.html   ← Order confirmation
booking.html        ← Book a table form

css/
  style.css         ← All styles, light/dark mode, responsive layout

js/
  main.js           ← Dark mode, navigation, cart count, cart drawer
  menu.js           ← Menu category tab switching
  cart.js           ← Cart page (render items, quantity, remove)
  booking.js        ← Booking form and inline confirmation
  checkout.js       ← Checkout form, order summary, confirmation page

images/             ← Place your images here (see image list below)
```

---

## How to Run Locally

No build tools, no installs, no server required.

### Option 1 — Open directly in a browser

1. Download or clone this repository.
2. Add your images to the `images/` folder (see image list below).
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

```
Double-click index.html  →  Opens in your default browser
```

### Option 2 — Use VS Code Live Server (recommended)

1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **Open with Live Server**.
4. The site opens at `http://127.0.0.1:5500`.

Live Server automatically refreshes the browser when you save a file.

### Option 3 — Use Python's built-in server

If you have Python installed, open a terminal in the project folder and run:

```bash
# Python 3
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Images

Place your images in the `images/` folder using these exact filenames:

| Filename               | Used on               |
|------------------------|-----------------------|
| `hero-cafe.jpg`        | Home hero section     |
| `cappuccino.jpg`       | Cappuccino            |
| `iced-latte.jpg`       | Iced Latte            |
| `breakfast.jpg`        | Breakfast Toast       |
| `sandwich.jpg`         | Chicken Sandwich      |
| `cheesecake.jpg`       | Cheesecake            |
| `croissant.jpg`        | Chocolate Croissant   |
| `cafe-interior.jpg`    | Booking info panel    |
| `flat-white.jpg`       | Flat White            |
| `espresso.jpg`         | Espresso              |
| `americano.jpg`        | Americano             |
| `mocha.jpg`            | Mocha                 |
| `oats.jpg`             | Oat Bowl              |
| `egg-muffin.jpg`       | Egg Muffin            |
| `salad.jpg`            | Garden Salad          |
| `wrap.jpg`             | Veggie Wrap           |
| `brownie.jpg`          | Chocolate Brownie     |
| `orange-juice.jpg`     | Fresh Orange Juice    |
| `smoothie.jpg`         | Berry Smoothie        |
| `sparkling-water.jpg`  | Sparkling Water       |

---

## Features

- Light and dark mode (preference saved to `localStorage`)
- Responsive layout — desktop, tablet and mobile
- Mobile hamburger navigation
- Add to cart with right-side drawer confirmation
- Cart stored in `localStorage` (persists across pages)
- Full menu with category tabs (Coffee, Breakfast, Lunch, Desserts, Drinks)
- Cart page with quantity controls and item removal
- Checkout with pickup or delivery options
- Order confirmation page with order number and summary
- Table booking form with inline confirmation

---

## Backend Integration

The backend and AWS infrastructure are handled by separate team members.

Two clearly labelled placeholder functions are ready for connection:

```javascript
// js/checkout.js
function submitOrder(orderData) {
  // Connect to the backend API here later.
}

// js/booking.js
function submitBooking(bookingData) {
  // Connect to the backend API here later.
}
```

No API URLs are hardcoded. No backend code is included in this repository.

---

## Deploying to Amazon S3

1. Create an S3 bucket and enable **Static website hosting**.
2. Upload all project files, keeping the folder structure intact (`css/`, `js/`, `images/`).
3. Set the bucket policy to allow public read access.
4. Set the **Index document** to `index.html`.
5. Access the site using the S3 website endpoint URL.

---

## AWS re/Start Project

This frontend is part of an AWS re/Start group project for Mila Café Brews.
