# FlyGo - Flight Booking App ✈️

FlyGo is a modern flight booking web application inspired by Wego.co.in, built with HTML, CSS, and JavaScript. It allows users to search for flights, book tickets, and manage their bookings.

## Features 🌟

- **User Authentication**:
  - Login/Signup with form validation
  - Session management using localStorage
- **Flight Search**:
  - Search flights by city or airport code
  - Filter by date, passengers, and class
  - Round-trip and one-way options
- **Booking Management**:
  - Passenger details form
  - Booking confirmation
  - View/Cancel bookings
- **Additional Features**:
  - Popular destinations section
  - Trip ideas recommendation
  - Responsive design for all devices

## Technologies Used 💻

- **Frontend**:
  - HTML5
  - CSS3 (Flexbox, Grid)
  - JavaScript (ES6+)
- **Data Storage**:
  - localStorage for user data and bookings
- **External APIs**:
  - Unsplash for destination images (optional)

## File Structure 📁

flygo/
├── booking.html # Main application page
├── styles.css # All CSS styles
├── script.js # Main JavaScript functionality
├── flight-data.json # Flight information dataset
├── trip-ideas.json # Trip packages data
├── images/ # Destination images
│ ├── delhi.jpg
│ ├── mumbai.jpg
│ └── ...
└── README.md # This file



## Setup Instructions 🛠️

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AmanTiwari23/Flight-booking-app-.git
   
2.  Run the application:

Option 1: Open index.html directly in your browser

3. For development:

No build tools required

Simply edit the HTML/CSS/JS files

Refresh browser to see changes

# How to Use 🚀

Search for flights:

Enter departure and arrival cities (or airport codes)

Select dates and number of passengers

Choose flight class (Economy, Business, etc.)

# Book a flight:

Select a flight from search results

Enter passenger details

Complete booking with contact information

# Manage bookings:

View all your bookings in "My Bookings" section

Cancel bookings if needed

View booking details

Customization 🎨
Change color scheme: Modify CSS variables in styles.css

Add more flights: Edit flight-data.json

Update trip ideas: Edit trip-ideas.json

Add more cities:

Add new entries in both JSON files

Include corresponding images in /images folder

# Future Improvements 🔮
Add payment gateway integration

Implement flight price alerts

Add hotel booking functionality

Connect to real flight API instead of mock data

Add user profile management

## Screenshots 📸
![alt text](<assets/Screenshot 2025-07-08 122136.png>)
Flight search interface

![alt text](<assets/Screenshot 2025-07-08 122530.png>)
Flight search results

![alt text](<assets/Screenshot 2025-07-08 122632.png>)
![alt text](<assets/Screenshot 2025-07-08 122702.png>)
![alt text](<assets/Screenshot 2025-07-08 122727.png>)

Booking confirmation page