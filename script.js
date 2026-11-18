
/* =========================================
   WEDDING INVITATION
   Rahendhu & Jayesh
   JavaScript
========================================= */


/* =========================================
   1. CONFIGURATION

   Update these values when needed.
========================================= */

const CONFIG = {
    weddingDate: '2026-12-23T12:00:00+05:30',

    coupleNames: 'Rahendhu & Jayesh',

    venue: 'Mia Garden, Palluruthy, Kerala',

    // Enter WhatsApp number with country code,
    // without the + symbol.
    // Example: '919876543210'

    rsvpPhone: '',

    // Calendar event times are in UTC.
    // 12:00 PM IST = 06:30 AM UTC.
    // End time is an editable 1-hour placeholder.

    calendarStart: '20261223T063000Z',
    calendarEnd: '20261223T073000Z'
};


/* =========================================
   2. DOM ELEMENTS
========================================= */

const app = document.getElementById('app');

const openButton = document.getElementById('open');

const mainContent = document.getElementById('main');

const calendarButton = document.getElementById('calendar');

const rsvpButton = document.getElementById('rsvp');

const toastElement = document.getElementById('toast');


/* =========================================
   3. OPEN INVITATION

   Opens the envelope and displays
   the main wedding invitation.
========================================= */

function openInvitation() {

    // Add the opened class to the app.
    // CSS handles the animations.

    app.classList.add('opened');

    // Scroll to the invitation content.

    mainContent.scrollIntoView({
        behavior: 'smooth'
    });

}

openButton.addEventListener(
    'click',
    openInvitation
);


/* =========================================
   4. WEDDING COUNTDOWN

   Calculates remaining days, hours,
   minutes and seconds.
========================================= */

const weddingDate = new Date(CONFIG.weddingDate);

function updateCountdown() {

    // Calculate remaining milliseconds.

    let remainingTime = Math.max(
        0,
        weddingDate.getTime() - Date.now()
    );

    // Calculate days.

    const days = Math.floor(
        remainingTime / 86400000
    );

    remainingTime %= 86400000;

    // Calculate hours.

    const hours = Math.floor(
        remainingTime / 3600000
    );

    remainingTime %= 3600000;

    // Calculate minutes.

    const minutes = Math.floor(
        remainingTime / 60000
    );

    // Calculate seconds.

    const seconds = Math.floor(
        (remainingTime % 60000) / 1000
    );

    // Store countdown values.

    const countdownValues = {
        days,
        hours,
        minutes,
        seconds
    };

    // Update the HTML elements.

    Object.entries(countdownValues).forEach(
        ([id, value]) => {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = String(value).padStart(
                    2,
                    '0'
                );
            }

        }
    );

}

// Run immediately.
updateCountdown();

// Update every second.
setInterval(updateCountdown, 1000);


/* =========================================
   5. TOAST NOTIFICATIONS

   Displays temporary messages
   at the bottom of the screen.
========================================= */

let toastTimeout;

function showToast(message) {

    // Clear any previous timeout.

    clearTimeout(toastTimeout);

    // Update the message.

    toastElement.textContent = message;

    // Display notification.

    toastElement.style.display = 'block';

    // Hide after 4.5 seconds.

    toastTimeout = setTimeout(() => {

        toastElement.style.display = 'none';

    }, 4500);

}


/* =========================================
   6. GOOGLE CALENDAR

   Opens Google Calendar with the
   wedding ceremony information.
========================================= */

function addToCalendar() {

    const calendarDetails = new URLSearchParams({

        action: 'TEMPLATE',

        text: `${CONFIG.coupleNames} — Wedding Ceremony`,

        dates:
            `${CONFIG.calendarStart}/${CONFIG.calendarEnd}`,

        details:
            'Wedding ceremony starts at 12:00 PM IST. ' +
            'The calendar end time is a placeholder. ' +
            'Please adjust it as needed.',

        location: CONFIG.venue

    });

    const calendarURL =
        'https://calendar.google.com/calendar/render?' +
        calendarDetails.toString();

    // Open Google Calendar.

    window.open(
        calendarURL,
        '_blank',
        'noopener'
    );

    showToast(
        'Calendar duration is a 1-hour placeholder. ' +
        'Please adjust the end time before saving.'
    );

}

calendarButton.addEventListener(
    'click',
    addToCalendar
);


/* =========================================
   7. WHATSAPP RSVP

   Opens WhatsApp with a prefilled
   RSVP message.
========================================= */

function sendRSVP() {

    // Message sent by guests.

    const message =
        `Hello! I received ${CONFIG.coupleNames}'s ` +
        'wedding invitation for 23 December 2026. ' +
        'I would like to RSVP: ' +
        '[Attending / Unable to attend]. ' +
        'Guests: [number].';

    // Encode the message for use in a URL.

    const encodedMessage = encodeURIComponent(message);

    let whatsappURL;

    // If a phone number has been configured,
    // send the message to that number.

    if (CONFIG.rsvpPhone) {

        whatsappURL =
            `https://wa.me/${CONFIG.rsvpPhone}` +
            `?text=${encodedMessage}`;

    } else {

        // Without a configured number,
        // WhatsApp will prompt the guest
        // to choose a contact.

        whatsappURL =
            'https://api.whatsapp.com/send?text=' +
            encodedMessage;

        showToast(
            'RSVP number is not configured. ' +
            'Please add a WhatsApp number before publishing.'
        );

    }

    // Open WhatsApp.

    window.open(
        whatsappURL,
        '_blank',
        'noopener'
    );

}

rsvpButton.addEventListener(
    'click',
    sendRSVP
);
