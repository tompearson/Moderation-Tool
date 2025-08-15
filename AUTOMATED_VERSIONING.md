# Automated Versioning System

## Overview

This project now includes an automated versioning system that can automatically bump version numbers based on commit messages and provide easy-to-use npm scripts.

## Available Commands

### Manual Version Bumping

```bash
# Bump patch version (0.8.40-alpha → 0.8.40-alpha)
npm run bump-patch

# Bump minor version (0.8.40-alpha → 0.8.40-alpha)
npm run bump-minor

# Bump major version (0.8.40-alpha → 1.0.0-alpha)
npm run bump-major

# Default bump (patch)
npm run bump
```

### Advanced Auto-Versioning

```bash
# Auto-detect version bump from commit message
node scripts/auto-version.js "auto" "feat: add new feature"

# Manual version bump
node scripts/auto-version.js "minor" "feat: add new feature"
```

## Automatic Version Detection

The system automatically detects version bump types from commit messages:

- **Major**: `breaking`, `major`
- **Minor**: `feat`, `feature`
- **Patch**: `fix`, `patch` (default)

### Examples

```bash
# These will auto-detect as MINOR bumps
git commit -m "feat: add new moderation rules"
git commit -m "feature: implement user interface"

# These will auto-detect as PATCH bumps
git commit -m "fix: correct version display"
git commit -m "patch: update documentation"

# These will auto-detect as MAJOR bumps
git commit -m "breaking: change API structure"
git commit -m "major: rewrite entire system"
```

## Git Pre-Commit Hook (Optional)

A pre-commit hook is available that automatically bumps versions before each commit:

### Setup

```bash
# Make the hook executable
chmod +x .git/hooks/pre-commit

# The hook will now run automatically on every commit
```

### How It Works

1. **Pre-commit**: Hook reads your commit message
2. **Auto-detect**: Determines version bump type from message
3. **Update**: Bumps version and updates all files
4. **Stage**: Automatically stages version changes
5. **Commit**: Proceeds with your original commit

### Disable Hook (if needed)

```bash
# Skip the hook for a specific commit
git commit --no-verify -m "your message"

# Or temporarily disable
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
```

## What Gets Updated Automatically

When you run any version bump command:

✅ **version.js** - Core version information  
✅ **package.json** - NPM package version  
✅ **package-lock.json** - Regenerated automatically  
✅ **README.md** - Version indicators  
✅ **Postman Collections** - Example responses  
✅ **All API endpoints** - Version in responses  

## Version Format

The system follows semantic versioning:
- **Major.Minor.Patch-Prerelease**
- Example: `0.8.40-alpha`
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible
- **Prerelease**: alpha, beta, rc

## Workflow Examples

### Simple Patch Update
```bash
npm run bump-patch
git add .
git commit -m "fix: correct version display issue"
git tag v0.8.40-alpha
git push origin v0.8.40-alpha
```

### Feature Release
```bash
npm run bump-minor
git add .
git commit -m "feat: add new moderation guidelines"
git tag v0.8.40-alpha
git push origin v0.8.40-alpha
```

### With Pre-Commit Hook
```bash
# Just commit normally - versioning happens automatically
git commit -m "feat: add automated versioning system"
# Hook automatically bumps to 0.8.40-alpha and stages changes
git tag v0.8.40-alpha
git push origin v0.8.40-alpha
```

## Benefits

- **🎯 No Manual Updates** - Version numbers update automatically
- **🔍 Smart Detection** - Analyzes commit messages for appropriate bumps
- **⚡ Fast Workflow** - Single command or automatic via hooks
- **🔒 Consistent** - All files always have matching versions
- **📝 Clear History** - Version bumps are part of commit history

## Troubleshooting

### Version Not Updating
1. Check that scripts are executable: `chmod +x scripts/*.js`
2. Verify npm scripts are in package.json
3. Ensure version.js is properly formatted

### Pre-Commit Hook Issues
1. Check hook permissions: `ls -la .git/hooks/pre-commit`
2. Test hook manually: `./.git/hooks/pre-commit`
3. Check for syntax errors in the hook script

### Manual Override
If automatic versioning fails, you can always:
1. Edit `version.js` manually
2. Run `npm run update-version`
3. Commit changes normally

## Future Enhancements

- [ ] Add version validation (semantic versioning check)
- [ ] Add changelog generation
- [ ] Add release notes automation
- [ ] Add version comparison tools
- [ ] Add rollback functionality 

---

## Last Updated
- **Date**: 08-15-2025
- **Version 0.8.40-alpha
- **Status**: Documentation updated for version 0.8.40-alpha
- **Next Action**: Ready for production deployment