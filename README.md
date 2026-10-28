# CareCircle

CareCircle is a college project full-stack web application for elder care service management. It connects families who need care services with verified healthcare partners and gives admins a simple control panel to monitor users, bookings, and partner approvals.

## Main Features

- Family registration and login
- Elder profile and annual care plan selection
- Numeric-only phone and emergency contact validation
- Service booking for home nurse, hospital assistance, medicines, lab tests, physiotherapy, and emergency help
- Individual booking detail view with status switch
- Partner registration and login
- Real-time partner notifications for matching service requests using Socket.IO
- Partner dashboard to accept, start, and complete services
- Admin dashboard for partner approval and booking monitoring
- Forgot password flow for family and partner accounts
- One-click Windows launcher

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, Lucide React
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Real-time updates: Socket.IO
- Authentication helpers: bcryptjs, jsonwebtoken

## Project Modules

### Family Module

Families can register, add elder details, book care services, view recent requests, open an individual booking card, and track status.

### Partner Module

Care partners can apply, log in after admin approval, receive live service notifications, accept matching bookings, and update service progress.

### Admin Module

Admin can log in, view families, approve care partners, and update service booking status.

## How to Run

1. Install Node.js and MongoDB.
2. Create `backend/.env` using `backend/.env.example`.
3. Install dependencies:

```bash
npm install
cd backend
npm install
cd ../frontend
npm install
```

4. Start the project by double-clicking:

```text
Open CareCircle Website.bat
```

The app opens at:

```text
http://127.0.0.1:5173
```

## Default Admin Login

```text
Email: admin@carecircle.com
Password: Admin@123
```

You can change these values in `backend/.env`.

## Demonstration Flow

1. Open the website and show the Project page.
2. Register a family account.
3. Book a care service such as Home Nurse.
4. Register a partner with the same service type.
5. Approve the partner from Admin.
6. Log in as partner and accept the matching request.
7. Update booking status through the partner or family dashboard.

