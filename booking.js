// booking.js - Simple simulation for booking page clone

document.addEventListener("DOMContentLoaded", () => {
  const timeSlotsContainer = document.getElementById("time-slots");
  const bookingFormSection = document.getElementById("booking-form-section");
  const selectedSlotDisplay = document.getElementById("selected-slot-display");
  const bookingForm = document.getElementById("booking-form");
  const confirmationMessage = document.getElementById("confirmation-message");
  const calendarSection = document.querySelector(".calendar-section");
  const cancelSelectionBtn = document.getElementById("cancel-selection-btn");
  const bookAnotherBtn = document.getElementById("book-another-btn");
  const timezoneDisplay = document.getElementById("user-timezone");
  const selectedDateDisplay = document.getElementById("selected-date");
  const prevDayBtn = document.getElementById("prev-day");
  const nextDayBtn = document.getElementById("next-day");

  let currentSimulatedDate = new Date(2025, 3, 3); // Start simulation on Apr 3, 2025
  let selectedTimeSlot = null;

  // --- Display User Timezone ---
  try {
    timezoneDisplay.textContent =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    timezoneDisplay.textContent = "Couldn't detect";
  }

  // --- Generate Sample Time Slots ---
  function generateTimeSlots(date) {
    timeSlotsContainer.innerHTML = ""; // Clear existing
    selectedDateDisplay.textContent = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Simulate fewer slots on weekends or based on day
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
    let availableTimes = [];
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      // Weekdays
      availableTimes = [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "03:30 PM",
        "04:00 PM",
      ];
    } else {
      // Weekends (fewer slots)
      availableTimes = ["10:00 AM", "10:30 AM", "11:00 AM"];
    }

    // Simple simulation: disable past times if the date is today
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    availableTimes.forEach((time) => {
      const slotBtn = document.createElement("button");
      slotBtn.classList.add("time-slot-btn");
      slotBtn.textContent = time;
      slotBtn.dataset.time = time;
      slotBtn.dataset.date = date.toISOString().split("T")[0]; // Store date with slot

      // Disable past time slots for today
      if (isToday) {
        const [hourMinute, period] = time.split(" ");
        let [hour, minute] = hourMinute.split(":").map(Number);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0; // Midnight case

        if (
          now.getHours() > hour ||
          (now.getHours() === hour && now.getMinutes() >= minute)
        ) {
          slotBtn.disabled = true;
        }
      }

      slotBtn.addEventListener("click", () => {
        // Remove selection from others
        document
          .querySelectorAll(".time-slot-btn.selected")
          .forEach((btn) => btn.classList.remove("selected"));
        // Select current
        slotBtn.classList.add("selected");
        selectedTimeSlot = `${slotBtn.dataset.date} at ${slotBtn.dataset.time}`;
        selectedSlotDisplay.textContent = `${date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })} at ${time}`;
        // Show booking form
        bookingFormSection.style.display = "block";
      });
      timeSlotsContainer.appendChild(slotBtn);
    });

    if (availableTimes.length === 0) {
      timeSlotsContainer.innerHTML = "<p>No available slots for this day.</p>";
    }

    // Disable prev button if date is today or earlier (adjust as needed)
    const todayCheck = new Date();
    todayCheck.setHours(0, 0, 0, 0);
    prevDayBtn.disabled = date <= todayCheck;
  }

  // --- Handle Date Navigation ---
  prevDayBtn.addEventListener("click", () => {
    currentSimulatedDate.setDate(currentSimulatedDate.getDate() - 1);
    generateTimeSlots(currentSimulatedDate);
    bookingFormSection.style.display = "none"; // Hide form on date change
  });

  nextDayBtn.addEventListener("click", () => {
    currentSimulatedDate.setDate(currentSimulatedDate.getDate() + 1);
    generateTimeSlots(currentSimulatedDate);
    bookingFormSection.style.display = "none"; // Hide form on date change
  });

  // --- Handle Booking Form Submission (Simulation) ---
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      alert("Please select a time slot first.");
      return;
    }
    const name = document.getElementById("booker-name").value;
    const email = document.getElementById("booker-email").value;

    // Hide form and calendar, show confirmation
    calendarSection.style.display = "none";
    bookingFormSection.style.display = "none";
    confirmationMessage.style.display = "block";
    document.getElementById("confirmed-name").textContent = name;
    document.getElementById("confirmed-slot").textContent =
      selectedTimeSlot.replace(" at ", " on "); // Format display

    console.log("Booking Simulated:", { name, email, slot: selectedTimeSlot });
    alert(
      "Booking Confirmed (Simulation)!\nNo actual event created or email sent."
    );
  });

  // --- Handle Cancel Selection ---
  cancelSelectionBtn.addEventListener("click", () => {
    selectedTimeSlot = null;
    document
      .querySelectorAll(".time-slot-btn.selected")
      .forEach((btn) => btn.classList.remove("selected"));
    bookingFormSection.style.display = "none";
  });

  // --- Handle Book Another ---
  bookAnotherBtn.addEventListener("click", () => {
    confirmationMessage.style.display = "none";
    calendarSection.style.display = "block";
    bookingForm.reset();
    selectedTimeSlot = null;
    // Optionally regenerate slots for current date or reset date
    generateTimeSlots(currentSimulatedDate);
  });

  // --- Initial Load ---
  generateTimeSlots(currentSimulatedDate);
});
