import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {FooterComponent} from '../../../../src/features/ui/footer.component.tsx';

const MOCKED_YEAR = 2025;

vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(MOCKED_YEAR);

describe('Footer component tests', () => {
  const defaultProps = {
    brand: 'CDM Optimiser',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the brand and mocked year when copyright is NOT provided', async () => {
    const screen = await render(<FooterComponent {...defaultProps} />);

    const expectedText = `©${MOCKED_YEAR}${defaultProps.brand}`;

    expect(screen.container.textContent).toBe(expectedText);
  });

  test('renders the brand, mocked year, and copyright when copyright IS provided', async () => {
    const props = {...defaultProps, copyright: 'All rights reserved'};
    const screen = await render(<FooterComponent {...props} />);
    const expectedText = `©${MOCKED_YEAR}${props.brand} - ${props.copyright}`;

    expect(screen.container.textContent).toBe(expectedText);
  });

  test('matches snapshot', async () => {
    const screen = await render(<FooterComponent {...defaultProps} />);

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
