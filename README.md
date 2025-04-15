# FoodLoop Project

FoodLoop is a web-based platform designed to connect food providers, waste processors, and transporters to promote sustainable food waste management. The platform facilitates efficient waste collection, processing, and transportation while reducing environmental impact.

## Features

- **Admin Dashboard**: Manage users, transactions, waste listings, and transporters.
- **Provider Dashboard**: Add and manage food waste listings, track pickups, and view analytics.
- **Transporter Dashboard**: Manage routes, pickups, and deliveries.
- **Company Dashboard**: Request waste, view analytics, and manage orders.
- **Settings**: Update profile information, manage notifications, and account preferences.
- **Legal Policies**: Terms of Service, Privacy Policy, and Cookie Policy.

## Project Structure

```
DBMS_Project/
├── AdminsDashboard.html       # Admin dashboard for managing the platform
├── providerDashboard.html     # Dashboard for food providers
├── transporterDashboard.html  # Dashboard for transporters
├── companyDashboard.html      # Dashboard for waste processors
├── settings.html              # User settings page
├── AboutUs.html               # About Us page
├── legal.html                 # Legal policies page
├── transporterelist.html      # List of transporters
├── transporterDetails.html    # Detailed view of a transporter
├── providerlist.html          # List of food providers
├── MainPage.html              # Landing page
├── js/
│   └── script.js              # JavaScript for interactivity and API integration
├── style/
│   ├── adminDashboard.css     # Styles for Admin Dashboard
│   ├── providerDashboard.css  # Styles for Provider Dashboard
│   ├── transporterDashboard.css # Styles for Transporter Dashboard
│   ├── companyDashboard.css   # Styles for Company Dashboard
│   ├── settingsStyle.css      # Styles for Settings page
│   ├── aboutStyle.css         # Styles for About Us page
│   ├── legalStyle.css         # Styles for Legal Policies page
│   └── style.css              # General styles
└── Assets/
    ├── Images/                # Images used in the project
    └── Fonts/                 # Custom fonts
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DBMS_Project
   ```

2. Install dependencies:
   - Ensure you have a local server (e.g., XAMPP, WAMP, or Node.js) to serve the project files.
   - Install required npm packages if applicable:
     ```bash
     npm install
     ```

3. Start the server:
   - Use a local server to serve the HTML files (e.g., `http://localhost/DBMS_Project`).

4. Configure the backend:
   - Ensure the backend API is running on `http://localhost:3000`.
   - Update API endpoints in `js/script.js` if necessary.

## Usage

- **Admin**: Access the Admin Dashboard to manage users, transactions, and listings.
- **Provider**: Use the Provider Dashboard to list food waste and track pickups.
- **Transporter**: Manage routes and pickups via the Transporter Dashboard.
- **Company**: Request waste and view analytics on the Company Dashboard.

## API Endpoints

- `GET /api/dashboard-stats`: Fetch dashboard statistics.
- `GET /api/waste-requests`: Retrieve waste requests for transporters.
- `POST /api/assign-transporter`: Assign a transporter to a waste request.
- `POST /api/registerProvider`: Register a new food provider.
- `GET /api/listings`: Fetch food waste listings.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (API integration)
- **Database**: MongoDB (or any other database for storing data)
- **Libraries**:
  - [Chart.js](https://www.chartjs.org/) for data visualization
  - [Font Awesome](https://fontawesome.com/) for icons
  - [AOS](https://michalsnik.github.io/aos/) for animations

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.