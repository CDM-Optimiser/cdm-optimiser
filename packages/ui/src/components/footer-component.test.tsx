import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {FooterComponent} from './footer-component.tsx';

const MOCKED_YEAR = 2025;

describe('Footer component tests', () => {
  const defaultProps = {
    brand: 'CDM Optimiser',
  };

  beforeEach(() => {
    vi.setSystemTime(new Date(MOCKED_YEAR, 5, 15));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders the brand and the current year when copyright is NOT provided', async () => {
    const screen = await render(<FooterComponent {...defaultProps} />);

    expect(screen.container.textContent).toBe(
      `©${MOCKED_YEAR}${defaultProps.brand}`
    );
  });

  test('renders the brand, the current year and copyright when copyright IS provided', async () => {
    const props = {...defaultProps, copyright: 'All rights reserved'};
    const screen = await render(<FooterComponent {...props} />);

    expect(screen.container.textContent).toBe(
      `©${MOCKED_YEAR}${props.brand} - ${props.copyright}`
    );
  });

  test('reads the year when it renders, not when the module loads', async () => {
    vi.setSystemTime(new Date(2031, 0, 1));

    const screen = await render(<FooterComponent {...defaultProps} />);

    expect(screen.container.textContent).toContain('2031');
  });

  test('matches snapshot', async () => {
    const screen = await render(<FooterComponent {...defaultProps} />);

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
