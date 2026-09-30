/* ===========================
   booking.js
   Handles the booking form submission and confirmation display.
   =========================== */

const bookingForm = document.getElementById('booking-form');
const bookingFormWrap = document.getElementById('booking-form-wrap');
const bookingConfirmation = document.getElementById('booking-confirmation');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form values
    const name    = document.getElementById('b-name').value.trim();
    const email   = document.getElementById('b-email').value.trim();
    const phone   = document.getElementById('b-phone').value.trim();
    const date    = document.getElementById('b-date').value;
    const time    = document.getElementById('b-time').value;
    const guests  = document.getElementById('b-guests').value;

    // Basic validation
    if (!name || !email || !phone || !date || !time || !guests) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prepare booking data for future backend connection
    const bookingData = {
      name:   name,
      email:  email,
      phone:  phone,
      date:   date,
      time:   time,
      guests: guests,
      specialRequests: document.getElementById('b-requests').value.trim()
    };

    // -------------------------------------------------------
    // Backend API will be connected here later.
    // Example: submitBooking(bookingData);
    // -------------------------------------------------------

    // Show confirmation on the frontend
    displayBookingConfirmation(bookingData);
  });
}

function submitBooking(bookingData) {
  // Connect to the backend API here later.
}

function displayBookingConfirmation(data) {
  // Format the date nicely
  const dateObj = new Date(data.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format time to 12-hour
  const [hours, minutes] = data.time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const formattedTime = h12 + ':' + minutes + ' ' + ampm;

  document.getElementById('conf-b-name').textContent   = data.name;
  document.getElementById('conf-b-date').textContent   = formattedDate;
  document.getElementById('conf-b-time').textContent   = formattedTime;
  document.getElementById('conf-b-guests').textContent = data.guests + (data.guests === '1' ? ' guest' : ' guests');

  // Swap form for confirmation
  if (bookingFormWrap) bookingFormWrap.classList.add('hidden');
  if (bookingConfirmation) bookingConfirmation.classList.remove('hidden');
}
