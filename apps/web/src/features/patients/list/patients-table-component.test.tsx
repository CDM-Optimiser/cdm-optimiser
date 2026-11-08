import {describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';
import {patient} from '../../../test/fixtures/patients.ts';
import {PatientsTableComponent} from './patients-table-component.tsx';

describe('PatientsTableComponent', () => {
  const patients = [
    patient(1, {status: 'accepted', asthma: true}),
    patient(2, {status: 'refused'}),
    patient(3),
  ];

  test('has a header for every column and a row per patient', async () => {
    const screen = await render(
      <PatientsTableComponent patients={patients} onOpen={vi.fn()} />
    );

    await expect
      .element(screen.getByRole('columnheader', {name: 'D.O.B.'}))
      .toBeVisible();
    await expect
      .element(screen.getByRole('columnheader', {name: 'COPD'}))
      .toBeVisible();
    // One header row plus three patients.
    expect(screen.getByRole('row').elements()).toHaveLength(4);
  });

  test('says yes or no for each condition, for screen readers', async () => {
    const screen = await render(
      <PatientsTableComponent patients={patients} onOpen={vi.fn()} />
    );
    const firstRow = screen.getByRole('row').nth(1);

    // Asthma, DM (the fixture has DM), CVD, COPD.
    expect(
      firstRow
        .getByRole('cell')
        .elements()
        .slice(-4)
        .map((cell) => cell.textContent)
    ).toEqual(['Yes', 'Yes', 'No', 'No']);
  });

  test('opens a patient from the keyboard, through their name', async () => {
    const onOpen = vi.fn();
    const screen = await render(
      <PatientsTableComponent patients={patients} onOpen={onOpen} />
    );

    const name = screen.getByRole('button', {name: 'Test Patient 0002'});
    (name.element() as HTMLButtonElement).focus();
    await userEvent.keyboard('{Enter}');

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(patients[1]);
  });

  test('opens a patient when their row is clicked', async () => {
    const onOpen = vi.fn();
    const screen = await render(
      <PatientsTableComponent patients={patients} onOpen={onOpen} />
    );

    await screen.getByRole('cell', {name: '3 Example Street'}).click();

    expect(onOpen).toHaveBeenCalledWith(patients[2]);
  });
});
