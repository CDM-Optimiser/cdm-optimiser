import {describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';
import {SearchIcon} from '../icons/search.icon.tsx';
import {TextFieldComponent} from './text-field.component.tsx';

describe('Text field component tests', () => {
  test('the label names the input', async () => {
    const screen = await render(
      <TextFieldComponent label="Email" type="email" autoComplete="email" />
    );

    const input = screen.getByRole('textbox', {name: 'Email'});

    await expect.element(input).toHaveAttribute('autocomplete', 'email');
    await expect.element(screen.getByText('Email')).toBeVisible();
  });

  test('a hidden label still names the input', async () => {
    const screen = await render(
      <TextFieldComponent
        label="Search patient"
        hideLabel
        type="search"
        icon={<SearchIcon />}
      />
    );

    await expect
      .element(screen.getByRole('searchbox', {name: 'Search patient'}))
      .toBeVisible();
    await expect
      .element(screen.getByText('Search patient'))
      .toHaveClass('sr-only');
  });

  test('typing updates the value', async () => {
    const screen = await render(<TextFieldComponent label="Name" />);
    const input = screen.getByRole('textbox', {name: 'Name'});

    await input.fill('Test Patient');

    await expect.element(input).toHaveValue('Test Patient');
  });
});
