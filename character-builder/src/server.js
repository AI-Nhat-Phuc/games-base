/**
 * Character Builder Server
 * Serves the character builder UI tool
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// API endpoint to save character data
app.post('/api/save-character', (req, res) => {
  const characterData = req.body;
  
  // In a real implementation, this would save to a file or database
  console.log('Character data received:', {
    name: characterData.name,
    hasSprite: !!characterData.sprite,
    hasAnimation: !!characterData.animationSheet,
    hasVoice: !!characterData.voice
  });

  res.json({
    success: true,
    message: 'Character data saved successfully',
    data: characterData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Character Builder tool running at http://localhost:${PORT}`);
  console.log('Open your browser to start creating characters!');
});
