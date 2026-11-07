import {useState} from 'react';
import {describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {SwitchComponent} from './switch-component.tsx';

function ControlledSwitch({onChange}: {onChange: (checked: boolean) => void}) {
  const [checked, setChecked] = useState(false);

  return (
    <SwitchComponent
      label="Accepted"
      checked={checked}
      onChange={(event) => {
        setChecked(event.target.checked);
        onChange(event.target.checked);
      }}
    />
  );
}

describe('Switch component tests', () => {
  test('is a switch named by its visible label', async () => {
    const screen = await render(<SwitchComponent label="Accepted" />);

    const toggle = screen.getByRole('switch', {name: 'Accepted'});

    await expect.element(toggle).toBeVisible();
    await expect.element(toggle).not.toBeChecked();
  });

  test('toggles when the label is clicked', async () => {
    const onChange = vi.fn();
    const screen = await render(<ControlledSwitch onChange={onChange} />);

    await screen.getByText('Accepted').click();

    await expect
      .element(screen.getByRole('switch', {name: 'Accepted'}))
      .toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  test('toggles with the keyboard', async () => {
    const onChange = vi.fn();
    const screen = await render(<ControlledSwitch onChange={onChange} />);

    const toggle = screen.getByRole('switch', {name: 'Accepted'});

    // A native checkbox is focusable; start from it, since where the first
    // Tab lands depends on the test runner's iframe.
    (toggle.element() as HTMLElement).focus();
    await expect.element(toggle).toHaveFocus();

    await userEvent.keyboard(' ');

    await expect
      .element(screen.getByRole('switch', {name: 'Accepted'}))
      .toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  test('the negative tone turns red when on', async () => {
    const screen = await render(
      <SwitchComponent label="Refused" tone="negative" defaultChecked />
    );

    const track = screen
      .getByRole('switch', {name: 'Refused'})
      .element().parentElement;

    expect(track?.className).toContain('has-checked:bg-red-500');
  });
});
