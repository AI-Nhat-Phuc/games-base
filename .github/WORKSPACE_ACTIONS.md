# Workspace-Specific GitHub Actions

This document explains how GitHub Actions are configured to run only for changed workspaces in the monorepo.

## Overview

Each workspace has independent GitHub Actions that trigger only when files in that specific workspace change:

- **`base/`** → Triggers `publish-client` job
- **`cli/`** → Triggers `publish-cli` job
- **`server/`** → Triggers `publish-server` job
- **`builders/`** → Triggers `publish-builder` job

## How It Works

### 1. Path-Based Triggers

The workflow uses `paths` filters to detect which workspaces have changes:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'cli/**'      # Any file in cli folder
      - 'base/**'     # Any file in base folder
      - 'server/**'   # Any file in server folder
      - 'builders/**' # Any file in builders folder
      - 'package.json' # Root package.json changes
```

### 2. Change Detection Job

The `detect-changes` job analyzes which workspaces have modifications:

```yaml
detect-changes:
  runs-on: ubuntu-latest
  outputs:
    cli_changed: ${{ steps.changes.outputs.cli }}
    client_changed: ${{ steps.changes.outputs.client }}
    server_changed: ${{ steps.changes.outputs.server }}
    builder_changed: ${{ steps.changes.outputs.builder }}
```

It uses `git diff` to check for file changes:

```bash
# Example for CLI workspace
if git diff --name-only HEAD^ HEAD | grep -q '^cli/'; then
  echo "cli=true" >> $GITHUB_OUTPUT
else
  echo "cli=false" >> $GITHUB_OUTPUT
fi
```

### 3. Conditional Job Execution

Each publish job only runs if its workspace changed:

```yaml
publish-cli:
  needs: detect-changes
  if: |
    (needs.detect-changes.outputs.cli_changed == 'true' && 
     (github.event_name == 'push' || github.event_name == 'pull_request'))
```

## Workflow Examples

### Example 1: Change Only CLI Files

```bash
# Make changes
cd cli
vim src/commands/create.ts

# Commit and push
git add .
git commit -m "Update CLI create command"
git push
```

**Result:** Only `publish-cli` job runs. Other jobs are skipped.

### Example 2: Change Multiple Workspaces

```bash
# Make changes to base and server
cd base/src
vim core/GameEngine.ts

cd ../../server/src
vim core/GameServer.ts

# Commit and push
git add .
git commit -m "Update engine and server"
git push
```

**Result:** Both `publish-client` and `publish-server` jobs run. CLI and builder jobs are skipped.

### Example 3: Change Only Builders

```bash
# Make changes
cd builders/character-builder
vim character-builder.js

# Commit and push
git add .
git commit -m "Improve character builder UI"
git push
```

**Result:** Only `publish-builder` job runs. All other jobs are skipped.

## File Path Mapping

| Workspace | Directory | Job Name | Package Name |
|-----------|-----------|----------|--------------|
| Client | `base/**` | `publish-client` | `@pnp/game-core-client` |
| CLI | `cli/**` | `publish-cli` | `@pnp/cli` |
| Server | `server/**` | `publish-server` | `@pnp/game-core-server` |
| Builder | `builders/**` | `publish-builder` | `@pnp/builder` |

## Versioning Per Workspace

Each workspace has independent versioning:

### Main Branch (Production)
```bash
@pnp/game-core-client@1.2.3
@pnp/cli@1.0.5
@pnp/game-core-server@2.1.0
@pnp/builder@1.1.2
```

### Pull Request (Beta)
```bash
@pnp/game-core-client@1.2.4-beta-pr-123.20241101120530
@pnp/cli@1.0.6-beta-pr-123.20241101120530
@pnp/game-core-server@2.1.1-beta-pr-123.20241101120530
@pnp/builder@1.1.3-beta-pr-123.20241101120530
```

## Manual Publishing

You can manually trigger publishing for specific workspaces:

1. Go to **Actions** → **Publish Packages to NPM**
2. Click **Run workflow**
3. Select workspace:
   - `cli` - Publish only CLI
   - `client` - Publish only Client
   - `server` - Publish only Server
   - `builder` - Publish only Builder
   - `all` - Publish all packages

## Viewing Action Results

After a push, check the Actions tab:

```
✅ detect-changes     (always runs)
✅ publish-cli        (runs if cli/** changed)
⚪ publish-client     (skipped - no changes)
⚪ publish-server     (skipped - no changes)
✅ publish-builder    (runs if builders/** changed)
```

## Benefits

1. **Faster CI/CD**: Only affected packages are built and published
2. **Independent Releases**: Each workspace can have its own version
3. **Resource Efficiency**: Saves GitHub Actions minutes
4. **Clear History**: Easy to see which workspace was updated
5. **Parallel Execution**: Multiple workspaces can publish simultaneously

## Troubleshooting

### All Jobs Running When Not Expected

Check if you modified `package.json` at the root - this triggers all jobs.

### Jobs Not Running When Expected

1. Verify files are in the correct workspace directory
2. Check the `paths` filter in the workflow file
3. Ensure the workflow file is on the branch you're pushing to

### Force Publishing a Workspace

Use manual workflow dispatch with `force_publish: true` option.

## See Also

- [Publishing Guide](./PUBLISHING.md)
- [Monorepo Structure](../MONOREPO.md)
- [Workflow File](../workflows/publish-packages.yml)
