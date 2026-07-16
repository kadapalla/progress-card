# Lab Management System

A comprehensive Lab Management System built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Technologies Used

**Frontend (Client)**
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend (Server)**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## 📂 Project Structure

- `/client` - Frontend React application (Vite)
- `/server` - Backend Node.js/Express application

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/kadapalla/progress-card.git
cd progress-card
```

### 2. Backend Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/labmanagement
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the `client` directory:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

## 🌐 Deployment Instructions

### Deploying the Backend (e.g., Render, Railway, or Heroku)

1. Ensure your backend code is pushed to your GitHub repository.
2. Sign up for a service like [Render](https://render.com/) or [Railway](https://railway.app/).
3. Create a new **Web Service** and connect your GitHub repository.
4. Set the **Root Directory** to `server`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `npm start`.
7. Add the following **Environment Variables** in the hosting dashboard:
   - `PORT`: (Usually set automatically, or leave as default)
   - `MONGODB_URI`: Your production MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong, random string for JWT signing.
   - `JWT_EXPIRES_IN`: e.g., `7d`.
   - `NODE_ENV`: `production`.
8. Deploy the service and copy the generated backend URL.

### Deploying the Frontend (e.g., Vercel or Netlify)

1. Go to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) and sign in with GitHub.
2. Create a new project and select your repository.
3. Set the **Root Directory** to `client`.
4. The framework should be automatically detected as Vite. If not, set:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the following **Environment Variables**:
   - `VITE_BACKEND_URL`: The production URL of your deployed backend (e.g., `https://your-backend-app.onrender.com/api`).
6. Click **Deploy**.

## 🧪 End-to-End Testing

This project uses Playwright for end-to-end testing. 

> [!IMPORTANT]
> By default, the tests in `playwright.config.ts` are configured to run against your local development server (`http://localhost:3000`). 
> **If you want to run these tests against your deployed application**, you must update the `baseURL` inside `playwright.config.ts` to match your deployed frontend URL (e.g., `https://your-frontend-app.vercel.app`), and you may want to remove the `webServer` block so it doesn't attempt to start a local server.

To run the test suite locally:
```bash
npm run test
```

## 📄 License
ISC
