
# Webprogramming-Module: Streaming Service

A Netflix-like streaming service application built for the Webprogramming module at university. This project demonstrates a full-stack web application with a **Next.js 16 frontend** and an **Express + SQLite backend**, communicating via REST API architecture.


## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation
1. **Clone and navigate to the project directory:**
   ```bash
   git clone https://github.com/verbrannter-toast/Webprogramming.git
   cd Webprogramming/streaming-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development Setup & Startup


```bash
npm run dev
```

This will:
- Launch the **Next.js frontend** on `http://localhost:3000`
- Launch the **Express backend** on `http://localhost:5000`
- Automatically initialize the SQLite database (`database.db`)
- Seed the database with test user and movie data on first run

## Default Test Credentials

After starting the application, you can log in with the auto-created test user:

- **Email:** `test@test.com`
- **Password:** `password123`


## API Endpoints

The backend provides the following REST API endpoints:

- **Authentication**
  - `POST /login` - User login
  - `POST /register` - User registration

- **Movies**
  - `GET /movies` - Get all movies

- **Watchlist**
  - `GET /watchlist/:userId` - Get user's watchlist
  - `POST /watchlist/toggle` - Add/remove movie from watchlist

- **Account**
  - `POST /account/update-password` - Update user password
  - `GET /account/avatar/:userId` - Get user avatar
  - `POST /account/avatar` - Upload user avatar
  - `DELETE /account/:userId` - Delete user account

