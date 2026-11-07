// Lists files that differ from the main branch: committed on the current
// branch, staged, unstaged or untracked. Deleted files are skipped.
// Used by `yarn prettier` and `yarn linc` (see the `fix` Claude Code skill).

import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

function git(...args) {
  return execFileSync('git', args, {encoding: 'utf8'}).trim();
}

function tryGit(...args) {
  try {
    return git(...args);
  } catch {
    return null;
  }
}

function splitLines(output) {
  return output ? output.split('\n').filter(Boolean) : [];
}

/** The merge-base with `origin/main` (or `main`), else `HEAD`. */
function resolveBase() {
  for (const ref of ['origin/main', 'main']) {
    const base = tryGit('merge-base', 'HEAD', ref);

    if (base) return base;
  }

  return 'HEAD';
}

/** Absolute paths of changed files that still exist on disk. */
export function getChangedFiles() {
  const root = git('rev-parse', '--show-toplevel');
  const base = resolveBase();

  // `git diff <base>` compares the base commit with the working tree, so it
  // covers branch commits plus staged and unstaged changes in one go.
  const tracked = splitLines(
    git('diff', '--name-only', '--diff-filter=ACMR', base)
  );
  const untracked = splitLines(
    git('ls-files', '--others', '--exclude-standard')
  );

  return [...new Set([...tracked, ...untracked])]
    .map((file) => join(root, file))
    .filter((file) => existsSync(file));
}
