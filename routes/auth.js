const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Temporary user storage (replace with database in production)
const users = {
    'admin@example.com': {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9E68wLnsMO1Gu.' // admin123
    }
};

// Login page
router.get('/login', (req, res) => {
    res.render('login', { messages: { error: req.flash('error') } });
});

// Login handler
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = users[email];
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }

    req.session.user = {
        email: user.email,
        name: user.name
    };
    res.redirect('/ai-chat');
});

// Register handler
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (users[email]) {
        req.flash('error', 'Email already registered');
        return res.redirect('/login');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store new user
    users[email] = {
        name,
        email,
        password: hashedPassword
    };

    // Auto-login after registration
    req.session.user = {
        email,
        name
    };
    res.redirect('/ai-chat');
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