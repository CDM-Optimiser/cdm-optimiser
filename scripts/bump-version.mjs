// Sets the app version everywhere it lives: `yarn bump 1.2.0`.
// Merging the change to main publishes release v1.2.0 (see release.yml).
// Not called `version`: Yarn has a built-in command with that name.
import {readFileSync, writeFileSync} from 'node:fs';
import {VERSION_FILES, VERSION_PATTERN} from './app-version-files.mjs';

const version = process.argv[2];

if (!version || !VERSION_PATTERN.test(version)) {
  console.error('Usage: yarn bump <x.y.z>   (for example: yarn bump 1.2.0)');
  process.exit(1);
}

for (const file of VERSION_FILES) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));

  pkg.version = version;
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`${file}: ${version}`);
}
