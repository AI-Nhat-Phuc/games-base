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
- **Added NPM token verification step** using `npm whoami` before publishing to catch authentication issues early
- **Added Git tag creation** after successful package publication to link versions to repository tags

### 2. Created Beta Cleanup Workflow (`.github/workflows/cleanup-beta-versions.yml`)
- **Automatically triggers when a PR is merged or closed**
- Deprecates all beta npm package versions published for that specific PR
- Deletes all beta Git tags associated with that PR
- Keeps the npm registry clean by marking old beta versions as deprecated
- Prevents tag clutter in the repository

### 3. Added `publishConfig` to all package.json files
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

4. **Verify the token (optional, but recommended)**
   - The workflow now includes an automatic verification step using `npm whoami`
   - This step runs before publishing to catch authentication issues early
   - If the token is invalid, the workflow will fail at this step with a clear error message

5. **Test the publishing workflow**
   - Create a pull request to trigger beta publishing
   - Or manually trigger workflow from GitHub Actions tab
   - Verify packages are published with new version format
   - Check that Git tags are created (visible in GitHub repository under "Releases" or "Tags")

## Beta Version Cleanup

When a PR is merged or closed, the cleanup workflow automatically runs to maintain repository hygiene:

**Automatic Cleanup Actions:**
1. **Deprecates npm beta versions** - All beta package versions for that specific PR are marked as deprecated in npm registry
   - Example: `@nhatphucpham/cli@1.0.0-beta.pr123.20251102020619` gets deprecated with message "Beta version for PR #123 - PR has been merged/closed"
   - Versions are deprecated (not unpublished) to maintain npm registry integrity and avoid breaking any dependencies
   
2. **Deletes Git tags** - All beta tags for that specific PR are removed from the repository
   - Example: Tags like `cli@1.0.0-beta.pr123.20251102020619` are deleted
   - Keeps the repository's tag list clean and focused on stable releases

**Workflow Trigger:**
- Runs automatically when a PR is closed (merged or not merged)
- Only processes PRs that have changes in package directories (cli, base, server, builders)
- Uses the same NPM_TOKEN for authentication

**Benefits:**
- Prevents accumulation of obsolete beta versions in npm registry
- Keeps Git tags focused on stable releases
- Automatic cleanup requires no manual intervention
- Deprecated versions can still be accessed if needed, but are clearly marked as outdated

## Git Tagging

Each successful package publication automatically creates a Git tag in the repository:

**Tag Format:** `<package>@<version>`

**Examples:**
- `cli@1.0.0` - CLI package version 1.0.0 (latest release)
- `cli@1.0.0-beta.pr123.20251102020619` - CLI package beta version for PR #123
- `client@1.0.0-beta.pr456.20251102030000` - Client package beta version for PR #456
- `server@1.1.0` - Server package version 1.1.0
- `builder@2.0.0` - Builder package version 2.0.0

**Benefits:**
- Links published npm packages to specific commits in the repository
- Enables easy code review of what was published
- Allows checking out specific published versions: `git checkout cli@1.0.0`
- Provides version history in GitHub's releases/tags interface
- Useful for debugging and tracking changes between versions

## Version Format Examples

**Main branch (latest):** `1.0.0`, `1.1.0`, `2.0.0`  
**PR branch (beta):** `1.0.0-beta.pr123.20251102020619`

The beta format includes:
- Base version: `1.0.0`
- Prerelease type: `beta`
- PR number: `pr123`
- Timestamp: `20251102020619` (YYYYMMDDHHmmss)
