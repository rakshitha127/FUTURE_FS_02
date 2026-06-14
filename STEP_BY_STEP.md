# Mini CRM Step-by-Step Guide

Follow these steps in VS Code.

## Step 1: Install required tools

Install these first:

- Node.js
- VS Code
- Git
- MongoDB Compass or MongoDB Atlas account

Check Node and Git:

```bash
node -v
npm -v
git --version
```

## Step 2: Open the project

Open the `mini-crm` folder in VS Code.

Open the VS Code terminal:

```bash
Ctrl + `
```

## Step 3: Install packages

Run:

```bash
npm install
```

This installs React, Express, MongoDB tools, login tools, and icons.

## Step 4: Create `.env`

Create a new file named `.env` in the main `mini-crm` folder.

Copy this into it:

```env
PORT=5000
DB_MODE=mongo
MONGO_URI=mongodb://127.0.0.1:27017/mini_crm
JWT_SECRET=my_super_secret_key_change_this
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

If Atlas keeps showing DNS errors, use this local fallback today:

```env
DB_MODE=file
```

Then you can run the CRM without MongoDB and switch back to `DB_MODE=mongo` for deployment.

## Step 5: Create the admin user

Run:

```bash
npm run seed
```

This creates:

```txt
Email: admin@example.com
Password: admin12345
```

It also creates sample leads.

## Step 6: Start the app

Run:

```bash
npm run dev
```

Open this in your browser:

```txt
http://localhost:5173
```

Login with the admin email and password.

## Step 7: Test all features

Check that you can:

- Log in
- See leads
- Add a new lead
- Search leads
- Filter by status
- Add priority, service interest, estimated value, and next follow-up date
- Change status from `new` to `contacted` to `converted`
- Switch between list view and pipeline view
- Add a follow-up note
- Delete a lead

## Step 8: Push to GitHub

Create a new empty GitHub repository named `mini-crm`.

Then run:

```bash
git init
git add .
git commit -m "Build mini CRM lead management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mini-crm.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 9: Deploy

Use MongoDB Atlas for the database.

Backend environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-frontend-url
```

Frontend environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

Backend start command:

```bash
npm start
```

Frontend build command:

```bash
npm run build
```

## Step 10: Final submission

Submit:

- Your deployed app link
- Your public GitHub repository link
- A short description:

```txt
I built a secure Mini CRM for managing website leads. Admins can log in, capture leads, track pipeline stages, manage priority and follow-up dates, add notes, search and filter leads, and view conversion and pipeline value analytics.
```
