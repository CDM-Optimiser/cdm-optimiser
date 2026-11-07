import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';
import {ButtonComponent} from './button.component.tsx';

describe('Button component tests', () => {
  test('is type="button" by default, so it never submits a form', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());

    const screen = await render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <ButtonComponent>Save</ButtonComponent>
      </form>
    );

    const button = screen.getByRole('button', {name: 'Save'});

    await expect.element(button).toHaveAttribute('type', 'button');
    await button.click();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('can still submit when asked to', async () => {
    const screen = await render(
      <ButtonComponent type="submit">Send</ButtonComponent>
    );

    await expect
      .element(screen.getByRole('button', {name: 'Send'}))
      .toHaveAttribute('type', 'submit');
  });

  test('calls onClick, and not when disabled', async () => {
    const onClick = vi.fn();
    const screen = await render(
      <>
        <ButtonComponent onClick={onClick}>Enabled</ButtonComponent>
        <ButtonComponent onClick={onClick} disabled>
          Disabled
        </ButtonComponent>
      </>
    );

    await screen.getByRole('button', {name: 'Enabled'}).click();
    await screen.getByRole('button', {name: 'Disabled'}).click({force: true});

    expect(onClick).toHaveBeenCalledOnce();
  });

  test('a segment button exposes its pressed state', async () => {
    const screen = await render(
      <ButtonComponent variant="segment" aria-pressed>
        All
      </ButtonComponent>
    );

    await expect
      .element(screen.getByRole('button', {name: 'All', pressed: true}))
      .toBeVisible();
  });

  test('is styled by Tailwind in tests, as in the app', async () => {
    const screen = await render(<ButtonComponent>Styled</ButtonComponent>);
    const button = screen.getByRole('button', {name: 'Styled'}).element();

    // test/setup.ts loads Tailwind; without it the button would be unstyled.
    expect(getComputedStyle(button).borderRadius).not.toBe('0px');
    expect(getComputedStyle(button).color).not.toBe(
      getComputedStyle(document.body).color
    );
  });

  test('adds className to the variant classes', async () => {
    const screen = await render(
      <ButtonComponent className="w-full">Wide</ButtonComponent>
    );

    await expect
      .element(screen.getByRole('button', {name: 'Wide'}))
      .toHaveClass('w-full', 'bg-sky-500', 'rounded-md');
  });
});
