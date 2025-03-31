const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const { router: authRouter, isAuthenticated } = require('./routes/auth');
const aiChatRouter = require('./routes/ai-chat');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Routes
app.use('/', authRouter);
app.use('/ai-chat', isAuthenticated, aiChatRouter);

// Redirect root to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Handle 404s
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 