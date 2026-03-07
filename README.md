
# Webprogramming-Module: Streaming Service

A Netflix-like streaming service application built for the Webprogramming module at university. This project demonstrates a full-stack web application with a **Next.js 16 frontend** and an **Express + SQLite backend**, communicating via REST API architecture.


## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation
0. **Clone and navigate to the project directory:**
   ```bash
   git clone https://github.com/verbrannter-toast/Webprogramming.git
   cd Webprogramming
   ```

### Running the project in Docker with Make:
1. Build and run the container
    ```bash
    make docker.build
    make docker.run
    ````
2. In your browser, navigate to: http://localhost:3000/
3. Clean up after using the Container
    ```bash 
    make docker.stop
    make docker.delete_container
    make docker.delete_image
    ```

Note: If you cannot use Make, you can just copypaste the Docker commands from Makefile into your terminal

### Running the app natively

**Install dependencies:**
   ```bash
   cd Webprogramming/streaming-service
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

