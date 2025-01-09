const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/get-solution', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api.geminiapi.com/v1/solutions', // Replace with the actual API endpoint
      { prompt: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ solution: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch solution' });
  }
});

module.exports = router;
