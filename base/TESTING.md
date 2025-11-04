# Testing Guide

This project uses [Jest](https://jestjs.io/) as the unit testing framework for the game core library.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Coverage Requirements

The project maintains **>80% code coverage** across the game core:

- **Statements**: 95.25%
- **Branches**: 88%
- **Functions**: 96.87%
- **Lines**: 96.56%

## Test Structure

Tests are organized in `__tests__` directories next to the source files:

```
src/
├── builders/
│   ├── __tests__/
│   │   ├── CharacterBuilder.test.ts
│   │   ├── EffectBuilder.test.ts
│   │   └── MapBuilder.test.ts
├── core/
│   ├── __tests__/
│   │   ├── GameEngine.test.ts
│   │   ├── GameFactory.test.ts
│   │   └── GameManager.test.ts
└── utils/
    └── __tests__/
        ├── AssetLoader.test.ts
        └── InputManager.test.ts
```

## What's Tested

### Core Modules
- **GameEngine**: Canvas initialization, game loop, lifecycle management
- **GameManager**: Singleton pattern, resource management, initialization
- **GameFactory**: Fluent API, game creation helpers

### Builders
- **CharacterBuilder**: Character creation, movement, animations, stats, rendering
- **MapBuilder**: Tile maps, layers, collision detection, rendering
- **EffectBuilder**: Particle effects (explosions, trails, sparkles)

### Utilities
- **InputManager**: Keyboard and mouse input handling
- **AssetLoader**: Image and sound loading, playback controls

## Writing Tests

When adding new features:

1. Create a corresponding test file in the `__tests__` directory
2. Import testing utilities from `@jest/globals`
3. Use `describe` blocks to group related tests
4. Use `beforeEach`/`afterEach` for setup and cleanup
5. Mock external dependencies (DOM APIs, images, audio)

### Example Test

```typescript
import { describe, expect, test, beforeEach } from '@jest/globals';
import { MyBuilder } from '../MyBuilder';

describe('MyBuilder', () => {
  let builder: MyBuilder;

  beforeEach(() => {
    builder = new MyBuilder();
  });

  test('should create instance', () => {
    expect(builder).toBeDefined();
  });
});
```

## Mocking

The test environment includes:

- **jsdom**: Browser environment simulation
- **jest-canvas-mock**: Canvas API mocking
- Custom mocks for Image and Audio APIs

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before npm publish

## Troubleshooting

### Canvas-related errors
The project uses `jest-canvas-mock` to mock Canvas APIs. If you encounter canvas errors, ensure the setup files are configured correctly in `jest.config.js`.

### Async test timeouts
For long-running async tests, increase the timeout:
```typescript
test('long operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Coverage not meeting thresholds
Run tests with coverage to see which lines are not covered:
```bash
npm run test:coverage
```

Check the HTML coverage report in `coverage/lcov-report/index.html`.
