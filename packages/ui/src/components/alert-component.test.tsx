import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import type {AlertTypes} from '../types/alert.ts';
import {AlertComponent} from './alert-component.tsx';

const defaultProps = {
  title: 'Test Title',
  text: 'This is the alert message.',
};

describe('Alert component tests', () => {
  test('renders the title and text, as an info alert by default', async () => {
    const screen = await render(<AlertComponent {...defaultProps} />);

    await expect
      .element(screen.getByRole('heading', {name: defaultProps.title}))
      .toBeVisible();
    await expect.element(screen.getByText(defaultProps.text)).toBeVisible();
    await expect
      .element(screen.getByRole('status'))
      .toHaveClass('bg-sky-50', 'border-sky-700');
  });

  test.each<[AlertTypes, 'alert' | 'status', string]>([
    ['error', 'alert', 'bg-red-50'],
    ['warning', 'alert', 'bg-yellow-50'],
    ['info', 'status', 'bg-sky-50'],
    ['success', 'status', 'bg-green-50'],
  ])(
    'a %s alert uses role="%s" and its colours',
    async (type, role, background) => {
      const screen = await render(
        <AlertComponent {...defaultProps} type={type} />
      );

      await expect.element(screen.getByRole(role)).toHaveClass(background);
    }
  );

  test('shows extra content, such as a link, inside the alert', async () => {
    const screen = await render(
      <AlertComponent {...defaultProps} type="warning">
        <a href="#fix">Fix it</a>
      </AlertComponent>
    );

    await expect
      .element(screen.getByRole('alert').getByRole('link', {name: 'Fix it'}))
      .toBeVisible();
  });

  test('shows a close button only when onDismiss is given', async () => {
    const withoutDismiss = await render(<AlertComponent {...defaultProps} />);

    expect(
      withoutDismiss.getByRole('button', {name: 'Close alert'}).query()
    ).toBeNull();

    const onDismiss = vi.fn();
    const withDismiss = await render(
      <AlertComponent {...defaultProps} onDismiss={onDismiss} />
    );

    await withDismiss.getByRole('button', {name: 'Close alert'}).click();

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  test('dismisses itself once autoDismissMs has passed', async () => {
    const onDismiss = vi.fn();

    const screen = await render(
      <AlertComponent
        {...defaultProps}
        type="success"
        autoDismissMs={100}
        onDismiss={onDismiss}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();
    await expect.element(screen.getByTestId('alert-progress')).toBeVisible();
    await expect
      .element(screen.getByTestId('alert-progress'))
      .toHaveClass('bg-green-700');

    await expect.poll(() => onDismiss.mock.calls.length).toBe(1);
  });

  test('has no progress bar and never dismisses without autoDismissMs', async () => {
    const onDismiss = vi.fn();

    const screen = await render(
      <AlertComponent {...defaultProps} onDismiss={onDismiss} />
    );

    expect(screen.getByTestId('alert-progress').query()).toBeNull();

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('uses the latest onDismiss without restarting the timer', async () => {
    const first = vi.fn();
    const second = vi.fn();

    const screen = await render(
      <AlertComponent {...defaultProps} autoDismissMs={150} onDismiss={first} />
    );

    await screen.rerender(
      <AlertComponent
        {...defaultProps}
        autoDismissMs={150}
        onDismiss={second}
      />
    );

    await expect.poll(() => second.mock.calls.length).toBe(1);
    expect(first).not.toHaveBeenCalled();
  });

  test('matches snapshot', async () => {
    const screen = await render(
      <AlertComponent {...defaultProps} onDismiss={() => {}} />
    );

    expect(screen.container.innerHTML).toMatchSnapshot();
  });
});
