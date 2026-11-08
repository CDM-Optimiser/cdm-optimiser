import {afterEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {FooterComponent} from './footer-component.tsx';

describe('FooterComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('shows the year, the brand and the version', async () => {
    vi.setSystemTime(new Date(2025, 5, 15));

    const screen = await render(
      <FooterComponent brand="CDM Optimiser" version="1.2.3" />
    );

    const footer = screen.getByRole('contentinfo');

    await expect
      .element(footer.getByText('© 2025 CDM Optimiser'))
      .toBeVisible();
    await expect.element(footer.getByText('Version 1.2.3')).toBeVisible();
  });

  test('reads the year when it renders, not when the module loads', async () => {
    vi.setSystemTime(new Date(2031, 0, 1));

    const screen = await render(
      <FooterComponent brand="CDM Optimiser" version="1.2.3" />
    );

    await expect
      .element(screen.getByText('© 2031 CDM Optimiser'))
      .toBeVisible();
  });
});
