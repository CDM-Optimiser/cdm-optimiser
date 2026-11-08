// `yarn linc`: lints only the files changed against the main branch.
// Exits with code 1 on any lint error or warning, like `yarn lint` does in
// CI (`--max-warnings 0`).

import {ESLint} from 'eslint';
import {getChangedFiles} from './changed-files.mjs';

const LINTABLE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;

const files = getChangedFiles().filter((file) => LINTABLE_FILE.test(file));

if (files.length === 0) {
  console.log('No changed files to lint.');
} else {
  // `warnIgnored: false` skips changed files that ESLint is configured to
  // ignore instead of warning about them.
  const eslint = new ESLint({warnIgnored: false});
  const results = await eslint.lintFiles(files);
  const formatter = await eslint.loadFormatter('stylish');
  const output = await formatter.format(results);

  if (output) console.log(output);

  const problemCount = results.reduce(
    (total, result) => total + result.errorCount + result.warningCount,
    0
  );

  if (problemCount > 0) {
    process.exitCode = 1;
  } else {
    console.log(`Linted ${files.length} changed file(s): no problems.`);
  }
}
