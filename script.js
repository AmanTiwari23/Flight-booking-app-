
// Set the default tab to "round-trip" when page loads
let currentTab = "round-trip";

// Wait for the page to fully load before running our code
document.addEventListener("DOMContentLoaded", function () {
  
  // Authentication elements
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  
  // Flight search elements
  const flightSearchForm = document.getElementById("flightSearchForm");
  const flightResults = document.getElementById("flightResults");
  const resultsContainer = document.getElementById("resultsContainer");
  
  // Booking elements
  const bookingForm = document.getElementById("bookingForm");
  const passengerDetailsForm = document.getElementById("passengerDetailsForm");
  const passengerFields = document.getElementById("passengerFields");
  const returnField = document.getElementById("return").closest(".form-group");


  // Prepare data storage
  setupInitialData();
  
  // Set up all the click handlers and event listeners
  setupAllEventListeners();
  
  // Update login/logout buttons based on if user is logged in
  updateLoginButtons();
  
  // Load flight and trip data from JSON files
  loadFlightData();


  // Sets up initial data in localStorage if it doesn't exist
   
  function setupInitialData() {
    // Create empty users array if it doesn't exist
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    
    // Set current user to null (not logged in) if it doesn't exist
    if (!localStorage.getItem("currentUser")) {
      localStorage.setItem("currentUser", JSON.stringify(null));
    }
    
    // Create empty bookings array if it doesn't exist
    if (!localStorage.getItem("bookings")) {
      localStorage.setItem("bookings", JSON.stringify([]));
    }
  }

  // Loads flight and trip data from JSON files
  
  function loadFlightData() {
    // Load flight data from flight-data.json
    fetch("flight-data.json")
      .then((response) => response.json())
      .then((data) => {
        // Save flight data to window object so we can access it everywhere
        window.flightData = data.flights;
        // Show popular destinations on the page
        showPopularDestinations();
      });

    // Load trip ideas from trip-ideas.json
    fetch("trip-ideas.json")
      .then((response) => response.json())
      .then((data) => {
        // Save trip ideas to window object
        window.tripIdeas = data.tripIdeas;
        // Show trip ideas on the page
        showTripIdeas();
      });
  }

  // Sets up all event listeners for buttons and forms
  
  function setupAllEventListeners() {
   
    // Authentication buttons
    
    loginBtn.addEventListener("click", () => showModal(loginModal));
    signupBtn.addEventListener("click", () => showModal(signupModal));

    // Close buttons for modals (X in top-right corner)
    document.querySelectorAll(".close").forEach((button) => {
      button.addEventListener("click", function () {
        hideModal(this.closest(".modal"));
      });
    });

    // Switch between login and signup forms
    document.getElementById("showSignup").addEventListener("click", function (e) {
      e.preventDefault();
      hideModal(loginModal);
      showModal(signupModal);
    });

    document.getElementById("showLogin").addEventListener("click", function (e) {
      e.preventDefault();
      hideModal(signupModal);
      showModal(loginModal);
    });

    
    // Form submissions
    
    signupForm.addEventListener("submit", handleSignup);
    loginForm.addEventListener("submit", handleLogin);
    flightSearchForm.addEventListener("submit", searchForFlights);
    passengerDetailsForm.addEventListener("submit", completeBooking);

   
    // Navigation buttons
   
    document.getElementById("backToResults").addEventListener("click", function () {
      bookingForm.style.display = "none";
      flightResults.style.display = "block";
    });

    document.getElementById("viewBookingBtn").addEventListener("click", function () {
      document.getElementById("confirmation").style.display = "none";
      showUserBookings();
    });

    document.getElementById("newSearchBtn").addEventListener("click", function () {
      document.getElementById("confirmation").style.display = "none";
      flightSearchForm.style.display = "grid";
      flightResults.style.display = "none";
      window.scrollTo(0, 0); // Scroll to top of page
    });

    
    
    // Tab switching (one-way/round-trip)
   
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");
        // Update current tab variable
        currentTab = this.textContent.toLowerCase().replace(" ", "-");
        // Show/hide return date field based on tab
        returnField.style.display = currentTab === "one-way" ? "none" : "flex";
      });
    });

    
    // Navigation links
  
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        
        // Update active link styling
        document.querySelectorAll(".nav-links a").forEach((l) => l.classList.remove("active"));
        this.classList.add("active");

        if (this.textContent === "My Bookings") {
          showUserBookings();
        } else {
          // Show search form and hide other sections
          document.getElementById("myBookings").style.display = "none";
          document.getElementById("flightResults").style.display = "none";
          document.getElementById("bookingForm").style.display = "none";
          document.getElementById("confirmation").style.display = "none";
          document.getElementById("flightSearchForm").style.display = "grid";
        }
      });
    });
  }


  // Shows a modal/popup window
   
  function showModal(modal) {
    modal.style.display = "block";
  }

  // Hides a modal/popup window
   
  function hideModal(modal) {
    modal.style.display = "none";
  }

  
  // Handles user signup form submission
   
  function handleSignup(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users"));

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      alert("User with this email already exists!");
      return;
    }

    // Add new user to the users array
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    
    // Set this user as the current logged in user
    localStorage.setItem("currentUser", JSON.stringify({ name, email }));

    alert("Sign up successful! You are now logged in.");
    hideModal(signupModal);
    updateLoginButtons();
  }

  // Handles user login form submission
   
  function handleLogin(e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users"));
    
    // Find user with matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Login successful - set current user
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ name: user.name, email: user.email })
      );
      alert("Login successful!");
      hideModal(loginModal);
      updateLoginButtons();
    } else {
      alert("Invalid email or password!");
    }
  }

  // Logs out the current user
   
  function logout() {
    localStorage.setItem("currentUser", JSON.stringify(null));
    updateLoginButtons();
  }

  // Updates the login/logout buttons based on whether a user is logged in
  
  function updateLoginButtons() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const authButtons = document.querySelector(".auth-buttons");

    if (currentUser) {
      // User is logged in - show welcome message and logout button
      authButtons.innerHTML = `
        <span>Welcome, ${currentUser.name}</span>
        <button id="myBookingsBtn">My Bookings</button>
        <button id="logoutBtn">Logout</button>
      `;

      // Add event listeners to the new buttons
      document.getElementById("logoutBtn").addEventListener("click", logout);
      document.getElementById("myBookingsBtn").addEventListener("click", showUserBookings);
    } else {
      // User is not logged in - show login/signup buttons
      authButtons.innerHTML = `
        <button id="loginBtn">Login</button>
        <button id="signupBtn">Sign Up</button>
      `;

      // Add event listeners to the new buttons
      document.getElementById("loginBtn").addEventListener("click", () => showModal(loginModal));
      document.getElementById("signupBtn").addEventListener("click", () => showModal(signupModal));
    }
  }



  // Handles flight search form submission
   
  function searchForFlights(e) {
    e.preventDefault();

    // Get form values
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const departure = document.getElementById("departure").value;
    const returnDate = currentTab === "round-trip" 
      ? document.getElementById("return").value 
      : null;
    const passengers = document.getElementById("passengers").value;
    const flightClass = document.getElementById("class").value;

    // Find matching flights based on search criteria
    const flights = findFlights(
      from,
      to,
      departure,
      returnDate,
      passengers,
      flightClass,
      currentTab
    );

    // Display the search results
    showFlightResults(flights);
  }

  // Finds flights matching the search criteria
  
  function findFlights(from, to, departure, returnDate, passengers, flightClass, tripType) {
    if (!window.flightData) return [];

    // Map city names to airport codes (so users can search by city name or airport code)
    const cityCodes = {
      delhi: "DEL",
      mumbai: "BOM",
      bangalore: "BLR",
      hyderabad: "HYD",
      chennai: "MAA",
      kolkata: "CCU",
      goa: "GOI",
      chandigarh: "IXC",
    };

    // Get airport codes (accepts both city names and airport codes)
    const fromCode = cityCodes[from.toLowerCase()] || from.toUpperCase();
    const toCode = cityCodes[to.toLowerCase()] || to.toUpperCase();

    // Filter flights to find matches
    return window.flightData.filter((flight) => {
      // Check departure and arrival cities match
      const matchesFrom = flight.from === fromCode;
      const matchesTo = flight.to === toCode;

      // Check flight class matches
      const matchesClass = flight.class === flightClass;

      // Check if flight operates on selected day
      const departureDate = new Date(departure);
      const dayName = departureDate.toLocaleDateString("en-US", { weekday: "long" });
      const matchesDay = flight.days.includes("Daily") || flight.days.includes(dayName);

      // Only include flights that match all criteria
      return matchesFrom && matchesTo && matchesClass && matchesDay;
    });
  }

  
  // Displays flight search results on the page
   
  function showFlightResults(flights) {
    // Clear previous results
    resultsContainer.innerHTML = "";

    if (flights.length === 0) {
      // No flights found - show message
      resultsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-plane-slash"></i>
          <h3>No flights found</h3>
          <p>Try different dates or destinations</p>
          <button id="modifySearch">Modify Search</button>
        </div>
      `;

      // Add click handler to modify search button
      document.getElementById("modifySearch").addEventListener("click", function () {
        flightResults.style.display = "none";
        flightSearchForm.style.display = "grid";
        window.scrollTo(0, 0);
      });
    } else {
      // Display each flight result
      flights.forEach((flight) => {
        const flightCard = document.createElement("div");
        flightCard.className = "flight-card";
        flightCard.innerHTML = `
          <div class="flight-info">
            <img src="${flight.airline.logo}" alt="${flight.airline.name}" class="airline-logo">
            <div class="flight-details">
              <h3>${flight.airline.name}</h3>
              <p>${flight.flightNumber} • ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}</p>
            </div>
          </div>
          <div class="flight-time">
            <p>${flight.departure}</p>
            <p>${flight.from}</p>
          </div>
          <div class="flight-duration">
            <p>${flight.duration}</p>
          </div>
          <div class="flight-time">
            <p>${flight.arrival}</p>
            <p>${flight.to}</p>
          </div>
          <div class="flight-price">
            <h3>₹${flight.price}</h3>
            <button class="book-btn" data-flight-id="${flight.id}">Book Now</button>
          </div>
        `;

        resultsContainer.appendChild(flightCard);
      });

      // Add click handlers to all "Book Now" buttons
      document.querySelectorAll(".book-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const flightId = this.getAttribute("data-flight-id");
          const flight = flights.find((f) => f.id === flightId);
          showBookingForm(flight);
        });
      });
    }

    // Show results section and hide search form
    flightSearchForm.style.display = "none";
    flightResults.style.display = "block";
  }

 
  // Shows the booking form for a selected flight
   
  function showBookingForm(flight) {
    // Hide results and show booking form
    flightResults.style.display = "none";
    bookingForm.style.display = "block";

    // Store selected flight for later use
    window.selectedFlight = flight;

    // Get number of passengers from search form
    const passengerCount = document.getElementById("passengers").value;
    
    // Clear any previous passenger fields
    passengerFields.innerHTML = "";

    // Create form fields for each passenger
    for (let i = 1; i <= passengerCount; i++) {
      const passengerField = document.createElement("div");
      passengerField.className = "passenger-field";
      passengerField.innerHTML = `
        <div class="form-group">
          <label for="passenger${i}-name">Passenger ${i} Name</label>
          <input type="text" id="passenger${i}-name" required>
        </div>
        <div class="form-group">
          <label for="passenger${i}-gender">Gender</label>
          <select id="passenger${i}-gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="passenger${i}-age">Age</label>
          <input type="number" id="passenger${i}-age" min="1" max="120" required>
        </div>
        <div class="form-group">
          <label for="passenger${i}-passport">Passport Number</label>
          <input type="text" id="passenger${i}-passport" required>
        </div>
      `;
      passengerFields.appendChild(passengerField);
    }
  }

  // Completes the booking process when form is submitted
   
  function completeBooking(e) {
    e.preventDefault();

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login to complete your booking!");
      showModal(loginModal);
      return;
    }

    // Get number of passengers
    const passengerCount = document.getElementById("passengers").value;
    const passengers = [];

    // Collect details for each passenger
    for (let i = 1; i <= passengerCount; i++) {
      passengers.push({
        name: document.getElementById(`passenger${i}-name`).value,
        gender: document.getElementById(`passenger${i}-gender`).value,
        age: document.getElementById(`passenger${i}-age`).value,
        passport: document.getElementById(`passenger${i}-passport`).value,
      });
    }

    // Create booking object with all details
    const booking = {
      id: `booking-${Date.now()}`, // Create unique booking ID
      flight: window.selectedFlight,
      passengers,
      contact: {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
      },
      userEmail: currentUser.email,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings"));
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Show confirmation page
    showBookingConfirmation(booking);
  }

  // Shows booking confirmation page
   
  function showBookingConfirmation(booking) {
    // Hide booking form and show confirmation
    bookingForm.style.display = "none";
    confirmation.style.display = "block";

    // Display booking details on confirmation page
    confirmationDetails.innerHTML = `
      <p>Your booking from <strong>${booking.flight.from}</strong> to <strong>${
      booking.flight.to
    }</strong> on <strong>${new Date(
      booking.flight.date
    ).toDateString()}</strong> has been confirmed.</p>
      <p>Booking Reference: <strong>${booking.id}</strong></p>
      <p>Total Amount: <strong>₹${
        booking.flight.price * booking.passengers.length
      }</strong></p>
    `;
  }

 
   // Shows all bookings for the current user
  
  function showUserBookings() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login to view your bookings!");
      showModal(loginModal);
      return;
    }

    // Get all bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings"));
    
    // Filter to only show bookings for current user
    const userBookings = bookings.filter(
      (booking) => booking.userEmail === currentUser.email
    );

    if (userBookings.length === 0) {
      // No bookings found
      bookingsContainer.innerHTML = "<p>You have no bookings yet.</p>";
    } else {
      // Display each booking
      bookingsContainer.innerHTML = userBookings
        .map(
          (booking) => `
            <div class="booking-card">
              <div class="flight-info">
                <img src="${booking.flight.airline.logo}" alt="${
            booking.flight.airline.name
          }" class="airline-logo">
                <div class="flight-details">
                  <h3>${booking.flight.airline.name} - ${
            booking.flight.flightNumber
          }</h3>
                  <p>${booking.flight.from} to ${
            booking.flight.to
          }</p>
                  <p>${new Date(
                    booking.flight.date
                  ).toDateString()} • ${
            booking.passengers.length
          } Passenger(s)</p>
                </div>
              </div>
              <div class="flight-time">
                <p>${booking.flight.departure}</p>
                <p>${booking.flight.arrival}</p>
              </div>
              <div class="flight-price">
                <h3>₹${
                  booking.flight.price * booking.passengers.length
                }</h3>
                <p>Status: <span class="status-${booking.status}">${
            booking.status
          }</span></p>
              </div>
              <div class="flight-actions">
                <button class="view-details-btn" data-booking-id="${
                  booking.id
                }">View Details</button>
                <button class="cancel-btn" data-booking-id="${
                  booking.id
                }">Cancel</button>
              </div>
            </div>
          `
        )
        .join("");
    }

    // Show bookings section and hide other sections
    flightSearchForm.style.display = "none";
    flightResults.style.display = "none";
    bookingForm.style.display = "none";
    confirmation.style.display = "none";
    myBookings.style.display = "block";

    // Add click handlers to view details buttons
    document.querySelectorAll(".view-details-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const bookingId = this.getAttribute("data-booking-id");
        const booking = userBookings.find((b) => b.id === bookingId);
        showBookingDetails(booking);
      });
    });

    // Add click handlers to cancel buttons
    document.querySelectorAll(".cancel-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const bookingId = this.getAttribute("data-booking-id");
        cancelUserBooking(bookingId);
      });
    });
  }

  // Shows details for a specific booking
   
  function showBookingDetails(booking) {
    alert(
      `Booking Details:\n\nFlight: ${booking.flight.airline.name} ${
        booking.flight.flightNumber
      }\nFrom: ${booking.flight.from}\nTo: ${
        booking.flight.to
      }\nDate: ${new Date(booking.flight.date).toDateString()}\nPassengers: ${
        booking.passengers.length
      }\nTotal: ₹${booking.flight.price * booking.passengers.length}`
    );
  }

  // Cancels a user booking
   
  function cancelUserBooking(bookingId) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const bookings = JSON.parse(localStorage.getItem("bookings"));
      const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

      if (bookingIndex !== -1) {
        // Update booking status to cancelled
        bookings[bookingIndex].status = "cancelled";
        localStorage.setItem("bookings", JSON.stringify(bookings));
        alert("Booking cancelled successfully!");
        
        // Refresh the bookings display
        showUserBookings();
      }
    }
  }

   // Shows popular destinations on the homepage
  
  function showPopularDestinations() {
    const destinationsGrid = document.getElementById("destinationsGrid");
    if (!destinationsGrid || !window.flightData) return;

    // Map of airport codes to image filenames
    const cityImages = {
      DEL: "delhi.jpeg",
      BOM: "mumbai.jpeg",
      BLR: "bangalore.jpg",
      HYD: "hyderabad.jpeg",
      MAA: "chennai.jpeg",
      CCU: "kolkata.jpeg",
      GOI: "goa.jpeg",
      IXC: "chandigarh.jpeg",
    };

    const destinations = {};

    // Process flight data to find cheapest flights to each destination
    window.flightData.forEach((flight) => {
      if (!destinations[flight.to]) {
        // First time seeing this destination
        destinations[flight.to] = {
          code: flight.to,
          name: getCityName(flight.to),
          price: flight.price,
          airline: flight.airline.name,
          image: cityImages[flight.to] || "default.jpg", // Use mapped image or default
        };
      } else if (flight.price < destinations[flight.to].price) {
        // Found a cheaper flight to this destination
        destinations[flight.to].price = flight.price;
      }
    });

    // Generate HTML for each destination card
    destinationsGrid.innerHTML = Object.values(destinations)
      .map(
        (dest) => `
        <div class="destination-card">
          <img src="images/${dest.image}" alt="${dest.name}" class="destination-image">
          <div class="destination-info">
            <h3>${dest.name} (${dest.code})</h3>
            <p>From Delhi</p>
            <p class="destination-price">From ₹${dest.price}</p>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Shows trip ideas on the homepage
   
  function showTripIdeas() {
    const ideasGrid = document.getElementById("ideasGrid");
    if (!ideasGrid || !window.tripIdeas) return;

    // Generate HTML for each trip idea card
    ideasGrid.innerHTML = window.tripIdeas
      .map(
        (idea) => `
          <div class="idea-card">
            <img src="${idea.image}" alt="${idea.title}">
            <div class="idea-info">
              <h3>${idea.title}</h3>
              <p>${idea.description}</p>
              <p>${idea.duration}</p>
              <p class="idea-price">${idea.price} from ${idea.from}</p>
            </div>
          </div>
        `
      )
      .join("");
  }

  // Gets city name from airport code
   
  function getCityName(code) {
    const cities = {
      DEL: "Delhi",
      BOM: "Mumbai",
      BLR: "Bangalore",
      HYD: "Hyderabad",
      MAA: "Chennai",
      CCU: "Kolkata",
      GOI: "Goa",
      IXC: "Chandigarh",
    };
    return cities[code] || code;
  }
});

// Close modal when clicking outside of it
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});