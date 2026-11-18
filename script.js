
// ============================================
// COOLCARE - COMPLETE WEBSITE JAVASCRIPT
// ============================================

// 1. BUSINESS CONFIGURATION

const CONFIG = {
  whatsappNumber: "919876543210",

  googleSheetURL:
    "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
};


// 2. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

  navLinks.classList.toggle("show");

  menuToggle.textContent =
    navLinks.classList.contains("show") ? "✕" : "☰";

});


// Close mobile menu after clicking a link

document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    navLinks.classList.remove("show");
    menuToggle.textContent = "☰";

  });

});


// 3. FOOTER YEAR

document.getElementById("year").textContent =
  new Date().getFullYear();


// 4. SET MINIMUM BOOKING DATE

const dateInput = document.getElementById("date");

function getLocalDate() {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

dateInput.min = getLocalDate();


// 5. WHATSAPP LINKS

function createWhatsAppLink(message) {

  return `https://wa.me/${CONFIG.whatsappNumber}?text=${
    encodeURIComponent(message)
  }`;

}

const generalMessage =
  "Hello CoolCare! I want to enquire about AC repair and service.";

const whatsappLink = createWhatsAppLink(generalMessage);

document.getElementById("heroWhatsApp").href = whatsappLink;

document.getElementById("heroWhatsApp").target = "_blank";

document.getElementById("whatsappFloat").href = whatsappLink;

document.getElementById("whatsappFloat").target = "_blank";


// 6. SERVICE CARD SELECTION

document.querySelectorAll(".service-book").forEach(button => {

  button.addEventListener("click", () => {

    const selectedService = button.dataset.service;

    document.getElementById("service").value =
      selectedService;

  });

});


// 7. BOOKING FORM ELEMENTS

const bookingForm =
  document.getElementById("bookingForm");

const submitBtn =
  document.getElementById("submitBtn");

const formStatus =
  document.getElementById("formStatus");


// 8. SHOW STATUS MESSAGE

function showStatus(message, color) {

  formStatus.textContent = message;

  formStatus.style.color = color;

}


// 9. BOOKING FORM SUBMISSION

bookingForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  // Collect customer details

  const booking = {

    name: document.getElementById("name").value.trim(),

    phone: document.getElementById("phone").value.trim(),

    service: document.getElementById("service").value,

    acType: document.getElementById("acType").value,

    problem: document.getElementById("problem").value.trim(),

    date: document.getElementById("date").value,

    time: document.getElementById("time").value,

    address: document.getElementById("address").value.trim()

  };


  // Validate mobile number

  if (!/^[6-9]\d{9}$/.test(booking.phone)) {

    showStatus(
      "Please enter a valid 10-digit mobile number.",
      "red"
    );

    return;

  }


  // Validate date

  if (booking.date < getLocalDate()) {

    showStatus(
      "Please select today or a future date.",
      "red"
    );

    return;

  }


  // Create WhatsApp message

  const message = `

Hello CoolCare! I want to book an AC service.

CUSTOMER DETAILS

Name: ${booking.name}
Mobile: ${booking.phone}

SERVICE DETAILS

Service: ${booking.service}
AC Type: ${booking.acType}
Problem: ${booking.problem || "Not specified"}

APPOINTMENT DETAILS

Date: ${booking.date}
Time: ${booking.time}

ADDRESS

${booking.address}

Please contact me to confirm my appointment.

Thank you!

  `.trim();


  const whatsappURL = createWhatsAppLink(message);


  // Open WhatsApp window immediately.
  // This avoids most browser popup-blocking issues.

  const whatsappWindow =
    window.open("about:blank", "_blank");


  submitBtn.disabled = true;

  submitBtn.textContent = "Submitting booking...";

  showStatus(
    "Submitting your booking request...",
    "#174a73"
  );


  // Save booking to Google Sheets

  let sheetSubmitted = false;

  try {

    if (
      CONFIG.googleSheetURL &&
      CONFIG.googleSheetURL !==
      "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
    ) {

      const params = new URLSearchParams();

      Object.entries(booking).forEach(([key, value]) => {

        params.append(key, value);

      });

      await fetch(CONFIG.googleSheetURL, {

        method: "POST",

        mode: "no-cors",

        body: params

      });

      // no-cors means we cannot inspect the server response.
      // This only means the browser request completed.

      sheetSubmitted = true;

    }

  } catch (error) {

    console.error("Google Sheets submission error:", error);

  }


  // Open WhatsApp with customer booking details

  if (whatsappWindow) {

    whatsappWindow.location.href = whatsappURL;

  } else {

    window.location.href = whatsappURL;

  }


  // Final status

  if (sheetSubmitted) {

    showStatus(
      "Request submitted. Please send the WhatsApp message to complete your enquiry.",
      "#087b45"
    );

  } else {

    showStatus(
      "WhatsApp is opening. Please send your booking message to our team.",
      "#c36a13"
    );

  }


  // Reset form

  bookingForm.reset();

  dateInput.min = getLocalDate();


  submitBtn.disabled = false;

  submitBtn.textContent = "Book Service via WhatsApp →";

});
