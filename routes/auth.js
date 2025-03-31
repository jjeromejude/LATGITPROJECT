const express = require('express');
const router = express.Router();

// Temporary user storage (replace with database in production)
const users = {
    'admin': '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E68wLnsMO1Gu.' // password: admin123
};

// Login page
router.get('/login', (req, res) => {
    res.render('login', { messages: { error: req.flash('error') } });
});

// Login handler
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // For demo purposes, just check if username exists
    if (users[username]) {
        req.session.user = username;
        res.redirect('/ai-chat');
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');
    }
});

// Logout handler
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = { router, isAuthenticated }; 