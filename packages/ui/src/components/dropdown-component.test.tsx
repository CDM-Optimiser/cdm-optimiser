import {useState} from 'react';
import {describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {DropdownComponent, type DropdownItem} from './dropdown-component.tsx';

type Theme = 'system' | 'light' | 'dark';

const options: DropdownItem<Theme>[] = [
  {value: 'system', label: 'System', icon: null},
  {value: 'light', label: 'Light', icon: null},
  {value: 'dark', label: 'Dark', icon: null},
];

function ThemeDropdown({onSelect}: {onSelect: (value: Theme) => void}) {
  const [theme, setTheme] = useState<Theme>('system');

  return (
    <>
      <DropdownComponent
        options={options}
        selectedValue={theme}
        onSelect={(value) => {
          setTheme(value);
          onSelect(value);
        }}
        labelPrefix="Theme"
      />
      <p>Outside</p>
    </>
  );
}

describe('Dropdown component tests', () => {
  test('the trigger names the current choice and starts collapsed', async () => {
    const screen = await render(<ThemeDropdown onSelect={vi.fn()} />);

    const trigger = screen.getByRole('button', {name: 'Theme: System'});

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect
      .element(screen.getByRole('button', {name: 'Light'}))
      .not.toBeInTheDocument();
  });

  test('can be used with the keyboard alone', async () => {
    const onSelect = vi.fn();
    const screen = await render(<ThemeDropdown onSelect={onSelect} />);

    // Start from the trigger: where the first Tab lands depends on the test
    // runner's iframe, not on the component.
    (
      screen
        .getByRole('button', {name: 'Theme: System'})
        .element() as HTMLElement
    ).focus();
    await userEvent.keyboard('{Enter}');

    await expect
      .element(screen.getByRole('button', {name: 'Theme: System'}))
      .toHaveAttribute('aria-expanded', 'true');
    await expect
      .element(screen.getByRole('button', {name: 'System', pressed: true}))
      .toBeVisible();

    await userEvent.tab();
    await userEvent.tab();
    await expect
      .element(screen.getByRole('button', {name: 'Light'}))
      .toHaveFocus();

    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('light');
    const trigger = screen.getByRole('button', {name: 'Theme: Light'});
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect.element(trigger).toHaveFocus();
  });

  test('Escape closes it and returns focus to the trigger', async () => {
    const screen = await render(<ThemeDropdown onSelect={vi.fn()} />);
    const trigger = screen.getByRole('button', {name: 'Theme: System'});

    await trigger.click();
    await userEvent.tab();
    await userEvent.keyboard('{Escape}');

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect.element(trigger).toHaveFocus();
  });

  test('a click outside closes it without choosing', async () => {
    const onSelect = vi.fn();
    const screen = await render(<ThemeDropdown onSelect={onSelect} />);
    const trigger = screen.getByRole('button', {name: 'Theme: System'});

    await trigger.click();
    await screen.getByText('Outside').click();

    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
