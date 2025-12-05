import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {AlertComponent} from '../../../../src/features/ui/alert.component.tsx';
import {useAutoDismiss} from '../../../../src/utils/hooks/useAutoDismiss.tsx';

const mocks = vi.hoisted(() => {
  return {
    useAutoDismiss: vi.fn(),
  };
});

vi.mock('../../../../src/utils/hooks/useAutoDismiss.tsx', () => {
  return {
    useAutoDismiss: mocks.useAutoDismiss,
  };
});

describe('Alert component tests', async () => {
  const defaultProps = {
    title: 'Test Title',
    text: 'This is the alert message.',
    onDismiss: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAutoDismiss).mockReturnValue({progressBar: 100});
  });

  test('renders correctly with default (info) type', async () => {
    const screen = await render(<AlertComponent {...defaultProps} />);

    const titleElement = screen.getByRole('heading', {
      name: defaultProps.title,
    });
    const textElement = screen.getByText(defaultProps.text);

    expect(titleElement).toBeVisible();
    expect(textElement).toBeVisible();

    const alertElement = screen.container.querySelector('.shadow-md');

    if (!alertElement)
      throw new Error('Alert component container element not found.');

    expect(alertElement).toHaveClass('bg-sky-50');
    expect(alertElement).toHaveClass('border-sky-400');

    expect(useAutoDismiss).toHaveBeenCalledWith(
      undefined,
      defaultProps.onDismiss
    );
  });

  test('renders with error type and correct styling', async () => {
    const screen = await render(
      <AlertComponent {...defaultProps} type="error" />
    );

    const alertElement = screen.container.querySelector('.shadow-md');
    const titleElement = screen.getByRole('heading', {
      name: defaultProps.title,
    });

    if (!alertElement)
      throw new Error('Alert component container element not found.');

    expect(alertElement).toHaveClass('bg-red-50');
    expect(alertElement).toHaveClass('border-red-400');

    await expect.element(titleElement).toHaveClass('text-red-800');
  });

  test('displays the progress bar when autoDismissMs is provided', async () => {
    const autoDismissMs = 3000;

    vi.mocked(mocks.useAutoDismiss).mockReturnValue({progressBar: 75});

    const screen = await render(
      <AlertComponent {...defaultProps} autoDismissMs={autoDismissMs} />
    );

    expect(mocks.useAutoDismiss).toHaveBeenCalledWith(
      autoDismissMs,
      defaultProps.onDismiss
    );

    const progressBar = screen.getByText('Progress bar');

    await expect.element(progressBar).toBeVisible();

    const progressBarDiv = screen.container.querySelector(
      '.h-1.rounded-b-xl'
    ) as HTMLElement;

    await expect
      .element(progressBarDiv)
      .toHaveAttribute('style', 'width: 75%;');
  });

  test('does NOT display the progress bar when autoDismissMs is NOT provided', async () => {
    const screen = await render(
      <AlertComponent {...defaultProps} autoDismissMs={undefined} />
    );

    expect(screen.container.querySelector('Progress bar')).toBeNull();
  });

  test('progress bar is rendered and width matches hook value', async () => {
    vi.mocked(useAutoDismiss).mockReturnValue({progressBar: 42});

    const screen = await render(
      <AlertComponent {...defaultProps} autoDismissMs={3000} />
    );

    const progress = screen.container.querySelector('.h-1') as HTMLElement;

    expect(progress).toBeVisible();
    expect(progress.style.width).toBe('42%');
  });

  test('progress bar width is 0% when hook returns 0', async () => {
    vi.mocked(useAutoDismiss).mockReturnValue({progressBar: 0});

    const screen = await render(
      <AlertComponent {...defaultProps} autoDismissMs={3000} />
    );

    const progress = screen.container.querySelector('.h-1') as HTMLElement;

    expect(progress.style.width).toBe('0%');
  });

  test('renders without onDismiss safely', async () => {
    vi.mocked(useAutoDismiss).mockReturnValue({progressBar: 100});

    const screen = await render(
      <AlertComponent title="Test" text="No dismiss callback" />
    );

    expect(screen.getByText('No dismiss callback')).toBeVisible();
  });

  test('clicking the dismiss button calls onDismiss', async () => {
    const mockOnDismiss = vi.fn();
    const props = {...defaultProps, onDismiss: mockOnDismiss};

    const {getByRole} = await render(<AlertComponent {...props} />);

    const dismissButton = getByRole('button', {name: /close|X/i});

    expect(mockOnDismiss).not.toHaveBeenCalled();

    await dismissButton.click();

    expect(mockOnDismiss).toHaveBeenCalledOnce();
  });

  test('component contains expected ARIA roles', async () => {
    const screen = await render(<AlertComponent {...defaultProps} />);

    const alert = screen.getByRole('alert');

    expect(alert).toBeVisible();
  });

  test('matches snapshot', async () => {
    const screen = await render(<AlertComponent {...defaultProps} />);

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
