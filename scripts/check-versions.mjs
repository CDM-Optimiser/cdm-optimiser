// Fails when the app's package.json files disagree on the version (see
// app-version-files.mjs). Fix it with `yarn bump <x.y.z>`.
import {readFileSync} from 'node:fs';
import {VERSION_FILES, VERSION_PATTERN} from './app-version-files.mjs';

const versions = VERSION_FILES.map((file) => [
  file,
  JSON.parse(readFileSync(file, 'utf8')).version,
]);
const [, expected] = versions[0];
const wrong = versions.filter(([, version]) => version !== expected);

if (!VERSION_PATTERN.test(expected) || wrong.length > 0) {
  for (const [file, version] of versions) console.error(`${file}: ${version}`);
  console.error('The versions must match. Run: yarn bump <x.y.z>');
  process.exit(1);
}

console.log(`All versions are ${expected}.`);
