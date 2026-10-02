/* booking.js - submits the booking form to the Django API and shows the confirmation */

const bookingForm = document.getElementById('booking-form');
const bookingFormWrap = document.getElementById('booking-form-wrap');
const bookingConfirmation = document.getElementById('booking-confirmation');

// No past dates in the picker
const dateInput = document.getElementById('b-date');
if (dateInput) {
  const now = new Date();
  dateInput.min = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name   = document.getElementById('b-name').value.trim();
    const email  = document.getElementById('b-email').value.trim();
    const phone  = document.getElementById('b-phone').value.trim();
    const date   = document.getElementById('b-date').value;
    const time   = document.getElementById('b-time').value;
    const guests = document.getElementById('b-guests').value; // "1".."6" or "7+"
    let requests = document.getElementById('b-requests').value.trim();

    if (!name || !email || !phone || !date || !time || !guests) {
      alert('Please fill in all required fields.');
      return;
    }

    if (guests === '7+') {
      requests = ('Party of 7 or more. ' + requests).trim();
    }

    const payload = {
      name: name,
      email: email,
      phone: phone,
      date: date,
      time: time,
      guests: guests === '7+' ? 7 : Number(guests),
      special_requests: requests
    };

    const btn = bookingForm.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Booking...';

    try {
      await Bookings.create(payload);
      displayBookingConfirmation({ name: name, date: date, time: time, guests: guests });
    } catch (err) {
      alert(err.message); // e.g. "time: We're closed at that time."
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}

function displayBookingConfirmation(data) {
  const dateObj = new Date(data.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-ZA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const parts = data.time.split(':');
  const h = parseInt(parts[0], 10);
  const formattedTime = (h % 12 || 12) + ':' + parts[1] + ' ' + (h >= 12 ? 'PM' : 'AM');

  document.getElementById('conf-b-name').textContent   = data.name;
  document.getElementById('conf-b-date').textContent   = formattedDate;
  document.getElementById('conf-b-time').textContent   = formattedTime;
  document.getElementById('conf-b-guests').textContent = data.guests + (data.guests === '1' ? ' guest' : ' guests');

  if (bookingFormWrap) bookingFormWrap.classList.add('hidden');
  if (bookingConfirmation) bookingConfirmation.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
