// Map Builder JavaScript

let mapType = '2.5d';
let mapData = {
  name: 'Level 1',
  type: '2.5d',
  width: 20,
  height: 15,
  tileSize: 32,
  layers: [
    {
      name: 'Ground Layer',
      tiles: []
    }
  ],
  tileset: null
};

let currentLayer = 0;
let canvas, ctx;
let tileset = null;
let selectedTile = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('mapCanvas');
  ctx = canvas.getContext('2d');
  
  updateMapSize();
  drawGrid();
  
  // Canvas click handler
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleCanvasHover);
});

function setMapType(type) {
  mapType = type;
  mapData.type = type;
  
  // Update button states
  document.getElementById('btn-2.5d').classList.remove('active');
  document.getElementById('btn-sidescroll').classList.remove('active');
  document.getElementById(`btn-${type}`).classList.add('active');
  
  updateMapInfo();
  drawGrid();
}

function updateMapSize() {
  const width = parseInt(document.getElementById('mapWidth').value);
  const height = parseInt(document.getElementById('mapHeight').value);
  const tileSize = parseInt(document.getElementById('tileSize').value);
  
  mapData.width = width;
  mapData.height = height;
  mapData.tileSize = tileSize;
  
  // Update canvas size
  canvas.width = width * tileSize;
  canvas.height = height * tileSize;
  
  // Initialize tile arrays for each layer if needed
  mapData.layers.forEach(layer => {
    if (!layer.tiles || layer.tiles.length === 0) {
      layer.tiles = Array(height).fill(null).map(() => Array(width).fill(0));
    }
  });
  
  updateMapInfo();
  drawGrid();
}

function updateMapInfo() {
  const info = document.getElementById('mapInfo');
  const typeLabel = mapType === '2.5d' ? '2.5D Isometric' : 'Side-Scrolling';
  info.textContent = `Map: ${mapData.width}×${mapData.height} | Tile: ${mapData.tileSize}px | Type: ${typeLabel}`;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const { width, height, tileSize } = mapData;
  
  if (mapType === '2.5d') {
    draw25DGrid(width, height, tileSize);
  } else {
    drawSideScrollGrid(width, height, tileSize);
  }
  
  // Draw tiles from all layers
  drawTiles();
}

function draw25DGrid(width, height, tileSize) {
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 1;
  
  // Draw isometric grid
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const screenX = x * tileSize;
      const screenY = y * tileSize;
      
      // Draw diamond/rhombus shape for isometric feel
      if (x < width && y < height) {
        ctx.strokeRect(screenX, screenY, tileSize, tileSize);
        
        // Add subtle diagonal lines for isometric effect
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + tileSize, screenY + tileSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(screenX + tileSize, screenY);
        ctx.lineTo(screenX, screenY + tileSize);
        ctx.stroke();
      }
    }
  }
}

function drawSideScrollGrid(width, height, tileSize) {
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 1;
  
  // Draw standard grid
  for (let y = 0; y <= height; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * tileSize);
    ctx.lineTo(width * tileSize, y * tileSize);
    ctx.stroke();
  }
  
  for (let x = 0; x <= width; x++) {
    ctx.beginPath();
    ctx.moveTo(x * tileSize, 0);
    ctx.lineTo(x * tileSize, height * tileSize);
    ctx.stroke();
  }
}

function drawTiles() {
  if (!tileset) return;
  
  const { width, height, tileSize } = mapData;
  
  // Draw each layer
  mapData.layers.forEach((layer, layerIndex) => {
    if (!layer.tiles) return;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = layer.tiles[y][x];
        if (tileId > 0) {
          // Draw tile from tileset (simplified - just fill with color for now)
          const color = `hsl(${tileId * 30}, 70%, 60%)`;
          ctx.fillStyle = color;
          ctx.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
        }
      }
    }
  });
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / mapData.tileSize);
  const y = Math.floor((event.clientY - rect.top) / mapData.tileSize);
  
  if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) {
    // Place tile in current layer
    if (!mapData.layers[currentLayer].tiles[y]) {
      mapData.layers[currentLayer].tiles[y] = Array(mapData.width).fill(0);
    }
    
    // Cycle through tile types (0-5)
    const currentTile = mapData.layers[currentLayer].tiles[y][x];
    mapData.layers[currentLayer].tiles[y][x] = (currentTile + 1) % 6;
    
    drawGrid();
  }
}

function handleCanvasHover(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / mapData.tileSize);
  const y = Math.floor((event.clientY - rect.top) / mapData.tileSize);
  
  if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) {
    // Highlight hovered tile
    drawGrid();
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.strokeRect(x * mapData.tileSize, y * mapData.tileSize, mapData.tileSize, mapData.tileSize);
  }
}

