# Publishing to NPM Registry

This guide explains how to use the GitHub Actions workflow to publish packages to the NPM registry with automatic versioning.

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

## Versioning Strategy

The workflow automatically handles versioning based on the branch:

### Main Branch (Production)
- **Version**: Uses version from `package.json` (e.g., `1.0.0`)
- **NPM Tag**: `latest`
- **When**: Automatically publishes when changes are pushed to `main` branch
- **Install**: `npm install @pnp/game-core-client` (gets latest version)

### Pull Request Branch (Beta/Development)
- **Version**: `{base-version}-beta-pr-{pr-number}.{timestamp}` (e.g., `1.0.0-beta-pr-123.20241101120000`)
- **NPM Tag**: `beta`
- **When**: Automatically publishes when PR is opened/updated
- **Install**: `npm install @pnp/game-core-client@1.0.0-beta-pr-123.20241101120000`

## Publishing Methods

### Method 1: Automatic on Main Branch (Production Release)

When you merge a PR or push to `main` branch:
```bash
git checkout main
git pull
# Make changes to packages
git add .
git commit -m "Update client engine with new features"
git push origin main
```

The workflow will:
1. Detect which packages changed
2. Publish only changed packages with `latest` tag
3. Use version from `package.json`

**Example**: If `base/package.json` has version `1.2.0`, it publishes `@pnp/game-core-client@1.2.0` with tag `latest`.

### Method 2: Automatic on Pull Request (Beta Release)

When you create or update a PR:
```bash
git checkout -b feature/new-map-builder
# Make changes
git add .
git commit -m "Add advanced map building features"
git push origin feature/new-map-builder
# Create PR on GitHub
```

The workflow will:
1. Detect which packages changed
2. Generate beta version: `{version}-beta-pr-{number}.{timestamp}`
3. Publish with `beta` tag

**Example**: PR #123 with `base/package.json` version `1.2.0` publishes as `@pnp/game-core-client@1.2.0-beta-pr-123.20241101120530` with tag `beta`.

### Method 3: Manual Trigger (Any Package, Any Time)

1. Go to **Actions** tab in your GitHub repository
2. Select **Publish Packages to NPM** workflow
3. Click **Run workflow**
4. Choose which package to publish:
   - `cli` - Only CLI tool
   - `client` - Only client engine
   - `server` - Only server engine
   - `builder` - Only character builder
   - `all` - All packages
5. Optionally check "Force publish even if no changes"
6. Click **Run workflow**

## Workflow Features

### ✅ What It Does

1. **Detects changes** in packages automatically
2. **Determines version** based on branch (main = latest, PR = beta)
3. **Checks out** your repository code
4. **Sets up Node.js** 18 with npm registry authentication
5. **Installs dependencies** for affected package(s)
6. **Builds** the TypeScript code
7. **Publishes** to npm with appropriate version and tag
8. **Creates release notes** in the workflow summary

### 🔒 Security

- Uses GitHub Secrets to securely store NPM token
- Token is never exposed in logs
- Public access scope for community packages

### 📦 Supported Packages

| Package | NPM Name | Description |
|---------|----------|-------------|
| CLI | `@pnp/cli` | Command-line tool for project creation |
| Client | `@pnp/game-core-client` | Client-side 2D game engine |
| Server | `@pnp/game-core-server` | Multiplayer server engine |
| Builder | `@pnp/builder` | Visual character creation tool |

## Package Versioning

### Updating Version for Production Release

Before merging to main, update the version in `package.json`:

```bash
cd cli  # or base, server, builders
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

### Beta Versions (Automatic)

Beta versions are automatically generated for PRs:
- Format: `{base-version}-beta-pr-{pr-number}.{timestamp}`
- Example: `1.0.0-beta-pr-45.20241101153025`
- No manual intervention needed

### Version Tags

- **latest**: Production releases from `main` branch
- **beta**: Development releases from PRs

## Installing Specific Versions

### Latest (Production)
```bash
npm install @pnp/game-core-client          # Installs latest
npm install @pnp/cli             # Installs latest
npx @pnp/cli create my-game      # Uses latest
```

### Beta (Development/Testing)
```bash
# Install specific beta version
npm install @pnp/game-core-client@1.0.0-beta-pr-45.20241101153025

# Install latest beta
npm install @pnp/game-core-client@beta

