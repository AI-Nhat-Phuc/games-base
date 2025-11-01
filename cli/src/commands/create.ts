/**
 * Create command - Creates a new game project
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';

interface CreateOptions {
  template: string;
  install: boolean;
}

async function createCommand(projectName: string, options: CreateOptions) {
  const projectPath = path.resolve(process.cwd(), projectName);

  console.log(chalk.cyan(`\n🎮 Creating game project: ${chalk.bold(projectName)}\n`));

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Directory ${projectName} already exists!`));
    process.exit(1);
  }

  const spinner = ora('Setting up project structure...').start();

  try {
    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });

    // Create project structure
    const directories = [
      'src',
      'src/assets',
      'src/assets/images',
      'src/assets/sounds',
      'src/characters',
      'public'
    ];

    directories.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });

    spinner.text = 'Generating project files...';

    // Create package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: 'Game project created with games-base CLI',
      main: 'src/index.js',
      scripts: {
        start: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        '@games-base/client': 'file:../base'
      },
      devDependencies: {
        'vite': '^5.0.0',
        'typescript': '^5.0.0'
      }
    };

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create index.html
    const indexHtml = generateIndexHtml(projectName);
    fs.writeFileSync(path.join(projectPath, 'index.html'), indexHtml);

    // Create main game file
    const mainGame = generateMainGame(options.template);
    fs.writeFileSync(path.join(projectPath, 'src', 'main.ts'), mainGame);

    // Create credit screen
    const creditScreen = generateCreditScreen();
    fs.writeFileSync(path.join(projectPath, 'src', 'credits.ts'), creditScreen);

    // Create vite config
    const viteConfig = generateViteConfig();
    fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), viteConfig);

    // Create tsconfig
    const tsConfig = generateTsConfig();
    fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), tsConfig);

    // Create README
    const readme = generateReadme(projectName);
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme);

    spinner.succeed('Project structure created!');

    // Install dependencies
    if (options.install) {
      spinner.start('Installing dependencies...');
      try {
        execSync('npm install', {
          cwd: projectPath,
          stdio: 'pipe'
        });
        spinner.succeed('Dependencies installed!');
      } catch (error) {
        spinner.warn('Failed to install dependencies. Run npm install manually.');
      }
    }

    console.log(chalk.green('\n✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${projectName}`));
    if (!options.install) {
      console.log(chalk.white('  npm install'));
    }
    console.log(chalk.white('  npm start'));
    console.log();

  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

function generateIndexHtml(projectName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #1a1a2e;
      font-family: Arial, sans-serif;
    }
    #gameCanvas {
      border: 2px solid #4CAF50;
      box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
`;
}

function generateMainGame(template: string): string {
  return `import { initGame, getGame } from '@games-base/client';
import { showCredits } from './credits';

// Initialize the game
initGame({
  canvasId: 'gameCanvas',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  targetFPS: 60
});

// Show credits first
showCredits().then(() => {
  // Start the game after credits
  startGame();
});

function startGame() {
  const game = getGame();
  const characterBuilder = game.getCharacterBuilder();
  const inputManager = game.getInputManager();
  const effectBuilder = game.getEffectBuilder();

  // Create player character
  const player = characterBuilder.createCharacter(
    'player1',
    'Hero',
    { x: 400, y: 300 },
    { width: 32, height: 32 },
    { health: 100, maxHealth: 100, speed: 200 }
  );

  // Game loop
  const engine = game.getEngine();
  const originalUpdate = (engine as any).update.bind(engine);
  const originalRender = (engine as any).render.bind(engine);

  (engine as any).update = (deltaTime: number) => {
    originalUpdate(deltaTime);
    handleInput(deltaTime);
    effectBuilder.update(deltaTime);
  };

  (engine as any).render = () => {
    originalRender();
    const ctx = engine.getContext();
    characterBuilder.render(ctx, player);
    effectBuilder.render(ctx);
  };

  function handleInput(deltaTime: number) {
    const speed = player.stats.speed * deltaTime;

    if (inputManager.isKeyPressed('ArrowUp') || inputManager.isKeyPressed('KeyW')) {
      characterBuilder.moveCharacter('player1', 0, -speed);
    }
    if (inputManager.isKeyPressed('ArrowDown') || inputManager.isKeyPressed('KeyS')) {
      characterBuilder.moveCharacter('player1', 0, speed);
    }
    if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('KeyA')) {
      characterBuilder.moveCharacter('player1', -speed, 0);
    }
    if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('KeyD')) {
      characterBuilder.moveCharacter('player1', speed, 0);
    }

    if (inputManager.isKeyPressed('Space')) {
      effectBuilder.createExplosion(
        player.transform.position,
        {
          particleCount: 20,
          particleLife: 1.0,
          particleSize: 4,
          color: { r: 1, g: 0.5, b: 0 },
          spread: 100,
          velocity: 150,
          gravity: 50
        }
      );
    }
  }

  console.log('🎮 Game started! Use WASD or Arrow keys to move, Space for effects.');
}
`;
}

function generateCreditScreen(): string {
  return `import { getGame } from '@games-base/client';

export function showCredits(): Promise<void> {
  return new Promise((resolve) => {
    const game = getGame();
    const engine = game.getEngine();
    const ctx = engine.getContext();
    const canvas = engine.getCanvas();

    let alpha = 0;
    let phase = 'fadein'; // fadein, show, fadeout
    let showTime = 0;

    const credits = [
      { text: 'Made with', size: 24, y: 250 },
      { text: 'Games Base Engine', size: 48, y: 300, color: '#4CAF50' },
      { text: 'Press any key to start', size: 18, y: 400, color: '#888' }
    ];

    function renderCredits() {
      ctx.fillStyle = '#0a0a1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = alpha;

      credits.forEach(credit => {
        ctx.fillStyle = credit.color || '#ffffff';
        ctx.font = \`\${credit.size}px Arial\`;
        ctx.textAlign = 'center';
        ctx.fillText(credit.text, canvas.width / 2, credit.y);
      });

      ctx.restore();
    }

    function updateCredits(deltaTime: number) {
      if (phase === 'fadein') {
        alpha += deltaTime * 0.5;
        if (alpha >= 1) {
          alpha = 1;
          phase = 'show';
        }
      } else if (phase === 'show') {
        showTime += deltaTime;
        if (showTime > 2) {
          phase = 'fadeout';
        }
      } else if (phase === 'fadeout') {
        alpha -= deltaTime * 0.5;
        if (alpha <= 0) {
          alpha = 0;
          cleanup();
          resolve();
        }
      }
    }

    let animationId: number;
    let lastTime = performance.now();

    function creditLoop(currentTime: number) {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      updateCredits(deltaTime);
      renderCredits();

      if (phase !== 'done') {
        animationId = requestAnimationFrame(creditLoop);
      }
    }

    function skipCredits() {
      phase = 'done';
      cancelAnimationFrame(animationId);
      cleanup();
      resolve();
    }

    function cleanup() {
      window.removeEventListener('keydown', skipCredits);
      window.removeEventListener('click', skipCredits);
    }

    // Allow skipping credits
    window.addEventListener('keydown', skipCredits);
    window.addEventListener('click', skipCredits);

    animationId = requestAnimationFrame(creditLoop);
  });
}
`;
}

function generateViteConfig(): string {
  return `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
`;
}

function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`;
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

Game project created with games-base CLI.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── main.ts          # Main game file
│   ├── credits.ts       # Credit screen
│   ├── assets/          # Game assets
│   │   ├── images/      # Image files
│   │   └── sounds/      # Sound files
│   └── characters/      # Character data files
├── public/              # Static files
├── index.html           # Entry HTML
└── package.json
\`\`\`

## Building Characters

Use the CLI to build characters with animations:

\`\`\`bash
npx games-base build-character \\
  --name Hero \\
  --sprite ./assets/hero.png \\
  --walk ./assets/hero_walk.png \\
  --run ./assets/hero_run.png \\
  --attack ./assets/hero_attack.png \\
  --injured ./assets/hero_injured.png \\
  --dead ./assets/hero_dead.png \\
  --output ./src/characters
\`\`\`

## Controls

- WASD or Arrow Keys: Move character
- Space: Create explosion effect

## Powered by

Built with [games-base](https://github.com/AI-Nhat-Phuc/games-base) engine.
`;
}

export = createCommand;
