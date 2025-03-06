# UmodziRx

## Description
UmodziRx is a web application designed to provide a seamless experience for managing patient prescriptions and healthcare services.

## Installation
To install the project, clone the repository and install the required dependencies using the following commands:

1. Clone the repository:

git clone https://github.com/Bsc-com-ne-23-20/UmodziRx.git

2. Navigate to the project directory:
cd UmodziRx/frontEnd

3. Install all required dependencies:
npm install

This command will install all required dependencies, including both regular and development dependencies listed in the package.json file.

npm install


git clone https://github.com/Bsc-com-ne-23-20/UmodziRx.git
cd UmodziRx/frontEnd
npm install


## Usage
To run the application, use the following command:

npm start


This will start the development server and open the application in your default web browser.

## Project Structure

frontEnd/
├── src/
│   ├── App.js                # Main application component
│   ├── App.css               # Styles for the main application
│   ├── index.js              # Entry point for the application
│   ├── pages/                # Contains all page components
│   │   ├── Auth.js           # Authentication page
│   │   ├── Dashboard.js       # Dashboard page
│   │   ├── DoctorDashboard.js  # Doctor's dashboard page
│   │   ├── Home.js           # Home page
│   │   ├── LearnMore.js      # Learn more page
│   │   ├── Login.js          # Login page
│   │   ├── PatientPrescriptions.js # Patient prescriptions page
│   │   ├── PharmacistDashboard.js # Pharmacist's dashboard page
│   │   └── Verify.js         # Verification page
│   ├── components/           # Reusable components
│   │   └── Navbar.js         # Navigation bar component
│   ├── services/             # API service files
│   │   └── mosipAuth.js      # Authentication service
│   └── mocks/                # Mock data for testing
│       └── server.js         # Mock server setup
└── package.json              # Project dependencies and scripts


## Code Documentation
- **App.js**: The main component that sets up routing and renders the application.
- **Navbar.js**: A reusable navigation bar component for navigating between pages.
- **mosipAuth.js**: Contains functions for handling authentication with the MOSIP API.
- **Each page component**: Represents a different view in the application, handling specific functionalities.

## License
This project is licensed under the MIT License. The MIT License is a permissive free software license that allows for reuse within proprietary software, as long as the license is included with that software. It is a simple and easy-to-understand license that places very few restrictions on reuse, making it a popular choice for open source projects.
