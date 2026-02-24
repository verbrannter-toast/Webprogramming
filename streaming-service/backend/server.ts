import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const app = express();
const db = new Database('database.db');
const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const AVATAR_UPLOAD_DIR = path.resolve(process.cwd(), '..', 'user-uploads', 'avatars');

if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
    fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/uploads/avatars', express.static(AVATAR_UPLOAD_DIR));

// initialize Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE, 
        password TEXT,
        avatar_path TEXT
    );
    CREATE TABLE IF NOT EXISTS watchlists (
        user_id INTEGER, 
        movie_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS watch_history (
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        progress_seconds REAL NOT NULL DEFAULT 0,
        duration_seconds REAL,
        is_finished INTEGER NOT NULL DEFAULT 0,
        last_watched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, movie_id)
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

//login
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

// register
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    
    try {
        const insert = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        const result = insert.run(email, password);
        res.json({ success: true, userId: result.lastInsertRowid });
    } catch (err) {
        // This triggers if the email is not unique
        res.status(400).json({ success: false, message: "Email already exists" });
    }
});

// update password
app.patch('/account/update-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    
    const user = db.prepare('SELECT id FROM users WHERE id = ? AND password = ?')
                   .get(userId, currentPassword);
    
    if (!user) {
        return res.status(401).json({ success: false, message: "Current password incorrect" });
    }
    
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
    res.json({ success: true, message: "Password updated" });
});

app.get('/account/avatar/:userId', (req, res) => {
    const { userId } = req.params;

    const user = db.prepare('SELECT avatar_path FROM users WHERE id = ?').get(userId) as { avatar_path?: string } | undefined;

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.avatar_path) {
        return res.json({ success: true, avatarUrl: null });
    }

    const avatarUrl = `http://localhost:5000/uploads/avatars/${user.avatar_path}`;
    res.json({ success: true, avatarUrl });
});

// update avatar
app.post('/account/avatar', (req, res) => {
    const { userId, imageData } = req.body as { userId?: string | number; imageData?: string };

    if (!userId || !imageData) {
        return res.status(400).json({ success: false, message: 'userId and imageData are required' });
    }

    const user = db.prepare('SELECT id, avatar_path FROM users WHERE id = ?').get(userId) as { id: number; avatar_path?: string } | undefined;

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const imageMatch = imageData.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);

    if (!imageMatch) {
        return res.status(400).json({ success: false, message: 'Only png, jpg/jpeg, and webp images are supported' });
    }

    const mimeType = imageMatch[1];
    const base64Payload = imageMatch[2];
    const avatarBuffer = Buffer.from(base64Payload, 'base64');

    if (avatarBuffer.length > AVATAR_MAX_SIZE_BYTES) {
        return res.status(400).json({ success: false, message: 'Image must be 5MB or smaller' });
    }

    const extension = mimeType === 'image/png'
        ? 'png'
        : mimeType === 'image/webp'
            ? 'webp'
            : 'jpg';

    const fileName = `user-${userId}-${randomUUID()}.${extension}`;
    const targetPath = path.join(AVATAR_UPLOAD_DIR, fileName);

    fs.writeFileSync(targetPath, avatarBuffer);

    if (user.avatar_path) {
        const previousPath = path.join(AVATAR_UPLOAD_DIR, user.avatar_path);
        if (fs.existsSync(previousPath)) {
            fs.unlinkSync(previousPath);
        }
    }

    db.prepare('UPDATE users SET avatar_path = ? WHERE id = ?').run(fileName, userId);

    const avatarUrl = `http://localhost:5000/uploads/avatars/${fileName}`;
    res.json({ success: true, avatarUrl });
});

