const express = require('express');
const router = express.Router();

// Example API endpoints
router.get('/', (req, res) => res.send('Image route'));
router.post('/', (req, res) => res.send('Create a new note'));

module.exports = router;
