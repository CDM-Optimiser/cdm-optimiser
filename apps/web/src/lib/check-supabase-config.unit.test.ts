import {describe, expect, test} from 'vitest';
import {checkSupabaseConfig} from './check-supabase-config.ts';

const URL = 'https://example.supabase.co';

describe('checkSupabaseConfig', () => {
  test('accepts an https URL and a publishable key', () => {
    expect(checkSupabaseConfig(URL, 'sb_publishable_fake')).toEqual([]);
  });

  test('accepts a local Supabase over http', () => {
    expect(
      checkSupabaseConfig('http://127.0.0.1:54321', 'sb_publishable_fake')
    ).toEqual([]);
  });

  test('reports missing values', () => {
    expect(checkSupabaseConfig(undefined, '')).toEqual([
      'VITE_SUPABASE_URL is missing.',
      'VITE_SUPABASE_PUBLISHABLE_KEY is missing.',
    ]);
  });

  test('refuses a secret key', () => {
    expect(checkSupabaseConfig(URL, 'sb_secret_fake')[0]).toMatch(/secret key/);
  });

  test('refuses a legacy JWT key', () => {
    expect(
      checkSupabaseConfig(URL, 'eyJhbGciOiJIUzI1NiJ9.fake.fake')[0]
    ).toMatch(/publishable key/);
  });

  test('refuses a plain-http remote URL', () => {
    expect(
      checkSupabaseConfig('http://example.supabase.co', 'sb_publishable_fake')
    ).toHaveLength(1);
  });
});
