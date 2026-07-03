import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isLocalPublish = process.argv.includes('--local');
const isDryRun = process.argv.includes('--dry-run');

try {
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  if (isDryRun) {
    const pkgPath = join(__dirname, '../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const currentVersion = pkg.version;
    const versionParts = currentVersion.split('.').map(Number);
    versionParts[2] += 1;
    const nextVersion = versionParts.join('.');

    console.log('\n--- DRY RUN PREVIEW ---');
    console.log(`Current version: ${currentVersion}`);
    console.log(`Would bump version to: ${nextVersion}`);
    if (isLocalPublish) {
      console.log('Would publish to npm locally: npm publish --access public');
    } else {
      console.log('Would skip local npm publish (automated via GitHub Actions on git tag push).');
    }
    console.log('Would run: git push --follow-tags');
    console.log('-----------------------\n');
    console.log('Dry run completed successfully!');
    process.exit(0);
  }

  console.log('Bumping patch version...');
  execSync('npm version patch', { stdio: 'inherit' });

  if (isLocalPublish) {
    console.log('Publishing to npm locally...');
    // --access public is needed for scoped packages like @jedmamosto/wizpay-mcp-setup
    execSync('npm publish --access public', { stdio: 'inherit' });
  } else {
    console.log('Skipping local npm publish.');
    console.log('This package will be automatically built and published to NPM via GitHub Actions');
    console.log('once the version tag is pushed to remote.');
  }

  console.log('Pushing tags to git...');
  execSync('git push --follow-tags', { stdio: 'inherit' });

  console.log('Release completed successfully!');
} catch (error) {
  console.error('Release failed:', error.message || error);
  process.exit(1);
}
