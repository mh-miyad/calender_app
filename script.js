// document.addEventListener("DOMContentLoaded", () => {
//   const calendarGrid = document.getElementById("calendar-grid");
//   const currentMonthYear = document.getElementById("current-month-year");
//   const prevMonthBtn = document.getElementById("prev-month");
//   const nextMonthBtn = document.getElementById("next-month");
//   const addEventBtn = document.getElementById("add-event-btn");
//   const eventModal = document.getElementById("event-modal");
//   const closeModalBtn = document.querySelector(".close-btn");
//   const eventForm = document.getElementById("event-form");
//   const modalTitle = document.getElementById("modal-title");
//   const saveEventBtn = document.getElementById("save-event-btn");
//   const joinMeetBtn = document.getElementById("join-meet-btn");
//   const rescheduleBtn = document.getElementById("reschedule-btn");
//   const remindersList = document.getElementById("reminders-list");
//   const syncGoogleBtn = document.getElementById("sync-google-btn");
//   const syncOutlookBtn = document.getElementById("sync-outlook-btn");

//   // --- State ---
//   let currentDisplayedDate = new Date(); // Date object for the currently viewed month
//   let events = []; // Array to hold event objects (in a real app, this comes from API/DB)
//   let editingEventId = null; // To track if we are editing an existing event

//   // --- Sample Event Data (Replace with API data in a real app) ---
//   events = [
//     {
//       id: 1,
//       title: "Team Meeting",
//       date: "2025-04-10",
//       time: "10:00",
//       description: "Weekly sync",
//       attendees: "a@ex.com",
//     },
//     {
//       id: 2,
//       title: "Project Demo",
//       date: "2025-04-15",
//       time: "14:30",
//       description: "Showcase progress",
//       attendees: "b@ex.com, c@ex.com",
//     },
//     {
//       id: 3,
//       title: "Lunch w/ Client",
//       date: "2025-04-22",
//       time: "12:00",
//       description: "",
//       attendees: "",
//     },
//   ];

//   // --- Functions ---

//   function renderCalendar(date) {
//     calendarGrid.innerHTML = ""; // Clear previous grid
//     // Add day headers
//     ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
//       const dayHeader = document.createElement("div");
//       dayHeader.classList.add("day-header");
//       dayHeader.textContent = day;
//       calendarGrid.appendChild(dayHeader);
//     });

//     const year = date.getFullYear();
//     const month = date.getMonth(); // 0-indexed

//     currentMonthYear.textContent = `${date.toLocaleString("default", {
//       month: "long",
//     })} ${year}`;

//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const daysInMonth = lastDayOfMonth.getDate();
//     const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday...

//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize today's date

//     // Add empty cells for days before the 1st of the month
//     for (let i = 0; i < startDayOfWeek; i++) {
//       const emptyCell = document.createElement("div");
//       emptyCell.classList.add("calendar-day", "other-month");
//       calendarGrid.appendChild(emptyCell);
//     }

//     // Add day cells for the current month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayCell = document.createElement("div");
//       dayCell.classList.add("calendar-day");
//       const currentDate = new Date(year, month, day);
//       currentDate.setHours(0, 0, 0, 0); // Normalize

//       const dayNumber = document.createElement("span");
//       dayNumber.textContent = day;
//       dayCell.appendChild(dayNumber);
//       dayCell.dataset.date = `${year}-${String(month + 1).padStart(
//         2,
//         "0"
//       )}-${String(day).padStart(2, "0")}`; // YYYY-MM-DD

//       if (currentDate.getTime() === today.getTime()) {
//         dayCell.classList.add("today");
//       }

//       // --- Display events for this day ---
//       const dayEvents = events.filter(
//         (event) => event.date === dayCell.dataset.date
//       );
//       dayEvents.forEach((event) => {
//         const eventElement = document.createElement("div");
//         eventElement.classList.add("event");
//         eventElement.textContent = event.title;
//         eventElement.dataset.eventId = event.id;
//         eventElement.title = `${event.title} at ${event.time}`; // Tooltip
//         eventElement.addEventListener("click", (e) => {
//           e.stopPropagation(); // Prevent day cell click if event is clicked
//           openEventModal(event.id);
//         });
//         dayCell.appendChild(eventElement);
//       });

//       // Add click listener to day cell to add new event for that day
//       dayCell.addEventListener("click", () => {
//         openEventModal(null, dayCell.dataset.date); // Open modal for new event on this date
//       });

