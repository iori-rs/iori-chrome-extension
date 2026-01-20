const { execSync } = require('child_process');

// Get the version bump type from arguments (patch, minor, major)
// Default to 'patch' if not specified
const bumpType = process.argv[2] || 'patch';

const validTypes = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
if (!validTypes.includes(bumpType) && !bumpType.match(/^\d+\.\d+\.\d+$/)) {
    console.error(`Invalid version type. Use one of: ${validTypes.join(', ')} or a specific version number.`);
    process.exit(1);
}

try {
    console.log(`Starting release process (${bumpType})...`);

    // 1. Create version commit and tag using pnpm version
    // --no-git-tag-version prevents pnpm from tagging if you wanted to do it manually, 
    // but standard behavior is fine here.
    // However, pnpm version handles git operations if git-checks are passed.
    console.log('Bumping version...');
    execSync(`npm version ${bumpType}`, { stdio: 'inherit' });

    // 2. Push commits (including the new version commit)
    console.log('Pushing to remote...');
    execSync('git push', { stdio: 'inherit' });

    // 3. Push tags (triggers the release workflow)
    console.log('Pushing tags...');
    execSync('git push --tags', { stdio: 'inherit' });

    console.log('✅ Release process completed successfully!');
    
} catch (error) {
    console.error('❌ Release failed.');
    process.exit(1);
}
