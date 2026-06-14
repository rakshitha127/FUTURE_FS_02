# Mini CRM Lead Management System

A beginner-friendly Client Lead Management System built with React, Express, MongoDB, and JWT admin login.

## Features

- Secure admin login
- Lead listing with name, email, source, status, and timestamps
- Add leads from a website/contact-form style form
- Priority, service interest, estimated deal value, and next follow-up date
- Update lead status: `new`, `contacted`, `converted`
- Add follow-up notes for each lead
- Search and filter leads
- Pipeline board grouped by lead status
- Analytics cards for total leads, pipeline value, high-priority leads, and conversion rate
- Responsive professional admin UI with sidebar navigation and lead profile panel

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Folder Structure

```txt
mini-crm/
  client/
    src/
      App.jsx
      api.js
      main.jsx
      styles.css
  server/
    middleware/
    models/
    routes/
    index.js
    seedAdmin.js
  .env.example
  package.json
  README.md
```

## Local Setup

### 1. Open the project

Open this `mini-crm` folder in VS Code.

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy `.env.example` to `.env`, then update values if needed.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Start MongoDB

Use either:

- Local MongoDB: keep `MONGO_URI=mongodb://127.0.0.1:27017/mini_crm`
- MongoDB Atlas: replace `MONGO_URI` with your Atlas connection string

If Atlas is blocked by your network while practicing locally, set:

```env
DB_MODE=file
```

This stores leads in `server/data/fileDb.json`. Use `DB_MODE=mongo` again when you are ready for MongoDB Atlas deployment.

### 5. Create admin user and sample leads

```bash
npm run seed
```

Default login:

```txt
Email: admin@example.com
Password: admin12345
```

Change these in `.env` before seeding if you want different admin credentials.

### 6. Run the app

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

Backend API:

```txt
http://localhost:5000/api
```

## API Routes

Public:

- `POST /api/leads` - Create a new website lead
- `POST /api/auth/login` - Admin login

Protected:

- `GET /api/auth/me` - Get logged-in admin
- `GET /api/leads` - List leads
- `PATCH /api/leads/:id/status` - Update lead status
- `POST /api/leads/:id/notes` - Add follow-up note
- `DELETE /api/leads/:id` - Delete lead

## Push to GitHub

```bash
git init
git add .
git commit -m "Build mini CRM lead management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mini-crm.git
git push -u origin main
```

## Deployment Notes

Recommended beginner path:

1. Create a MongoDB Atlas database.
2. Deploy the backend on Render, Railway, or another Node hosting service.
3. Deploy the frontend on Vercel or Netlify.
4. Add environment variables on the hosting dashboards:

Backend:

```txt
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-frontend-url
```

Frontend:

```txt
VITE_API_URL=https://your-backend-url/api
```

Build command:

```bash
npm run build
```

Start command for backend:

```bash
npm start
```

## What to Say in Your Submission

I built a secure Mini CRM that helps a business owner manage website leads. Admins can log in, capture incoming leads, search and filter opportunities, update pipeline status, track priority and estimated value, schedule follow-ups, add notes, and monitor conversion analytics from a professional dashboard.
