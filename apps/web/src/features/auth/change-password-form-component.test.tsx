import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {AuthApiError, AuthWeakPasswordError} from '@supabase/supabase-js';
import {ChangePasswordFormComponent} from './change-password-form-component.tsx';

const mocks = vi.hoisted(() => ({useAuth: vi.fn(), changePassword: vi.fn()}));

vi.mock('./use-auth.ts', () => ({useAuth: mocks.useAuth}));

const NEW_PASSWORD = 'correct horse battery staple';

async function renderForm() {
  const screen = await render(<ChangePasswordFormComponent />);

  return {
    screen,
    current: screen.getByLabelText('Current password'),
    next: screen.getByLabelText('New password'),
    confirm: screen.getByLabelText('Confirm new password'),
    submit: screen.getByRole('button', {name: 'Change password'}),
  };
}

describe('ChangePasswordFormComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({
      user: {email: 'test.user@example.com'},
      changePassword: mocks.changePassword,
    });
  });

  test('labels each field for password managers and states the rule', async () => {
    const {screen, current, next, confirm} = await renderForm();

    await expect
      .element(current)
      .toHaveAttribute('autocomplete', 'current-password');
    await expect.element(next).toHaveAttribute('autocomplete', 'new-password');
    await expect.element(next).toHaveAttribute('minlength', '16');
    await expect
      .element(next)
      .toHaveAccessibleDescription(
        'At least 16 characters. A few unrelated words make a long password that’s easy to remember.'
      );
    await expect
      .element(confirm)
      .toHaveAttribute('autocomplete', 'new-password');

    const username = screen.container.querySelector(
      'input[autocomplete="username"]'
    );

    expect(username).toHaveValue('test.user@example.com');
  });

  test('changes the password with the current one, then confirms and clears the fields', async () => {
    mocks.changePassword.mockResolvedValue(undefined);
    const {screen, current, next, confirm, submit} = await renderForm();

    await current.fill('the-old-password');
    await next.fill(NEW_PASSWORD);
    await confirm.fill(NEW_PASSWORD);
    await submit.click();

    await expect
      .element(screen.getByRole('status').getByText('Password changed'))
      .toBeVisible();
    expect(mocks.changePassword).toHaveBeenCalledExactlyOnceWith(
      'the-old-password',
      NEW_PASSWORD
    );
    await expect.element(current).toHaveValue('');
    await expect.element(next).toHaveValue('');
    await expect.element(confirm).toHaveValue('');
  });

  test('refuses new passwords that don’t match, without asking Supabase', async () => {
    const {screen, current, next, confirm, submit} = await renderForm();

    await current.fill('the-old-password');
    await next.fill(NEW_PASSWORD);
    await confirm.fill(`${NEW_PASSWORD}!`);
    await submit.click();

    await expect
      .element(
        screen.getByRole('alert').getByText('The new passwords don’t match.')
      )
      .toBeVisible();
    expect(mocks.changePassword).not.toHaveBeenCalled();
  });

  test('says when the current password is wrong, once', async () => {
    mocks.changePassword.mockRejectedValue(
      new AuthApiError(
        'Current password required when setting new password.',
        400,
        'current_password_mismatch'
      )
    );
    const {screen, current, next, confirm, submit} = await renderForm();

    await current.fill('a-wrong-password');
    await next.fill(NEW_PASSWORD);
    await confirm.fill(NEW_PASSWORD);
    await submit.click();

    await expect
      .element(
        screen.getByRole('alert').getByText('Your current password is wrong.')
      )
      .toBeVisible();
    expect(screen.getByRole('alert').elements()).toHaveLength(1);
    expect(screen.getByRole('status').query()).toBeNull();
  });

  test('explains a password that Supabase finds too weak', async () => {
    mocks.changePassword.mockRejectedValue(
      new AuthWeakPasswordError('Password is known to be weak', 422, ['pwned'])
    );
    const {screen, current, next, confirm, submit} = await renderForm();

    await current.fill('the-old-password');
    await next.fill('password12345678');
    await confirm.fill('password12345678');
    await submit.click();

    await expect
      .element(screen.getByRole('alert').getByText(/appeared in a data leak/))
      .toBeVisible();
  });

  test('the browser refuses a new password under 16 characters', async () => {
    const {current, next, confirm, submit} = await renderForm();

    await current.fill('the-old-password');
    await next.fill('too-short');
    await confirm.fill('too-short');
    await submit.click();

    expect((next.element() as HTMLInputElement).validity.tooShort).toBe(true);
    expect(mocks.changePassword).not.toHaveBeenCalled();
  });
});
