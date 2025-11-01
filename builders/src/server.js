/**
 * Builders Server
 * Serves the character and map builder UI tools
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve character builder
app.use('/character-builder', express.static(path.join(__dirname, '../character-builder')));

// Serve map builder
app.use('/map-builder', express.static(path.join(__dirname, '../map-builder')));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Root route - show available builders
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PNP Game Engine Builders</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #333; }
        .builder-card {
          background: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .builder-card h2 { margin-top: 0; color: #2c3e50; }
        .builder-card p { color: #666; line-height: 1.6; }
        .builder-card a {
          display: inline-block;
          padding: 10px 20px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .builder-card a:hover { background: #2980b9; }
      </style>
    </head>
    <body>
      <h1>🎮 PNP Game Engine Builders</h1>
      <p>Choose a builder tool to create game assets:</p>
      
      <div class="builder-card">
        <h2>👾 Character Builder</h2>
        <p>Create characters with sprites, animations (walk, run, attack, injured, dead), stats, and voice assets. Export as JSON and TypeScript code.</p>
        <a href="/character-builder/index.html">Open Character Builder →</a>
      </div>
      
      <div class="builder-card">
        <h2>🗺️ Map Builder</h2>
        <p>Design game maps with two modes: 2.5D Isometric or Side-Scrolling. Create multi-layer maps with collision zones and export for your game.</p>
        <a href="/map-builder/index.html">Open Map Builder →</a>
      </div>
    </body>
    </html>
  `);
});

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

// API endpoint to save map data
app.post('/api/save-map', (req, res) => {
  const mapData = req.body;
  
  // In a real implementation, this would save to a file or database
  console.log('Map data received:', {
    name: mapData.name,
    type: mapData.type,
    width: mapData.width,
    height: mapData.height
  });

  res.json({
    success: true,
    message: 'Map data saved successfully',
    data: mapData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Builders tools running at http://localhost:${PORT}`);
  console.log('Available builders:');
  console.log(`  - Character Builder: http://localhost:${PORT}/character-builder/index.html`);
  console.log(`  - Map Builder: http://localhost:${PORT}/map-builder/index.html`);
});