// delete account
app.delete('/account/:userId', (req, res) => {
    const { userId } = req.params;

    const user = db.prepare('SELECT id, avatar_path FROM users WHERE id = ?').get(userId) as { id: number; avatar_path?: string } | undefined;

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete avatar file from disk if it exists
    if (user.avatar_path) {
        const avatarFilePath = path.join(AVATAR_UPLOAD_DIR, user.avatar_path);
        if (fs.existsSync(avatarFilePath)) {
            fs.unlinkSync(avatarFilePath);
        }
    }

    // Delete watchlist entries
    db.prepare('DELETE FROM watchlists WHERE user_id = ?').run(userId);

    // Delete watch history entries
    db.prepare('DELETE FROM watch_history WHERE user_id = ?').run(userId);

    // Delete user
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.json({ success: true, message: 'Account deleted successfully' });
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

// add to watchlist
app.post('/watchlist', (req, res) => {
    const { userId, movieId } = req.body;
    const stmt = db.prepare('INSERT OR IGNORE INTO watchlists (user_id, movie_id) VALUES (?, ?)');
    stmt.run(userId, movieId);
    res.status(201).json({ success: true, message: "Added to watchlist" });
});

// remove from watchlist
app.delete('/watchlist/:userId/:movieId', (req, res) => {
    const { userId, movieId } = req.params;
    const stmt = db.prepare('DELETE FROM watchlists WHERE user_id = ? AND movie_id = ?');
    const result = stmt.run(userId, movieId);
    
    if (result.changes > 0) {
        res.json({ success: true, message: "Removed from watchlist" });
    } else {
        res.status(404).json({ success: false, message: "Item not found" });
    }
});

// get watch history for user
app.get('/history/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const rows = db.prepare(`
            SELECT
                m.id,
                m.title,
                m.genre,
                m.image,
                h.progress_seconds AS progressSeconds,
                h.duration_seconds AS durationSeconds,
                h.is_finished AS isFinished,
                h.last_watched_at AS lastWatchedAt
            FROM watch_history h
            INNER JOIN movies m ON m.id = h.movie_id
            WHERE h.user_id = ?
            ORDER BY h.is_finished ASC, datetime(h.last_watched_at) DESC
        `).all(userId) as Array<{
            id: number;
            title: string;
            genre: string;
            image: string;
            progressSeconds: number;
            durationSeconds: number | null;
            isFinished: number;
            lastWatchedAt: string;
        }>;

        const payload = rows.map((row) => {
            const duration = row.durationSeconds ?? 0;
            const progressPercent = duration > 0
                ? Math.min(100, Math.round((row.progressSeconds / duration) * 100))
                : 0;

            return {
                ...row,
                progressPercent
            };
        });

        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch watch history' });
    }
});

// update watch progress
app.post('/history/progress', (req, res) => {
    const {
        userId,
        movieId,
        progressSeconds,
        durationSeconds,
        isFinished
    } = req.body as {
        userId?: string | number;
        movieId?: string | number;
        progressSeconds?: number;
        durationSeconds?: number | null;
        isFinished?: boolean;
    };

    if (!userId || !movieId) {
        return res.status(400).json({ success: false, message: 'userId and movieId are required' });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId) as { id: number } | undefined;
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const movie = db.prepare('SELECT id FROM movies WHERE id = ?').get(movieId) as { id: number } | undefined;
    if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const safeProgress = Number.isFinite(progressSeconds)
        ? Math.max(0, Number(progressSeconds))
        : 0;

    const safeDuration = Number.isFinite(durationSeconds)
        ? Math.max(0, Number(durationSeconds))
        : null;

    const finishedByRatio = safeDuration && safeDuration > 0
        ? safeProgress / safeDuration >= 0.9
        : false;

    const shouldMarkFinished = Boolean(isFinished) || finishedByRatio;

    db.prepare(`
        INSERT INTO watch_history (
            user_id,
            movie_id,
            progress_seconds,
            duration_seconds,
            is_finished,
            last_watched_at
        )
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, movie_id)
        DO UPDATE SET
            progress_seconds = excluded.progress_seconds,
            duration_seconds = excluded.duration_seconds,
            is_finished = excluded.is_finished,
            last_watched_at = CURRENT_TIMESTAMP
    `).run(
        userId,
        movieId,
        safeProgress,
        safeDuration,
        shouldMarkFinished ? 1 : 0
    );

    res.json({ success: true });
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