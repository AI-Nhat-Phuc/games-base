/**
 * Character Builder JavaScript
 * Handles file uploads, data generation, and export
 */

let characterData = {
  name: 'Hero',
  id: 'hero_001',
  description: 'A brave hero ready for adventure',
  sprite: null,
  animationSheet: null,
  voice: null,
  stats: {
    health: 100,
    maxHealth: 100,
    speed: 200,
    strength: 10,
    defense: 5,
    level: 1
  },
  size: {
    width: 32,
    height: 32
  },
  animation: {
    frameCount: 4,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 100
  }
};

// File upload handlers
document.getElementById('spriteUpload').addEventListener('change', function(e) {
  handleFileUpload(e, 'sprite', 'spritePreview', 'spriteLabel');
});

document.getElementById('animationUpload').addEventListener('change', function(e) {
  handleFileUpload(e, 'animationSheet', 'animationPreview', 'animationLabel');
});

document.getElementById('voiceUpload').addEventListener('change', function(e) {
  handleFileUpload(e, 'voice', 'voicePreview', 'voiceLabel', true);
});

function handleFileUpload(event, dataKey, previewId, labelId, isAudio = false) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = function(e) {
    characterData[dataKey] = {
      filename: file.name,
      data: e.target.result,
      type: file.type,
      size: file.size
    };

    // Update preview
    const preview = document.getElementById(previewId);
    const label = document.getElementById(labelId);
    
    if (isAudio) {
      preview.innerHTML = `
        <div style="width: 100%;">
          <audio controls style="width: 100%;">
            <source src="${e.target.result}" type="${file.type}">
          </audio>
          <div style="margin-top: 10px; font-size: 12px; color: #666;">
            ${file.name} (${formatFileSize(file.size)})
          </div>
        </div>
      `;
      label.textContent = '✅ ' + file.name;
    } else {
      preview.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
      label.textContent = '✅ ' + file.name;
    }

    // Mark button as uploaded
    label.closest('.file-upload-btn').classList.add('uploaded');
  };

  if (isAudio) {
    reader.readAsDataURL(file);
  } else {
    reader.readAsDataURL(file);
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function generateCharacter() {
  // Collect all form data
  characterData.name = document.getElementById('charName').value;
  characterData.id = document.getElementById('charId').value;
  characterData.description = document.getElementById('charDescription').value;
  
  characterData.stats = {
    health: parseInt(document.getElementById('health').value),
    maxHealth: parseInt(document.getElementById('maxHealth').value),
    speed: parseInt(document.getElementById('speed').value),
    strength: parseInt(document.getElementById('strength').value),
    defense: parseInt(document.getElementById('defense').value),
    level: parseInt(document.getElementById('level').value)
  };

  characterData.size = {
    width: parseInt(document.getElementById('width').value),
    height: parseInt(document.getElementById('height').value)
  };

  characterData.animation = {
    frameCount: parseInt(document.getElementById('frameCount').value),
    frameWidth: parseInt(document.getElementById('frameWidth').value),
    frameHeight: parseInt(document.getElementById('frameHeight').value),
    frameDuration: parseInt(document.getElementById('frameDuration').value)
  };

  // Generate output
  generateJSONOutput();
  generateTypeScriptOutput();

  // Show success message
  const successMessage = document.getElementById('successMessage');
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

function generateJSONOutput() {
  const output = {
    id: characterData.id,
    name: characterData.name,
    description: characterData.description,
    stats: characterData.stats,
    size: characterData.size,
    animation: characterData.animation,
    assets: {
      sprite: characterData.sprite ? characterData.sprite.filename : null,
      animationSheet: characterData.animationSheet ? characterData.animationSheet.filename : null,
      voice: characterData.voice ? characterData.voice.filename : null
    }
  };

  const jsonOutput = document.getElementById('jsonOutput');
  jsonOutput.textContent = JSON.stringify(output, null, 2);
}

function generateTypeScriptOutput() {
  const hasSprite = characterData.sprite !== null;
  const hasAnimation = characterData.animationSheet !== null;
  const hasVoice = characterData.voice !== null;

  const code = `import { CharacterBuilder } from '@games-base/client';

// Create character builder
const characterBuilder = new CharacterBuilder();

// Create character: ${characterData.name}
const ${characterData.id} = characterBuilder.createCharacter(
  '${characterData.id}',
  '${characterData.name}',
  { x: 100, y: 100 }, // Initial position
  { width: ${characterData.size.width}, height: ${characterData.size.height} },
  {
    health: ${characterData.stats.health},
    maxHealth: ${characterData.stats.maxHealth},
    speed: ${characterData.stats.speed},
    strength: ${characterData.stats.strength},
    defense: ${characterData.stats.defense}
  }
);

${hasSprite ? `// Set sprite
// Load sprite image first using AssetLoader
// assetLoader.loadImage('${characterData.id}_sprite', '/path/to/${characterData.sprite.filename}');
// const spriteImage = assetLoader.getImage('${characterData.id}_sprite');
// characterBuilder.setSprite('${characterData.id}', {
//   image: spriteImage,
//   size: { width: ${characterData.size.width}, height: ${characterData.size.height} }
// });
` : '// No sprite uploaded\n'}
${hasAnimation ? `// Add animation
// Animation sheet: ${characterData.animationSheet.filename}
// Frame count: ${characterData.animation.frameCount}
// Frame size: ${characterData.animation.frameWidth}x${characterData.animation.frameHeight}
// Frame duration: ${characterData.animation.frameDuration}ms

const animation = {
  name: 'walk',
  frames: [
    // Generate frames from animation sheet
    ${Array.from({ length: characterData.animation.frameCount }, (_, i) => `
    {
      sprite: {
        image: animationSheetImage,
        sourceRect: {
          x: ${i * characterData.animation.frameWidth},
          y: 0,
          width: ${characterData.animation.frameWidth},
          height: ${characterData.animation.frameHeight}
        },
        size: { width: ${characterData.animation.frameWidth}, height: ${characterData.animation.frameHeight} }
      },
      duration: ${characterData.animation.frameDuration}
    }`).join(',\n    ')}
  ],
  loop: true
};

characterBuilder.addAnimation('${characterData.id}', animation);
characterBuilder.setAnimation('${characterData.id}', 'walk');
` : '// No animation sheet uploaded\n'}
${hasVoice ? `// Voice/Sound effects
// Load audio: ${characterData.voice.filename}
// assetLoader.loadSound('${characterData.id}_voice', '/path/to/${characterData.voice.filename}');
// assetLoader.playSound('${characterData.id}_voice');
` : '// No voice uploaded\n'}
// Render the character
// characterBuilder.render(ctx, ${characterData.id});
`;

  const tsOutput = document.getElementById('tsOutput');
  tsOutput.textContent = code;
}

function downloadCharacter() {
  // Prepare download package
  const downloadData = {
    metadata: {
      id: characterData.id,
      name: characterData.name,
      description: characterData.description,
      stats: characterData.stats,
      size: characterData.size,
      animation: characterData.animation,
      generatedAt: new Date().toISOString()
    },
    assets: {
      sprite: characterData.sprite,
      animationSheet: characterData.animationSheet,
      voice: characterData.voice
    }
  };

  // Create blob and download
  const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${characterData.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Show success
  alert(`Character data downloaded as ${characterData.id}.json\n\nYou can now use this data with the game engine!`);
}

function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Add active class to clicked tab
  event.target.classList.add('active');
  document.getElementById(tabName + '-content').classList.add('active');
}

// Initialize with default data
window.addEventListener('load', () => {
  generateCharacter();
});