//       calendarGrid.appendChild(dayCell);
//     }

//     // Add empty cells for days after the last day of the month to fill the grid
//     const totalCells = startDayOfWeek + daysInMonth;
//     const remainingCells = (7 - (totalCells % 7)) % 7;
//     for (let i = 0; i < remainingCells; i++) {
//       const emptyCell = document.createElement("div");
//       emptyCell.classList.add("calendar-day", "other-month");
//       calendarGrid.appendChild(emptyCell);
//     }

//     renderReminders(); // Update reminders when calendar renders
//   }

//   function renderReminders() {
//     remindersList.innerHTML = ""; // Clear existing reminders
//     const now = new Date();

//     // Filter events happening today or in the future, sort them
//     const upcomingEvents = events
//       .map((event) => ({
//         ...event,
//         dateTime: new Date(`${event.date}T${event.time || "00:00:00"}`),
//       })) // Combine date and time
//       .filter((event) => event.dateTime >= now)
//       .sort((a, b) => a.dateTime - b.dateTime);

//     // Display first few upcoming events as reminders (SIMULATION)
//     upcomingEvents.slice(0, 5).forEach((event) => {
//       const li = document.createElement("li");
//       const timeStr = event.time ? ` at ${event.time}` : "";
//       const dateStr = event.dateTime.toLocaleDateString(undefined, {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       });
//       li.textContent = `Reminder: ${event.title} on ${dateStr}${timeStr}`;
//       // In real app: Use browser Notifications API or backend push notifications
//       remindersList.appendChild(li);
//     });

//     if (remindersList.children.length === 0) {
//       remindersList.innerHTML = "<li>No upcoming reminders.</li>";
//     }
//   }

//   function openEventModal(eventId = null, prefillDate = null) {
//     eventForm.reset(); // Clear form
//     editingEventId = eventId;

//     if (eventId) {
//       // Editing existing event
//       const event = events.find((e) => e.id === eventId);
//       if (!event) return;

//       modalTitle.textContent = "Edit Event";
//       document.getElementById("event-title").value = event.title;
//       document.getElementById("event-date").value = event.date;
//       document.getElementById("event-time").value = event.time || "";
//       document.getElementById("event-description").value =
//         event.description || "";
//       document.getElementById("event-attendees").value = event.attendees || "";
//       joinMeetBtn.style.display = "inline-block"; // Show simulated buttons
//       rescheduleBtn.style.display = "inline-block";
//       saveEventBtn.textContent = "Update Event";
//     } else {
//       // Adding new event
//       modalTitle.textContent = "Add New Event";
//       if (prefillDate) {
//         document.getElementById("event-date").value = prefillDate;
//       } else {
//         // Prefill with today's date if no specific date clicked
//         const today = new Date().toISOString().split("T")[0];
//         document.getElementById("event-date").value = today;
//       }
//       joinMeetBtn.style.display = "none"; // Hide buttons for new events
//       rescheduleBtn.style.display = "none";
//       saveEventBtn.textContent = "Save Event";
//     }

//     eventModal.style.display = "block";
//   }

//   function closeEventModal() {
//     eventModal.style.display = "none";
//   }

//   function handleFormSubmit(e) {
//     e.preventDefault(); // Prevent default form submission

//     const newEventData = {
//       // id will be assigned below
//       title: document.getElementById("event-title").value,
//       date: document.getElementById("event-date").value,
//       time: document.getElementById("event-time").value,
//       description: document.getElementById("event-description").value,
//       attendees: document.getElementById("event-attendees").value,
//     };

//     if (!newEventData.title || !newEventData.date) {
//       alert("Please provide at least a title and date.");
//       return;
//     }

//     if (editingEventId) {
//       // Update existing event
//       const index = events.findIndex((e) => e.id === editingEventId);
//       if (index > -1) {
//         events[index] = { ...events[index], ...newEventData }; // Merge updates
//       }
//     } else {
//       // Add new event
//       newEventData.id = Date.now(); // Simple unique ID (use UUID in real app)
//       events.push(newEventData);
//     }

//     console.log("Events Array (Simulated Save):", events); // Log the updated array
//     alert("Event saved! (Simulation - not sent to Google/Outlook)"); // User feedback

//     closeEventModal();
//     renderCalendar(currentDisplayedDate); // Re-render calendar with new/updated event
//     renderReminders(); // Update reminders list
//   }

//   // --- Event Listeners ---
//   prevMonthBtn.addEventListener("click", () => {
//     currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() - 1);
//     renderCalendar(currentDisplayedDate);
//   });