# Use specific beta CLI
npx @pnp/cli@1.0.0-beta-pr-45.20241101153025 create my-game
```

## Verifying Publication

After the workflow completes:

1. Check the **Actions** tab for workflow status
2. View npm registry:
   - CLI: https://www.npmjs.com/package/@pnp/cli
   - Client: https://www.npmjs.com/package/@pnp/game-core-client
   - Server: https://www.npmjs.com/package/@pnp/game-core-server
   - Builder: https://www.npmjs.com/package/@pnp/builder

3. Test installation:
```bash
# Test latest production version
npx @pnp/cli@latest create test-game

# Test specific beta version
npx @pnp/cli@1.0.0-beta-pr-123.20241101120000 create test-game
```

## Workflow Scenarios

### Scenario 1: Feature Development
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes to `base/` (client engine)
3. Commit and push: Creates PR
4. **Automatic**: Publishes `@pnp/game-core-client@1.0.0-beta-pr-45.{timestamp}` with tag `beta`
5. Test beta version in other projects
6. Merge to main after approval
7. **Automatic**: Publishes `@pnp/game-core-client@1.0.0` with tag `latest`

### Scenario 2: Bug Fix
1. Update version: `cd base && npm version patch` (1.0.0 → 1.0.1)
2. Commit: `git commit -m "Fix character collision bug"`
3. Push to main: `git push origin main`
4. **Automatic**: Publishes `@pnp/game-core-client@1.0.1` with tag `latest`

### Scenario 3: Multiple Package Update
1. Make changes to `cli/`, `base/`, and `server/`
2. Push to main
3. **Automatic**: Publishes all 3 packages with their respective versions

### Scenario 4: Manual Override
1. Go to Actions → Publish Packages to NPM
2. Click "Run workflow"
3. Select package or "all"
4. Check "Force publish" if needed
5. Publishes selected package(s) regardless of changes

## Troubleshooting

### Error: "You must be logged in to publish packages"
- Verify `NPM_TOKEN` secret is set correctly in GitHub
- Ensure token has not expired
- Check token has **Automation** or **Publish** permissions

### Error: "Package already exists"
- You cannot publish the same version twice
- For production: Increment version number in `package.json`
- For beta: Version is auto-generated with timestamp, should not conflict

### Error: "Package name too similar to existing package"
- NPM prevents similar names to avoid confusion
- Consider renaming your package in `package.json`

### Error: "You do not have permission to publish"
- Scoped packages (`@pnp/...`) require organization membership
- Ensure you're a member of the `pnp` organization on npm
- Or create the organization first: https://www.npmjs.com/org/create

### Workflow doesn't trigger automatically
- Check if files in the package directory actually changed
- Verify GitHub Actions are enabled in repository settings
- Check workflow file syntax in `.github/workflows/publish-packages.yml`

### Beta version not appearing
- PR must be open and synchronized
- Check Actions tab for workflow run
- Verify changes exist in the package directory

## Best Practices

1. **Test locally first:**
   ```bash
   cd cli
   npm run build
   npm pack
   # Test the generated .tgz file
   ```

2. **Use semantic versioning:**
   - PATCH: Bug fixes (1.0.0 → 1.0.1)
   - MINOR: New features (1.0.0 → 1.1.0)
   - MAJOR: Breaking changes (1.0.0 → 2.0.0)

3. **Test beta versions before production:**
   - Create PR to test beta version
   - Install and test: `npm install @pnp/game-core-client@beta`
   - Merge to main only after testing

4. **Update CHANGELOG.md** before releasing to production

5. **Review workflow summary** after each publish to verify success

6. **Use beta versions for testing:**
   ```bash
   # In your test project
   npm install @pnp/game-core-client@beta
   npm install @pnp/cli@1.0.0-beta-pr-45.20241101120000
   ```

7. **Coordinate multi-package releases:**
   - Update all affected package versions together
   - Push to main in a single commit
   - All packages publish automatically

## Manual Publishing (Alternative)

If you prefer to publish manually without GitHub Actions:

```bash
# Login to npm
npm login

# Build and publish CLI
cd cli
npm version patch  # Update version
npm run build
npm publish --access public

# Build and publish Client
cd ../base
npm version patch
npm run build
npm publish --access public

# Build and publish Server
cd ../server
npm version patch
npm run build
npm publish --access public

# Build and publish Builder
cd ../builders
npm version patch
npm run build
npm publish --access public
```

## Support

For issues with the publishing workflow:
- Check workflow logs in **Actions** tab
- Review NPM token permissions
- Verify package.json configuration
- Ensure `@pnp` organization exists on NPM
- Open an issue in the repository
