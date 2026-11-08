import {beforeEach, describe, expect, test, vi} from 'vitest';
import type {PatientsPageParams} from '../features/patients/api/patients-api.ts';
import type {Patient} from '../features/patients/model/patient.ts';
import {patient} from '../test/fixtures/patients.ts';
import {renderWithProviders} from '../test/render-with-providers.tsx';
import {PendingPatientsPageComponent} from './pending-patients-page-component.tsx';

const mocks = vi.hoisted(() => ({
  fetchPatientsPage: vi.fn(),
  fetchPatientCounts: vi.fn(),
  updatePatientStatus: vi.fn(),
}));

vi.mock('../features/patients/api/patients-api.ts', () => mocks);

describe('PendingPatientsPageComponent', () => {
  let pending: Patient[];

  beforeEach(() => {
    vi.clearAllMocks();
    pending = [patient(1), patient(2), patient(3)];

    // A tiny fake server: one pending patient per page.
    mocks.fetchPatientsPage.mockImplementation(
      async ({page}: PatientsPageParams) => ({
        total: pending.length,
        patients: pending.slice(page - 1, page),
      })
    );
    mocks.updatePatientStatus.mockImplementation(
      async ({id, status}: {id: number; status: Patient['status']}) => {
        const saved = {...pending.find((p) => p.id === id)!, status};
        pending = pending.filter((p) => p.id !== id);
        return saved;
      }
    );
  });

  test('steps through pending patients one at a time', async () => {
    const {screen} = await renderWithProviders(
      <PendingPatientsPageComponent />
    );

    await expect
      .element(screen.getByText('Pending patient: 1 of 3'))
      .toBeVisible();
    await expect
      .element(screen.getByRole('button', {name: 'Previous patient'}))
      .toBeDisabled();

    await screen.getByRole('button', {name: 'Next patient'}).click();

    await expect
      .element(screen.getByText('Pending patient: 2 of 3'))
      .toBeVisible();
    await expect.element(screen.getByText('Test Patient 0002')).toBeVisible();
  });

  test('after a save, the next patient takes the same place', async () => {
    const {screen} = await renderWithProviders(
      <PendingPatientsPageComponent />
    );
    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();

    await screen.getByRole('switch', {name: 'Accepted'}).click();
    await screen.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(screen.getByText('Pending patient: 1 of 2'))
      .toBeVisible();
    await expect.element(screen.getByText('Test Patient 0002')).toBeVisible();
    await expect
      .element(
        screen.getByText('Test Patient 0001 has been updated successfully.')
      )
      .toBeVisible();
    expect(mocks.updatePatientStatus).toHaveBeenCalledWith(
      {id: 1, status: 'accepted'},
      expect.anything()
    );
  });

  test('saving the last patient in the list moves back one', async () => {
    const {screen} = await renderWithProviders(
      <PendingPatientsPageComponent />
    );
    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();

    await screen.getByRole('button', {name: 'Next patient'}).click();
    await screen.getByRole('button', {name: 'Next patient'}).click();
    await expect.element(screen.getByText('Test Patient 0003')).toBeVisible();

    await screen.getByRole('switch', {name: 'Refused'}).click();
    await screen.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(screen.getByText('Pending patient: 2 of 2'))
      .toBeVisible();
    await expect.element(screen.getByText('Test Patient 0002')).toBeVisible();
  });
});