//   nextMonthBtn.addEventListener("click", () => {
//     currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() + 1);
//     renderCalendar(currentDisplayedDate);
//   });

//   addEventBtn.addEventListener("click", () => openEventModal());

//   closeModalBtn.addEventListener("click", closeEventModal);

//   // Close modal if clicking outside the modal content
//   window.addEventListener("click", (e) => {
//     if (e.target === eventModal) {
//       closeEventModal();
//     }
//   });

//   eventForm.addEventListener("submit", handleFormSubmit);

//   // --- Simulated API/AI Button Actions ---
//   joinMeetBtn.addEventListener("click", () => {
//     // In a real app, you'd get the meeting link from the event data (if integrated)
//     alert(
//       "Simulating joining Google Meet/Teams call... (No actual call initiated)"
//     );
//     // window.open('https://meet.google.com/...', '_blank'); // Example placeholder action
//   });

//   rescheduleBtn.addEventListener("click", () => {
//     if (!editingEventId) return;
//     const event = events.find((e) => e.id === editingEventId);
//     alert(
//       `Simulating AI rescheduling for "${event.title}"...\n\nSuggested new time: Tomorrow at 11:00 AM (Placeholder). \n\n(This requires complex backend logic and API access in a real app)`
//     );
//     // In a real app:
//     // 1. Send request to backend with event details and constraints.
//     // 2. Backend uses AI/algorithms and checks Google/Outlook calendars via API.
//     // 3. Backend returns suggestions.
//     // 4. Frontend displays suggestions for user to choose.
//     // 5. User selects, frontend sends update request to backend.
//     // 6. Backend updates the event via API.
//     closeEventModal(); // Close modal after simulation
//   });

//   syncGoogleBtn.addEventListener("click", () => {
//     alert(
//       "Simulating Google Calendar connection... \n(Requires OAuth 2.0 and backend handling in a real app)"
//     );
//     // In real app: Initiate OAuth flow redirecting to Google
//   });

//   syncOutlookBtn.addEventListener("click", () => {
//     alert(
//       "Simulating Outlook Calendar connection... \n(Requires OAuth 2.0 and backend handling in a real app)"
//     );
//     // In real app: Initiate OAuth flow redirecting to Microsoft
//   });

