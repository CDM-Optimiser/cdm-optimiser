import {describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {
  MenuButtonComponent,
  type MenuButtonItem,
} from './menu-button-component.tsx';

function renderMenu({
  onSignOut = vi.fn(),
  align,
}: {onSignOut?: () => void; align?: 'start' | 'end'} = {}) {
  const items: MenuButtonItem[] = [
    {
      label: 'Account',
      // A plain link stands in for the app's router link.
      renderLink: ({className, children}) => (
        <a href="#account" className={className}>
          {children}
        </a>
      ),
    },
    {label: 'Logout', onSelect: onSignOut},
  ];

  // "Outside" comes first: the open list covers what's below the button.
  return render(
    <>
      <p>Outside</p>
      <MenuButtonComponent
        trigger={<span>test.user@example.com</span>}
        label="Account: test.user@example.com"
        items={items}
        align={align}
      />
    </>
  );
}

describe('Menu button component tests', () => {
  test('starts closed, named by its label', async () => {
    const screen = await renderMenu();
    const trigger = screen.getByRole('button', {
      name: 'Account: test.user@example.com',
    });

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', {name: 'Account'}).query()).toBeNull();
  });

  test('opens a list of links and buttons', async () => {
    const screen = await renderMenu();
    const trigger = screen.getByRole('button', {name: /^Account:/});

    await trigger.click();

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect
      .element(screen.getByRole('link', {name: 'Account'}))
      .toHaveAttribute('href', '#account');
    await expect
      .element(screen.getByRole('button', {name: 'Logout'}))
      .toBeVisible();
  });

  test('choosing a button runs it and closes the list', async () => {
    const onSignOut = vi.fn();
    const screen = await renderMenu({onSignOut});
    const trigger = screen.getByRole('button', {name: /^Account:/});

    await trigger.click();
    await screen.getByRole('button', {name: 'Logout'}).click();

    expect(onSignOut).toHaveBeenCalledOnce();
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('choosing a link closes the list', async () => {
    const screen = await renderMenu();
    const trigger = screen.getByRole('button', {name: /^Account:/});

    await trigger.click();
    await screen.getByRole('link', {name: 'Account'}).click();

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('works from the keyboard, and Escape returns focus to the button', async () => {
    const onSignOut = vi.fn();
    const screen = await renderMenu({onSignOut});
    const trigger = screen.getByRole('button', {name: /^Account:/});

    (trigger.element() as HTMLElement).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.tab();

    await expect
      .element(screen.getByRole('link', {name: 'Account'}))
      .toHaveFocus();

    await userEvent.keyboard('{Escape}');

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect.element(trigger).toHaveFocus();
    expect(onSignOut).not.toHaveBeenCalled();
  });

  test('a click outside closes it without choosing', async () => {
    const onSignOut = vi.fn();
    const screen = await renderMenu({onSignOut});
    const trigger = screen.getByRole('button', {name: /^Account:/});

    await trigger.click();
    await screen.getByText('Outside').click();

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onSignOut).not.toHaveBeenCalled();
  });

  test('lines the list up with the right edge when asked', async () => {
    const screen = await renderMenu({align: 'end'});

    await screen.getByRole('button', {name: /^Account:/}).click();

    await expect.element(screen.getByRole('list')).toHaveClass('right-0');
  });
});
