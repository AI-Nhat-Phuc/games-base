# Version and NPM Package Configuration Changes

## Issues Identified

### 1. Beta Versioning Format
**Previous format:** `1.0.0-beta-pr-123.20251101165530`  
**New format:** `1.0.0-beta.pr123.20251101165530`

While both formats are technically valid according to Semantic Versioning 2.0.0, the new format improves clarity:
- Uses dot notation consistently for all prerelease identifiers
- More readable: `beta.pr123.timestamp` vs `beta-pr-123.timestamp`
- Better aligns with semver best practices for prerelease identifiers
- Follows common npm package versioning patterns

### 2. NPM Package Availability
**Issue:** All `@nhatphucpham/*` packages return 404 errors from npm registry.

**Causes:**
- Packages have not been published to npm yet
- NPM_TOKEN secret may not be configured in GitHub repository
- The npm scope `@nhatphucpham` may not be registered or accessible

**Verification:**
```bash
npm view @nhatphucpham/cli  # 404 Not Found
npm view @nhatphucpham/game-core-client  # 404 Not Found
npm view @nhatphucpham/game-core-server  # 404 Not Found
npm view @nhatphucpham/builder  # 404 Not Found
```

## Changes Made

### 1. Updated Workflow File (`.github/workflows/publish-packages.yml`)
- Changed beta version format from `beta-pr-{number}` to `beta.pr{number}`
- Applied to all 4 package publishing jobs (cli, client, server, builder)
- Updated comments to clarify semantic versioning compliance

### 2. Added `publishConfig` to all package.json files
Added to: `cli/package.json`, `base/package.json`, `server/package.json`, `builders/package.json`

```json
"publishConfig": {
  "access": "public",
  "registry": "https://registry.npmjs.org/"
}
```

Benefits:
- Explicitly sets package access to public (required for scoped packages)
- Ensures correct registry is used during publishing
- Helps prevent accidental private package publishing

### 3. Created `.npmrc` file at repository root
```
@nhatphucpham:registry=https://registry.npmjs.org/
registry=https://registry.npmjs.org/
```

Benefits:
- Configures the npm registry for the @nhatphucpham scope
- Ensures consistent registry usage across all packages
- Helps with package resolution during development and CI/CD

## Next Steps Required

To complete the npm publishing setup, the repository owner needs to:

1. **Create or verify npm account ownership**
   - Ensure the npm username or organization `@nhatphucpham` exists
   - Log in to https://www.npmjs.com/

2. **Generate NPM_TOKEN**
   - Log in to npm: `npm login`
   - Generate automation token: `npm token create --type automation`
   - Or create token in npm web interface (Account Settings > Access Tokens)

3. **Add NPM_TOKEN to GitHub Secrets**
   - Go to repository Settings > Secrets and variables > Actions
   - Create new repository secret named `NPM_TOKEN`
   - Paste the npm automation token

4. **Test the publishing workflow**
   - Create a pull request to trigger beta publishing
   - Or manually trigger workflow from GitHub Actions tab
   - Verify packages are published with new version format

## Version Format Examples

**Main branch (latest):** `1.0.0`, `1.1.0`, `2.0.0`  
**PR branch (beta):** `1.0.0-beta.pr123.20251102020619`

The beta format includes:
- Base version: `1.0.0`
- Prerelease type: `beta`
- PR number: `pr123`
- Timestamp: `20251102020619` (YYYYMMDDHHmmss)