//   // --- Initial Render ---
//   renderCalendar(currentDisplayedDate);
// });
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM References (more organized) ---
  const calendarGrid = document.getElementById("calendar-grid");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const addEventBtn = document.getElementById("add-event-btn");
  const remindersList = document.getElementById("reminders-list");
  const syncGoogleBtn = document.getElementById("sync-google-btn");
  const syncOutlookBtn = document.getElementById("sync-outlook-btn");

  // Modal Elements
  const eventModal = document.getElementById("event-modal");
  const closeModalBtn = eventModal.querySelector(".close-btn");
  const eventForm = document.getElementById("event-form");
  const modalTitle = document.getElementById("modal-title");
  const eventTitleInput = document.getElementById("event-title");
  const eventStartDateInput = document.getElementById("event-start-date");
  const eventEndDateInput = document.getElementById("event-end-date"); // New end date input
  const eventTimeInput = document.getElementById("event-time");
  const eventDescriptionInput = document.getElementById("event-description");
  const eventAttendeesInput = document.getElementById("event-attendees");
  const saveEventBtn = document.getElementById("save-event-btn");
  const joinMeetBtn = document.getElementById("join-meet-btn");
  const rescheduleBtn = document.getElementById("reschedule-btn");
  const deleteEventBtn = document.getElementById("delete-event-btn"); // Delete button

  // --- State ---
  let currentDisplayedDate = new Date(); // Use current real date initially
  let events = []; // Array to hold event objects {id, title, startDate, endDate?, time?, description?, attendees?}
  let editingEventId = null;

  // --- Sample Event Data (Includes multi-day example) ---
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  events = [
    {
      id: 1,
      title: "Team Meeting",
      startDate: todayStr,
      endDate: null,
      time: "10:00",
      description: "Weekly sync",
      attendees: "a@ex.com",
    },
    {
      id: 2,
      title: "Project Alpha Conf",
      startDate: tomorrowStr,
      endDate: nextWeekStr,
      time: null,
      description: "Conference duration",
      attendees: "b@ex.com, c@ex.com",
    }, // Multi-day
    {
      id: 3,
      title: "Lunch w/ Client",
      startDate: nextWeekStr,
      endDate: null,
      time: "12:00",
      description: "",
      attendees: "",
    },
    // Add more sample data as needed
  ];

  // --- Functions ---

  function renderCalendar(date) {
    calendarGrid.innerHTML = ""; // Clear previous grid
    // Add day headers
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.classList.add("day-header");
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed

    currentMonthYear.textContent = `${date.toLocaleString("default", {
      month: "long",
    })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Add empty cells for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day", "other-month");
      calendarGrid.appendChild(emptyCell);
    }

    // Add day cells for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("calendar-day");
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0); // Normalize cell date
      const cellDateStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      dayCell.dataset.date = cellDateStr; // YYYY-MM-DD

      const dayNumber = document.createElement("span");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      // Add container for events within the day cell
      const eventsContainer = document.createElement("div");
      eventsContainer.classList.add("events-container");
      dayCell.appendChild(eventsContainer);

      if (cellDate.getTime() === today.getTime()) {
        dayCell.classList.add("today");
      }

      // --- Display events for this day (including multi-day) ---
      events.forEach((event) => {
        const eventStartDate = new Date(event.startDate + "T00:00:00"); // Ensure comparison at start of day
        const eventEndDate = event.endDate
          ? new Date(event.endDate + "T00:00:00")
          : eventStartDate; // Use start date if no end date

        if (cellDate >= eventStartDate && cellDate <= eventEndDate) {
          const eventElement = document.createElement("div");
          eventElement.classList.add("event");
          eventElement.textContent = event.title;
          eventElement.dataset.eventId = event.id;
          eventElement.title = `${event.title}${
            event.time ? " at " + event.time : ""
          } (${event.startDate}${event.endDate ? " to " + event.endDate : ""})`;

          // Add classes for multi-day styling
          if (event.endDate && event.startDate !== event.endDate) {
            if (cellDateStr === event.startDate)
              eventElement.classList.add("multi-day-start");
            else if (cellDateStr === event.endDate)
              eventElement.classList.add("multi-day-end");
            else eventElement.classList.add("multi-day-middle");
          }

          eventElement.addEventListener("click", (e) => {
            e.stopPropagation();
            openEventModal(event.id);
          });
          // dayCell.appendChild(eventElement); // Original position
          eventsContainer.appendChild(eventElement); // Append to container
        }
      });

      // Add click listener to day cell to add new event for that day
      dayCell.addEventListener("click", () => {
        openEventModal(null, dayCell.dataset.date); // Open modal for new event
      });

      calendarGrid.appendChild(dayCell);
    }

    // Add empty cells for days after the last day
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day", "other-month");
      calendarGrid.appendChild(emptyCell);
    }

    renderReminders();
  }

  function renderReminders() {
    remindersList.innerHTML = "";
    const now = new Date();

    // Combine start date and time for comparison, handle null time
    const getDateTime = (event) => {
      const timePart = event.time || "00:00:00";
      // Handle potential invalid date strings if needed, basic approach here:
      try {
        return new Date(`${event.startDate}T${timePart}`);
      } catch (e) {
        console.error("Error parsing date/time for event:", event, e);
        return new Date(0); // Return epoch to sort it early/filter out
      }
    };

    const upcomingEvents = events
      .map((event) => ({ ...event, dateTime: getDateTime(event) }))
      .filter(
        (event) => event.dateTime >= now && event.dateTime.getTime() !== 0
      ) // Filter past and invalid dates
      .sort((a, b) => a.dateTime - b.dateTime);

    upcomingEvents.slice(0, 5).forEach((event) => {
      const li = document.createElement("li");
      const timeStr = event.time ? ` at ${event.time}` : " (All day)";
      const dateStr = event.dateTime.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      li.textContent = `${event.title} - ${dateStr}${timeStr}`;
      if (event.endDate && event.startDate !== event.endDate) {
        li.textContent += ` (until ${event.endDate})`;
      }

      remindersList.appendChild(li);
    });

    if (remindersList.children.length === 0) {
      remindersList.innerHTML = "<li>No upcoming events.</li>";
    }
  }

  function openEventModal(eventId = null, prefillDate = null) {
    eventForm.reset();
    editingEventId = eventId;
    deleteEventBtn.style.display = "none"; // Hide delete initially
    joinMeetBtn.style.display = "none";
    rescheduleBtn.style.display = "none";

    if (eventId) {
      // Editing existing event
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      modalTitle.textContent = "Edit Event";
      eventTitleInput.value = event.title;
      eventStartDateInput.value = event.startDate;
      eventEndDateInput.value = event.endDate || ""; // Handle null end date
      eventTimeInput.value = event.time || "";
      eventDescriptionInput.value = event.description || "";
      eventAttendeesInput.value = event.attendees || "";

      joinMeetBtn.style.display = "inline-block";
      rescheduleBtn.style.display = "inline-block";
      deleteEventBtn.style.display = "inline-block"; // Show delete btn
      saveEventBtn.textContent = "Update Event";
    } else {
      // Adding new event
      modalTitle.textContent = "Create Event";
      if (prefillDate) {
        eventStartDateInput.value = prefillDate;
      } else {
        eventStartDateInput.value = new Date().toISOString().split("T")[0]; // Default to today
      }
      eventEndDateInput.value = ""; // Ensure end date is empty for new events
      saveEventBtn.textContent = "Save Event";
    }

    // eventModal.style.display = 'block'; // Original way
    eventModal.style.display = "flex"; // Use flex for centering defined in CSS
  }

  function closeEventModal() {
    eventModal.style.display = "none";
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const startDate = eventStartDateInput.value;
    const endDate = eventEndDateInput.value; // Might be empty

    // Validation: Ensure end date is not before start date if provided
    if (endDate && startDate && endDate < startDate) {
      alert("End date cannot be before the start date.");
      return;
    }

    const eventData = {
      title: eventTitleInput.value,
      startDate: startDate,
      endDate: endDate || null, // Store null if empty
      time: eventTimeInput.value || null, // Store null if empty (all-day)
      description: eventDescriptionInput.value,
      attendees: eventAttendeesInput.value,
    };

    if (!eventData.title || !eventData.startDate) {
      alert("Please provide at least a title and start date.");
      return;
    }

    if (editingEventId) {
      // Update existing event
      const index = events.findIndex((e) => e.id === editingEventId);
      if (index > -1) {
        events[index] = { ...events[index], ...eventData };
        console.log("Event Updated (Simulated):", events[index]);
      }
    } else {
      // Add new event
      eventData.id = Date.now(); // Simple unique ID
      events.push(eventData);
      console.log("Event Added (Simulated):", eventData);
    }

    alert("Event saved! (Simulation - not sent to Google/Outlook)");

    closeEventModal();
    renderCalendar(currentDisplayedDate);
  }

  function handleDeleteEvent() {
    if (!editingEventId) return;

    if (confirm("Are you sure you want to delete this event?")) {
      events = events.filter((e) => e.id !== editingEventId);
      console.log("Event Deleted (Simulated), ID:", editingEventId);
      alert("Event deleted! (Simulation)");
      closeEventModal();
      renderCalendar(currentDisplayedDate);
    }
  }

  // --- Event Listeners ---
  prevMonthBtn.addEventListener("click", () => {
    currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() - 1);
    renderCalendar(currentDisplayedDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() + 1);
    renderCalendar(currentDisplayedDate);
  });

  addEventBtn.addEventListener("click", () => openEventModal());

  closeModalBtn.addEventListener("click", closeEventModal);

  // Close modal if clicking backdrop (since modal itself is centered now)
  eventModal.addEventListener("click", (e) => {
    if (e.target === eventModal) {
      // Check if click is on the backdrop itself
      closeEventModal();
    }
  });

  eventForm.addEventListener("submit", handleFormSubmit);
  deleteEventBtn.addEventListener("click", handleDeleteEvent);

  // --- Simulated API/AI Button Actions (Keep these for context) ---
  joinMeetBtn.addEventListener("click", () => {
    alert("Simulating joining Google Meet/Teams call...");
  });

  rescheduleBtn.addEventListener("click", () => {
    if (!editingEventId) return;
    const event = events.find((e) => e.id === editingEventId);
    alert(
      `Simulating AI rescheduling for "${event.title}"...\n\nSuggested new time: Tomorrow at 11:00 AM (Placeholder).\n(Requires complex backend logic)`
    );
    closeEventModal();
  });

  syncGoogleBtn.addEventListener("click", () => {
    alert(
      "Simulating Google Calendar connection... (Requires OAuth 2.0 and backend)"
    );
  });

  syncOutlookBtn.addEventListener("click", () => {
    alert(
      "Simulating Outlook Calendar connection... (Requires OAuth 2.0 and backend)"
    );
  });

  // --- Initial Render ---
  renderCalendar(currentDisplayedDate);
});
