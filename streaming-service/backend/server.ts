import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('database.db');

app.use(cors());
app.use(express.json());

// Initialize Tables synchronously
db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE);
    CREATE TABLE IF NOT EXISTS watchlists (user_id INTEGER, movie_id INTEGER);
`);

app.post('/watchlist/toggle', (req, res) => {
    const { userId, movieId } = req.body;
    
    // Using a prepared statement for security
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

app.listen(5000, () => console.log('Modern Backend on http://localhost:5000'));