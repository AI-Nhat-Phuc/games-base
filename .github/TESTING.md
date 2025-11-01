# Testing Guide

This document describes the automated testing workflows for the @pnp monorepo packages.

## Overview

The monorepo includes comprehensive automated testing for all packages:

- **CLI Testing** (`.github/workflows/test-cli.yml`)
- **Package Testing** (`.github/workflows/test-packages.yml`)

## Test CLI Workflow

### Purpose
Tests the `@pnp/cli` package across multiple operating systems and Node.js versions.

### Triggers
- Push to `main` or `develop` branches (when CLI files change)
- Pull requests affecting CLI files
- Manual workflow dispatch

### Test Matrix
- **Operating Systems**: Ubuntu, Windows, macOS
- **Node.js Versions**: 18, 20

### Test Coverage

#### 1. CLI Build Test
```bash
npm run build
```
Verifies TypeScript compilation succeeds.

#### 2. CLI Commands Test
```bash
node ./bin/pnp.js --version
node ./bin/pnp.js --help
```
Ensures CLI commands are executable.

#### 3. Create Command Test
```bash
pnp create test-game --skip-install
```
Tests project scaffolding functionality.

#### 4. Integration Test
- Creates a complete project
- Verifies all required files exist
- Installs dependencies
- Builds the created project
- Tests character builder command

### Running CLI Tests Locally

```bash
# Navigate to CLI directory
cd cli

# Install dependencies
npm install

# Build
npm run build

# Test version command
node ./bin/pnp.js --version

# Test create command
mkdir ../test-project
cd ../test-project
node ../cli/bin/pnp.js create my-game
cd my-game
npm install
npm run build
```

## Test Packages Workflow

### Purpose
Tests all monorepo packages: client, server, and builder.

### Triggers
- Push to `main` or `develop` branches (when package files change)
- Pull requests affecting package files
- Manual workflow dispatch

### Package Tests

#### 1. Test Client Package (@pnp/game-core-client)

**Steps:**
- Install dependencies
- Run ESLint
- Build TypeScript
- Run tests
- Verify build output (dist/index.js, dist/index.d.ts)
- Check exports

**Local Testing:**
```bash
cd base
npm install
npm run lint
npm run build
npm test
```

#### 2. Test Server Package (@pnp/game-core-server)

**Steps:**
- Install dependencies
- Run ESLint
- Build TypeScript
- Run tests
- Verify build output
- Test server instantiation

**Local Testing:**
```bash
cd server
npm install
npm run lint
npm run build
npm test
node -e "const {GameServer} = require('./dist/index.js'); new GameServer({port:0})"
```

#### 3. Test Builder Package (@pnp/builder)

**Steps:**
- Install dependencies
- Verify folder structure (character-builder, map-builder)
- Test server startup
- Verify HTML files exist

**Local Testing:**
```bash
cd builders
npm install
npm start
# Open http://localhost:3000 in browser
```

#### 4. Package Compatibility Test

Tests that client and server packages can coexist and work together.

**Local Testing:**
```bash
# Build all packages
cd base && npm install && npm run build && cd ..
cd server && npm install && npm run build && cd ..

# Test compatibility
node -e "
const client = require('./base/dist/index.js');
const server = require('./server/dist/index.js');
console.log('Compatible');
"
```

#### 5. Monorepo Setup Test

Verifies the entire workspace can be built together.

**Local Testing:**
```bash
# From root directory
npm install

# Build each package
cd base && npm install && npm run build && cd ..
cd cli && npm install && npm run build && cd ..
cd server && npm install && npm run build && cd ..
cd builders && npm install && cd ..
```

#### 6. Security Audit

Runs `npm audit` on all packages to check for vulnerabilities.

**Local Testing:**
```bash
# Audit each package
cd base && npm audit
cd ../cli && npm audit
cd ../server && npm audit
cd ../builders && npm audit
```

## Continuous Integration Status

### Branch Protection
All tests must pass before merging to `main`:
- ✅ CLI tests pass on all platforms
- ✅ All packages build successfully
- ✅ Linting passes
- ✅ Security audit has no critical issues

### Test Artifacts
Failed test runs upload artifacts for debugging:
- CLI test artifacts (by OS and Node version)
- Package build outputs
- Integration test results

**Retention**: 7 days

## Adding New Tests

### For CLI Tests
Add test cases to `.github/workflows/test-cli.yml`:

```yaml
- name: Test new command
  working-directory: ./cli
  run: |
    node ./bin/pnp.js your-command --test
```

### For Package Tests
Add test cases to `.github/workflows/test-packages.yml`:

```yaml
- name: Test new feature
  working-directory: ./base
  run: |
    npm run test:feature
```

### For Unit Tests
Add test files to each package:

```bash
# Client package
base/src/__tests__/feature.test.ts

# Server package
server/src/__tests__/feature.test.ts
```

Update `package.json` test script:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Troubleshooting

### CLI Tests Failing

**Issue**: CLI command not found
```bash
# Check if build succeeded
cd cli
npm run build
ls -la bin/
ls -la dist/
```

**Issue**: Create command fails
```bash
# Test manually
node ./bin/pnp.js create test-project --skip-install
cd test-project
ls -la
```

### Package Tests Failing

**Issue**: Build fails
```bash
# Check TypeScript errors
cd base
npm run build
# Review error messages
```

**Issue**: Lint fails
```bash
# Run linter with fix
cd base
npm run lint -- --fix
```

### Integration Tests Failing

**Issue**: Created project won't build
```bash
# Verify template files
cd cli/templates/
ls -la
# Check package.json dependencies
```

## Manual Testing Checklist

Before submitting a PR, verify locally:

- [ ] CLI creates projects successfully
- [ ] Created projects build without errors
- [ ] All packages build (`npm run build`)
- [ ] All linters pass (`npm run lint`)
- [ ] Security audit has no critical issues (`npm audit`)
- [ ] Character builder UI loads
- [ ] Map builder UI loads
- [ ] Server starts without errors

## GitHub Actions Badges

Add these to your README.md:

```markdown
![Test CLI](https://github.com/AI-Nhat-Phuc/games-base/workflows/Test%20CLI/badge.svg)
![Test Packages](https://github.com/AI-Nhat-Phuc/games-base/workflows/Test%20Packages/badge.svg)
```

## Future Enhancements

Planned testing improvements:

- [ ] Add Jest/Mocha unit tests for client engine
- [ ] Add integration tests for server WebSocket functionality
- [ ] Add E2E tests for builder tools
- [ ] Add performance benchmarks
- [ ] Add test coverage reporting
- [ ] Add visual regression tests for builders
- [ ] Add cross-browser testing for client engine

## Support

For issues with tests:
1. Check workflow run logs in GitHub Actions tab
2. Download test artifacts for detailed debugging
3. Run tests locally to reproduce issues
4. Review this guide for troubleshooting steps
