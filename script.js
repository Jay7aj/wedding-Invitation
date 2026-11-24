
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

    rsvpPhone: '917510859589',

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

    // Start background music
    const weddingMusic = document.getElementById('wedding-music');

    weddingMusic.volume = 0.35;

    weddingMusic.play().catch((error) => {
        console.warn('Music playback failed:', error);
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
   PHOTO SLIDESHOW
========================================= */

const slideshowImages = document.querySelectorAll(
    '.photo-slideshow .couple-image'
);

if (
    slideshowImages.length > 0 &&
    !document.querySelector('.photo-slideshow .couple-image.active')
) {
    slideshowImages[0].classList.add('active');
}

let currentSlide = 0;

function showNextSlide() {

    if (slideshowImages.length < 2) {
        return;
    }

    slideshowImages[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slideshowImages.length;

    slideshowImages[currentSlide].classList.add('active');
}

// Automatically change every 4 seconds.

if (slideshowImages.length > 1) {
    setInterval(showNextSlide, 4000);
}



/* =========================================
   INTERACTIVE WEDDING RSVP
========================================= */

// Get form elements.

const rsvpForm = document.getElementById('rsvp-form');

const guestNameInput = document.getElementById('guest-name');

const guestCountInput = document.getElementById('guest-count');

const guestCountGroup = document.getElementById(
    'guest-count-group'
);

const attendanceInputs = document.querySelectorAll(
    'input[name="attendance"]'
);


/* =========================================
   SHOW / HIDE GUEST COUNT
========================================= */

function updateAttendanceFields() {

    const selectedAttendance = document.querySelector(
        'input[name="attendance"]:checked'
    );

    const isAttending = selectedAttendance.value === 'yes';

    // Hide guest count when declining.

    guestCountGroup.hidden = !isAttending;

    // Only require guest count when attending.

    guestCountInput.required = isAttending;
}

// Listen for attendance changes.

attendanceInputs.forEach((input) => {

    input.addEventListener(
        'change',
        updateAttendanceFields
    );

});

// Initialize form state.

updateAttendanceFields();


/* =========================================
   SUBMIT RSVP THROUGH WHATSAPP
========================================= */

function submitRSVP(event) {

    // Prevent the browser from refreshing.

    event.preventDefault();

    // Read guest information.

    const guestName = guestNameInput.value.trim();

    const attendance = document.querySelector(
        'input[name="attendance"]:checked'
    ).value;

    const isAttending = attendance === 'yes';

    const guestCount = isAttending
        ? guestCountInput.value
        : '0';

    // Validate guest name.

    if (!guestName) {

        showToast('Please enter your name.');

        guestNameInput.focus();

        return;
    }

    // Configure recipient.

    
    const phone = String(CONFIG.rsvpPhone).replace(/\D/g, '');

    if (!/^\d{10,15}$/.test(phone)) {
        showToast(
            'Please configure a valid WhatsApp number with country code.'
        );
        return;
    }


    // Format attendance response.

    const attendanceText = isAttending
        ? 'Joyfully Accepts'
        : 'Regretfully Declines';

    // Create RSVP message.

    const message = [
        '💍 WEDDING RSVP',
        '',
        `Wedding: ${CONFIG.coupleNames}`,
        'Date: 23 December 2026',
        '',
        `Guest Name: ${guestName}`,
        `Attendance: ${attendanceText}`,
        `Number of Guests: ${guestCount}`,
        '',
        'Thank you for the invitation! ❤️'
    ].join('\n');

    // Generate WhatsApp URL.

    const whatsappURL =
        `https://wa.me/${phone}?text=` +
        encodeURIComponent(message);

    // Open WhatsApp.

    window.location.href = whatsappURL;

}

// Attach submit event.

rsvpForm.addEventListener(
    'submit',
    submitRSVP
);
