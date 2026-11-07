import {extname, isAbsolute, join, relative} from 'node:path';

/**
 * The file in the renderer folder (`root`) for a URL path. Paths with an
 * extension are files (`/assets/index-abc.js`); anything else is an app
 * route (`/pending-patients`) and gets `index.html`, so the web app's router
 * takes over. Returns null for paths that would leave `root`.
 */
export function resolveRendererFile(
  root: string,
  pathname: string
): string | null {
  let decoded: string;

  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (extname(decoded) === '') return join(root, 'index.html');

  const file = join(root, decoded);
  const fromRoot = relative(root, file);

  if (fromRoot.startsWith('..') || isAbsolute(fromRoot)) return null;

  return file;
}
