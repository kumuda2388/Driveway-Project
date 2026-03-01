# Driveway Project

## Overview

The Driveway Project is a full-stack web application that enables customers to submit service requests and contractors to manage quotes, bills, and orders.

The system is built using:

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

The project is structured with a clear separation between frontend and backend components.

---

## Base URL

Start point of the website:

http://localhost/Driveway_Project/frontend/index.html

---

## Project Structure

Driveway_Project  
│  
├── frontend/   → Contains all HTML, CSS, and frontend JavaScript files  
├── backend/    → Contains server logic, API routes, and database queries  

Important Backend Files:

- app.js → Contains backend server setup and API calls  
- dbservice.js → Contains all MySQL database queries  

---

## Backend Setup

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

---

### Step 2: Initialize Node Project

```bash
npm init -y
```

---

### Step 3: Install Required Packages

```bash
npm install express mysql cors nodemon dotenv
npm install express-session
npm install bcrypt
```

Package usage:

- express → Backend server framework  
- mysql → MySQL database connection  
- cors → Enable cross-origin requests  
- nodemon → Auto-restart server on file changes  
- dotenv → Manage environment variables  
- express-session → Session handling  
- bcrypt → Password hashing for security  

---

## Update package.json

Modify the package.json file to include the following under scripts:

```json
"start": "nodemon app.js"
```

This ensures the server automatically refreshes when changes are made.

---

## Start the Backend Server

From the backend folder, run:

```bash
npm start
```

The server will start and dynamically reflect changes.

---

## Technologies Used

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js
- MySQL

Security:
- bcrypt for password hashing
- express-session for session management

---

## Features

Customer Side:
- Submit service requests
- Generate quotes
- View bills
- Manage orders

Contractor Side:
- Review service requests
- Create and manage quotes
- Generate bills
- Manage customer orders
- Dashboard overview

Dashboard:
- Displays key system data
- Includes integrated database queries
- Built collaboratively
---

## Project Status

The application runs locally and demonstrates:

- Structured frontend-backend integration  
- Database-driven dynamic functionality  
- Secure authentication using bcrypt  
- Session management using express-session  
- Dynamic server updates using nodemon  

The system is designed as a scalable foundation for future enhancements.
