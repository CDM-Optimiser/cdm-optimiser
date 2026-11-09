import {describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';
import {BrandLogoComponent} from './brand-logo-component.tsx';

describe('BrandLogoComponent', () => {
  test('shows the logo, named by its alt text', async () => {
    const screen = await render(
      <BrandLogoComponent alt="CDM Optimiser" className="h-10" />
    );
    const logo = screen.getByRole('img', {name: 'CDM Optimiser'});

    await expect.element(logo).toHaveAttribute('src', '/logo.svg');
    await expect.element(logo).toHaveClass('h-10');
  });

  test('offers the dark version for dark mode', async () => {
    const screen = await render(<BrandLogoComponent alt="CDM Optimiser" />);
    const source = screen.container.querySelector('picture > source');

    expect(source?.getAttribute('srcset')).toBe('/logo-dark.svg');
    expect(source?.getAttribute('media')).toBe('(prefers-color-scheme: dark)');
  });

  test('is hidden from screen readers when its alt text is empty', async () => {
    const screen = await render(<BrandLogoComponent alt="" />);

    expect(screen.getByRole('img').query()).toBeNull();
  });
});
