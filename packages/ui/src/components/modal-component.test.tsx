import {useState} from 'react';
import {describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {ModalComponent} from './modal-component.tsx';

function ModalHarness({onClose}: {onClose?: () => void}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open details
      </button>
      <ModalComponent
        isOpen={isOpen}
        title="Patient Information"
        onClose={() => {
          onClose?.();
          setIsOpen(false);
        }}
      >
        <button type="button">Inside</button>
      </ModalComponent>
    </>
  );
}

describe('Modal component tests', () => {
  test('is closed and renders no content until isOpen is true', async () => {
    const screen = await render(<ModalHarness />);

    expect(screen.getByText('Patient Information').query()).toBeNull();
    expect(screen.getByRole('dialog').query()).toBeNull();
  });

  test('opens as a modal dialog named by its heading', async () => {
    const screen = await render(<ModalHarness />);

    await screen.getByRole('button', {name: 'Open details'}).click();

    const dialog = screen.getByRole('dialog', {name: 'Patient Information'});

    await expect.element(dialog).toBeVisible();
    expect((dialog.element() as HTMLDialogElement).open).toBe(true);
    expect(dialog.element().matches(':modal')).toBe(true);
  });

  test('lines the close button up with the title', async () => {
    const screen = await render(<ModalHarness />);

    await screen.getByRole('button', {name: 'Open details'}).click();

    const middle = (element: Element) => {
      const box = element.getBoundingClientRect();

      return box.top + box.height / 2;
    };
    const title = screen.getByRole('heading', {name: 'Patient Information'});
    const close = screen.getByRole('button', {name: 'Close dialog'});

    expect(
      Math.abs(middle(title.element()) - middle(close.element()))
    ).toBeLessThanOrEqual(1);
  });

  test('Escape closes it and returns focus to the button that opened it', async () => {
    const onClose = vi.fn();
    const screen = await render(<ModalHarness onClose={onClose} />);
    const opener = screen.getByRole('button', {name: 'Open details'});

    await opener.click();
    await expect.element(screen.getByRole('dialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog').query()).toBeNull();
    await expect.element(opener).toHaveFocus();
  });

  test('the close button calls onClose', async () => {
    const onClose = vi.fn();
    const screen = await render(<ModalHarness onClose={onClose} />);

    await screen.getByRole('button', {name: 'Open details'}).click();
    await screen.getByRole('button', {name: 'Close dialog'}).click();

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog').query()).toBeNull();
  });

  test('keeps keyboard focus off the page behind it while open', async () => {
    const screen = await render(<ModalHarness />);
    const opener = screen.getByRole('button', {name: 'Open details'});

    await opener.click();

    const dialog = screen.getByRole('dialog').element();

    // A modal <dialog> makes the rest of the page inert. Tab cycles through
    // the dialog and, past its last control, the browser's own UI (shown as
    // focus on <body>), but never reaches the page behind it.
    for (let step = 0; step < 6; step++) {
      await userEvent.tab();

      const focused = document.activeElement;

      expect(focused === document.body || dialog.contains(focused)).toBe(true);
      expect(focused).not.toBe(opener.element());
    }
  });
});
