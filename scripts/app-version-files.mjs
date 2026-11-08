// The package.json files that carry the app's version. The root one is the
// source of truth; the web and desktop apps must match it, because the
// desktop app (its installer and updater) and the web footer both show it.
export const VERSION_FILES = [
  'package.json',
  'apps/web/package.json',
  'apps/desktop/package.json',
];

// x.y.z, optionally with a pre-release such as 1.2.0-rc.1.
export const VERSION_PATTERN = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
