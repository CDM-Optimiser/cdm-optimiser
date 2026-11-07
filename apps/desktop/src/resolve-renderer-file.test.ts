import assert from 'node:assert/strict';
import {join} from 'node:path';
import {describe, test} from 'node:test';
import {resolveRendererFile} from './resolve-renderer-file.js';

const root = join('/app', 'renderer');

describe('resolveRendererFile', () => {
  test('serves index.html for the root and for app routes', () => {
    for (const path of ['/', '/login', '/pending-patients', '/a/b']) {
      assert.equal(resolveRendererFile(root, path), join(root, 'index.html'));
    }
  });

  test('serves files inside the renderer folder', () => {
    assert.equal(
      resolveRendererFile(root, '/assets/index-abc.js'),
      join(root, 'assets', 'index-abc.js')
    );
  });

  test('refuses paths that leave the renderer folder', () => {
    for (const path of [
      '/..%2F..%2Fsecret.txt',
      '/assets/..%2F..%2F..%2Fsecret.txt',
      '/%2E%2E/%2E%2E/secret.txt',
      '/..%5C..%5Csecret.txt',
    ]) {
      const file = resolveRendererFile(root, path);

      assert.ok(
        file === null || file.startsWith(root),
        `${path} resolved to ${file}`
      );
    }
  });

  test('refuses paths that are not valid URL encoding', () => {
    assert.equal(resolveRendererFile(root, '/%E0%A4%A.js'), null);
  });
});
