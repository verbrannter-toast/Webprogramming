import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const app = express();
const db = new Database('database.db');

app.use(cors());
app.use(express.json());

// initialize Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE, 
        password TEXT
    );
    CREATE TABLE IF NOT EXISTS watchlists (
        user_id INTEGER, 
        movie_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT,
        genre TEXT,
        image TEXT
    );
`);

// check if a test user exists
const testUser = db.prepare('SELECT id FROM users WHERE email = ?').get('test@test.com');

if (!testUser) {
    console.log("No test user found. Creating automatic test account...");
    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
      .run('test@test.com', 'password123');
    console.log("Seed complete: Use 'test@test.com' / 'password123' to login.");
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // unsafe but not relevant for this demo
    const user = db.prepare('SELECT id, email FROM users WHERE email = ? AND password = ?')
                   .get(email, password);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});


app.post('/account/update-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    
    // Step 1: Verify current password
    const user = db.prepare('SELECT id FROM users WHERE id = ? AND password = ?')
                   .get(userId, currentPassword);
    
    if (!user) {
        // Current password is wrong
        return res.status(401).json({ 
            success: false, 
            message: "Current password is incorrect" 
        });
    }
    
    // Step 2: Update to new password
    db.prepare('UPDATE users SET password = ? WHERE id = ?')
      .run(newPassword, userId);
    
    res.json({ success: true, message: "Password updated successfully" });
});

// GET the watchlist for a specific user
app.get('/watchlist/:userId', (req, res) => {
    const { userId } = req.params;
    
    try {
        // query DB for all movie IDs belonging to this user
        const stmt = db.prepare('SELECT movie_id FROM watchlists WHERE user_id = ?');
        const rows = stmt.all(userId);
        
        // Return array of IDs
        const movieIds = rows.map((row: any) => row.movie_id);
        res.json(movieIds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/watchlist/toggle', (req, res) => {
    const { userId, movieId } = req.body;
    
    // using a prepared statement for security
    const stmt = db.prepare('SELECT * FROM watchlists WHERE user_id = ? AND movie_id = ?');
    const exists = stmt.get(userId, movieId);

    if (exists) {
        db.prepare('DELETE FROM watchlists WHERE user_id = ? AND movie_id = ?').run(userId, movieId);
        res.json({ status: 'removed' });
    } else {
        db.prepare('INSERT INTO watchlists (user_id, movie_id) VALUES (?, ?)').run(userId, movieId);
        res.json({ status: 'added' });
    }
});

const moviesPath = path.join(__dirname, 'movies.json');
const moviesData = JSON.parse(fs.readFileSync(moviesPath, 'utf8'));

const movieCount = (db.prepare('SELECT COUNT(*) as count FROM movies').get() as any).count;

if (movieCount === 0) {
    console.log("Seeding movies from JSON...");
    const insert = db.prepare('INSERT INTO movies (id, title, genre, image) VALUES (?, ?, ?, ?)');
    
    const transaction = db.transaction((movies) => {
        for (const movie of movies) {
            insert.run(movie.id, movie.title, movie.genre, movie.image);
        }
    });
    
    transaction(moviesData);
    console.log(`Successfully seeded ${moviesData.length} movies.`);
}

app.get('/movies', (req, res) => {
    const movies = db.prepare('SELECT * FROM movies').all();
    res.json(movies);
});

app.listen(5000, () => console.log('Modern Backend on http://localhost:5000'));