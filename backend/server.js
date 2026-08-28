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

// Experience tika ganna API (GET)
app.get('/api/experience', (req, res) => {
    const sql = "SELECT * FROM experience ORDER BY start_date DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Aluth Experience ekak add karanna API (POST)
app.post('/api/experience', (req, res) => {
    const { title, organization, start_date, end_date, description, type } = req.body;
    const sql = "INSERT INTO experience (title, organization, start_date, end_date, description, type) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [title, organization, start_date, end_date, description, type], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Experience eka add kala!", id: result.insertId });
    });
});

// Contact form eken ena message ekak save karanna (POST) - Meka frontend public site eken use wenne
app.post('/api/messages', (req, res) => {
    const { sender_name, sender_email, message } = req.body;
    const sql = "INSERT INTO messages (sender_name, sender_email, message) VALUES (?, ?, ?)";
    
    db.query(sql, [sender_name, sender_email, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Message eka yawwa! Godak sthuthiyi." });
    });
});

// Admin panel eken messages tika kiyawanna (GET)
app.get('/api/messages', (req, res) => {
    const sql = "SELECT * FROM messages ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});