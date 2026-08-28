const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data accept karanna

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Kasun ge Portfolio Backend eka weda!');
});

// 1. Projects Tika Ganna API Eka (GET Request)
app.get('/api/projects', (req, res) => {
    const sql = "SELECT * FROM projects ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result); // Projects tika JSON widihata frontend ekata denawa
        }
    });
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server eka port ${PORT} eke run wenawa`);
});