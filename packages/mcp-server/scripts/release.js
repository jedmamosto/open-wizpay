import { execSync } from 'child_process';

try {
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Bumping patch version...');
  execSync('npm version patch', { stdio: 'inherit' });

  console.log('Publishing to npm...');
  // --access public is needed for scoped packages like @jedmamosto/wizpay-mcp-setup
  execSync('npm publish --access public', { stdio: 'inherit' });

  console.log('Pushing tags to git...');
  execSync('git push --follow-tags', { stdio: 'inherit' });

  console.log('Release completed successfully!');
} catch (error) {
  console.error('Release failed:', error.message || error);
  process.exit(1);
}
