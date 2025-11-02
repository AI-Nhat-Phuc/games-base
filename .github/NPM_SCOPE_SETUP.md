# NPM Scope Setup Guide

## Problem: 404 Not Found Error When Publishing

If you see errors like:
```
npm error 404 Not Found - PUT https://registry.npmjs.org/@nhatphucpham%2fbuilder
npm error 404 Not found
```

This means the `@nhatphucpham` scope doesn't exist or you don't have permission to publish to it.

## Solutions

### Option 1: Create the @nhatphucpham Organization on NPM (Recommended if you control @nhatphucpham)

1. Go to https://www.npmjs.com/org/create
2. Create an organization named `pnp`
3. Add your NPM account as a member with publish permissions
4. Make sure your `NPM_TOKEN` secret has permissions for this organization

### Option 2: Change to Your Own Scope

If you don't control the `@nhatphucpham` scope, use your own NPM username or organization:

1. **Update package names** in all `package.json` files:

```bash
# Replace @nhatphucpham with @your-username or @your-org
# Example: @nhatphucpham/game-cli → @your-username/game-cli

# Update these files:
- base/package.json: "@nhatphucpham/game-core-client" → "@your-username/game-core-client"
- game-cli/package.json: "@nhatphucpham/game-cli" → "@your-username/game-cli"
- server/package.json: "@nhatphucpham/game-core-server" → "@your-username/game-core-server"
- builders/package.json: "@nhatphucpham/builder" → "@your-username/builder"
```

2. **Update imports in CLI templates** (`game-cli/src/commands/create.ts`):
```typescript
// Change from:
import { initGame } from '@nhatphucpham/game-core-client';

// To:
import { initGame } from '@your-username/game-core-client';
```

3. **Update documentation**:
   - README.md
   - MONOREPO.md
   - .github/PUBLISHING.md
   - docs/CLIENT_API.md
   - docs/SERVER_API.md

### Option 3: Publish Without Scope (Not Recommended)

Remove the scope entirely and use plain names:

```json
{
  "name": "games-base-client",  // instead of @nhatphucpham/game-core-client
  "name": "games-base-cli",     // instead of @nhatphucpham/game-cli
  "name": "games-base-server",  // instead of @nhatphucpham/game-core-server
  "name": "games-base-builder"  // instead of @nhatphucpham/builder
}
```

**Warning**: Plain names are harder to namespace and may conflict with existing packages.

## Quick Fix Script

Use this script to change all package names at once:

```bash
#!/bin/bash
# Replace YOUR_SCOPE with your NPM username or organization name
YOUR_SCOPE="your-username"

# Update package.json files
find . -name "package.json" -type f -exec sed -i "s/@nhatphucpham/@${YOUR_SCOPE}/g" {} +

# Update TypeScript files
find . -name "*.ts" -type f -exec sed -i "s/@nhatphucpham/@${YOUR_SCOPE}/g" {} +

# Update JavaScript files
find . -name "*.js" -type f -exec sed -i "s/@nhatphucpham/@${YOUR_SCOPE}/g" {} +

# Update Markdown files
find . -name "*.md" -type f -exec sed -i "s/@nhatphucpham/@${YOUR_SCOPE}/g" {} +

echo "Updated all files from @nhatphucpham to @${YOUR_SCOPE}"
echo "Please review changes and commit"
```

## Verify NPM Scope Access

Check if you can publish to a scope:

```bash
# Test with a dummy package
npm init --scope=@your-username -y
npm publish --access public --dry-run

# If this works, you can use @your-username as your scope
```

## NPM Token Permissions

Make sure your `NPM_TOKEN` has the right permissions:

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Create a token with **"Automation"** type (not "Publish" only)
3. If using an organization, ensure the token has publish rights to that organization
4. Add the token to GitHub Secrets as `NPM_TOKEN`

## Testing

After changing the scope, test locally before pushing:

```bash
# Build packages
cd base && npm run build && cd ..
cd cli && npm run build && cd ..
cd server && npm run build && cd ..

# Test publishing (dry-run)
cd base && npm publish --access public --dry-run
cd cli && npm publish --access public --dry-run
cd server && npm publish --access public --dry-run
cd builders && npm publish --access public --dry-run
```

If all dry-runs succeed, you're ready to publish!
