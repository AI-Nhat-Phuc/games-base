# Publishing to NPM Registry

This guide explains how to use the GitHub Actions workflow to publish packages to the NPM registry.

## Prerequisites

### 1. Create an NPM Account
If you don't have one already:
- Go to [npmjs.com](https://www.npmjs.com/)
- Sign up for a free account
- Verify your email address

### 2. Generate an NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type (recommended for CI/CD)
5. Copy the generated token (starts with `npm_...`)

### 3. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM access token
6. Click **Add secret**

## Publishing Methods

### Method 1: Manual Trigger (Recommended for Testing)

1. Go to **Actions** tab in your GitHub repository
2. Select **Publish CLI to NPM** workflow
3. Click **Run workflow**
4. Choose which package to publish:
   - `cli` - Only CLI tool
   - `base` - Only base client engine
   - `server` - Only server engine
   - `all` - All packages
5. Click **Run workflow**

### Method 2: Automatic on Release

When you create a GitHub Release:
1. Go to **Releases** → **Draft a new release**
2. Create a new tag (e.g., `v1.0.0`, `cli-v1.0.0`)
3. Fill in release notes
4. Click **Publish release**
5. The workflow will automatically trigger and publish packages

### Method 3: Automatic on Push (with commit message)

Include `[publish-cli]` in your commit message:
```bash
git commit -m "Update CLI features [publish-cli]"
git push origin main
```

The workflow will automatically trigger when:
- Changes are made to the `cli/` directory
- Commit message contains `[publish-cli]`
- Push is to the `main` branch

## Workflow Features

### ✅ What It Does

1. **Checks out** your repository code
2. **Sets up Node.js** 18 with npm registry authentication
3. **Installs dependencies** for the selected package(s)
4. **Builds** the TypeScript code
5. **Runs tests** (if available, non-blocking)
6. **Publishes** to npm with public access
7. **Creates release notes** in the workflow summary

### 🔒 Security

- Uses GitHub Secrets to securely store NPM token
- Token is never exposed in logs
- Public access scope for community packages

### 📦 Supported Packages

| Package | NPM Name | Description |
|---------|----------|-------------|
| CLI | `@games-base/cli` | Command-line tool for project creation |
| Base | `@games-base/client` | Client-side 2D game engine |
| Server | `@games-base/server` | Multiplayer server engine |

## Package Versioning

Before publishing, update the version in `package.json`:

```bash
cd cli
npm version patch  # 1.0.0 → 1.0.1
# or
npm version minor  # 1.0.0 → 1.1.0
# or
npm version major  # 1.0.0 → 2.0.0
```

Then commit and push:
```bash
git add cli/package.json
git commit -m "Bump CLI version to 1.0.1"
git push
```

## Verifying Publication

After the workflow completes:

1. Check the **Actions** tab for workflow status
2. View npm registry:
   - CLI: https://www.npmjs.com/package/@games-base/cli
   - Base: https://www.npmjs.com/package/@games-base/client
   - Server: https://www.npmjs.com/package/@games-base/server

3. Test installation:
```bash
npx @games-base/cli@latest create test-game
```

## Troubleshooting

### Error: "You must be logged in to publish packages"
- Verify `NPM_TOKEN` secret is set correctly in GitHub
- Ensure token has not expired
- Check token has **Automation** or **Publish** permissions

### Error: "Package already exists"
- You cannot publish the same version twice
- Increment version number in `package.json`

### Error: "Package name too similar to existing package"
- NPM prevents similar names to avoid confusion
- Consider renaming your package in `package.json`

### Error: "You do not have permission to publish"
- Scoped packages (`@games-base/...`) require organization membership
- Ensure you're a member of the `games-base` organization on npm
- Or create the organization first: https://www.npmjs.com/org/create

## Best Practices

1. **Test locally first:**
   ```bash
   cd cli
   npm run build
   npm pack
   # Test the generated .tgz file
   ```

2. **Update CHANGELOG.md** before publishing

3. **Use semantic versioning:**
   - PATCH: Bug fixes (1.0.0 → 1.0.1)
   - MINOR: New features (1.0.0 → 1.1.0)
   - MAJOR: Breaking changes (1.0.0 → 2.0.0)

4. **Tag releases** with meaningful names:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

5. **Test in a clean environment** after publishing:
   ```bash
   npx @games-base/cli@latest create test-project
   ```

## Manual Publishing (Alternative)

If you prefer to publish manually without GitHub Actions:

```bash
# Login to npm
npm login

# Build and publish CLI
cd cli
npm run build
npm publish --access public

# Build and publish Base
cd ../base
npm run build
npm publish --access public

# Build and publish Server
cd ../server
npm run build
npm publish --access public
```

## Support

For issues with the publishing workflow:
- Check workflow logs in **Actions** tab
- Review NPM token permissions
- Verify package.json configuration
- Open an issue in the repository
