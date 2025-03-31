const express = require('express');
const router = express.Router();

// Chat page
router.get('/', (req, res) => {
    res.render('ai-chat', { user: req.session.user });
});

// Handle chat messages
router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        
        // For demo purposes, just echo the message back
        // Replace this with actual AI integration
        const response = `Echo: ${message}`;
        
        res.json({ response });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 