// `yarn prettier`: formats only the files changed against the main branch.
// Use `yarn format` to format the whole repository.

import {readFile, writeFile} from 'node:fs/promises';
import {relative} from 'node:path';
import * as prettier from 'prettier';
import {getChangedFiles} from './changed-files.mjs';

const files = getChangedFiles();
let formattedCount = 0;
let failed = false;

for (const file of files) {
  const info = await prettier.getFileInfo(file, {
    ignorePath: ['.gitignore', '.prettierignore'],
  });

  if (info.ignored || !info.inferredParser) continue;

  const name = relative(process.cwd(), file);

  try {
    const options = await prettier.resolveConfig(file);
    const source = await readFile(file, 'utf8');
    const output = await prettier.format(source, {...options, filepath: file});

    if (output !== source) {
      await writeFile(file, output);
      formattedCount++;
      console.log(`Formatted ${name}`);
    }
  } catch (error) {
    failed = true;
    console.error(`Could not format ${name}:\n${error.message}`);
  }
}

console.log(
  formattedCount === 0
    ? 'All changed files are already formatted.'
    : `Formatted ${formattedCount} file(s).`
);

if (failed) process.exitCode = 1;
