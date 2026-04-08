# Tummala Finance - Full Stack Finance Website

Production-style full-stack website and API for **Tummala Finance**.

## Brand
- **Company Name:** Tummala Finance
- **Tagline:** Trusted Financial Solutions for Your Future

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + Role-based access (Admin/User)

## Features Delivered
- Multi-page corporate frontend: Home, About, Services, EMI Calculator, Branch Locator, Contact, User Dashboard, Admin Dashboard.
- Dynamic EMI calculator (Home + dedicated calculator page).
- Branch locator with city/state filtering + Google Maps embeds.
- User registration/login + OTP verification flow (email mock).
- Loan application submission with document upload.
- PDF loan summary generation per application.
- Contact inquiry storage.
- Admin analytics, users, inquiries, and content management APIs.
- Notification system for status updates.

## Project Structure
```
.
├── config/
├── middleware/
├── models/
├── public/
│   ├── assets/css/styles.css
│   ├── assets/js/*.js
│   └── *.html
├── routes/
├── uploads/
├── utils/
├── server.js
└── package.json
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Start server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5000`.

## Notes
- Email delivery in OTP flow is mocked in `utils/email.js`.
- Seed admin user manually by setting `role: "admin"` in MongoDB for a user.