function loadTileset(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      tileset = img;
      document.getElementById('tilesetImg').src = e.target.result;
      document.getElementById('tilesetPreview').style.display = 'flex';
      document.getElementById('tilesetLabel').textContent = file.name;
      document.querySelector('.file-upload-btn').classList.add('uploaded');
      
      mapData.tileset = {
        name: file.name,
        data: e.target.result
      };
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function addLayer() {
  const layerNum = mapData.layers.length;
  const newLayer = {
    name: `Layer ${layerNum + 1}`,
    tiles: Array(mapData.height).fill(null).map(() => Array(mapData.width).fill(0))
  };
  
  mapData.layers.push(newLayer);
  
  // Update UI
  const layerList = document.getElementById('layerList');
  const layerItem = document.createElement('div');
  layerItem.className = 'layer-item';
  layerItem.dataset.layer = layerNum;
  layerItem.innerHTML = `
    <span class="layer-name">${newLayer.name}</span>
    <span>📍</span>
  `;
  layerItem.onclick = () => selectLayer(layerNum);
  layerList.appendChild(layerItem);
}

function selectLayer(index) {
  currentLayer = index;
  
  // Update UI
  document.querySelectorAll('.layer-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function clearMap() {
  if (!confirm('Are you sure you want to clear the entire map?')) return;
  
  mapData.layers.forEach(layer => {
    layer.tiles = Array(mapData.height).fill(null).map(() => Array(mapData.width).fill(0));
  });
  
  drawGrid();
}

function generateMapData() {
  mapData.name = document.getElementById('mapName').value;
  
  const jsonData = {
    name: mapData.name,
    type: mapData.type,
    width: mapData.width,
    height: mapData.height,
    tileSize: mapData.tileSize,
    layers: mapData.layers.map(layer => ({
      name: layer.name,
      tiles: layer.tiles
    })),
    tileset: mapData.tileset ? {
      name: mapData.tileset.name,
      // Tileset data would be embedded or referenced
    } : null,
    metadata: {
      createdAt: new Date().toISOString(),
      engine: 'PNP Game Engine',
      version: '1.0.0'
    }
  };
  
  // Generate TypeScript integration code
  const tsCode = generateTypeScriptCode(mapData.name, jsonData);
  
  // Show in console
  console.log('Generated Map Data:', jsonData);
  console.log('TypeScript Code:', tsCode);
  
  alert('Map data generated! Check the browser console for output.');
}

function generateTypeScriptCode(mapName, jsonData) {
  const safeName = mapName.replace(/[^a-zA-Z0-9]/g, '');
  
  return `import { getGame } from '@pnp/game-core-client';

// Load the ${mapName} map
export function load${safeName}Map() {
  const mapBuilder = getGame().getMapBuilder();
  
  // Set map configuration
  mapBuilder.setMapSize(${jsonData.width}, ${jsonData.height});
  mapBuilder.setTileSize(${jsonData.tileSize}, ${jsonData.tileSize});
  
  // Create layers
${jsonData.layers.map((layer, i) => `  mapBuilder.createLayer('${layer.name}');`).join('\n')}
  
  // TODO: Add tiles based on your tileset
  // Example: mapBuilder.setTile('layer1', x, y, tileId);
  
  return mapBuilder;
}

// Map data
export const ${safeName}MapData = ${JSON.stringify(jsonData, null, 2)};
`;
}

function downloadMapData() {
  mapData.name = document.getElementById('mapName').value;
  
  const jsonData = {
    name: mapData.name,
    type: mapData.type,
    width: mapData.width,
    height: mapData.height,
    tileSize: mapData.tileSize,
    layers: mapData.layers.map(layer => ({
      name: layer.name,
      tiles: layer.tiles
    })),
    tileset: mapData.tileset,
    metadata: {
      createdAt: new Date().toISOString(),
      engine: 'PNP Game Engine',
      version: '1.0.0'
    }
  };
  
  // Create JSON file
  const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement('a');
  jsonLink.href = jsonUrl;
  jsonLink.download = `${mapData.name.replace(/[^a-zA-Z0-9]/g, '_')}_map.json`;
  jsonLink.click();
  
  // Create TypeScript file
  const tsCode = generateTypeScriptCode(mapData.name, jsonData);
  const tsBlob = new Blob([tsCode], { type: 'text/typescript' });
  const tsUrl = URL.createObjectURL(tsBlob);
  const tsLink = document.createElement('a');
  tsLink.href = tsUrl;
  tsLink.download = `${mapData.name.replace(/[^a-zA-Z0-9]/g, '_')}_map.ts`;
  
  // Download both files
  setTimeout(() => {
    tsLink.click();
    URL.revokeObjectURL(jsonUrl);
    URL.revokeObjectURL(tsUrl);
  }, 100);
  
  alert('Map files downloaded successfully!');
}
