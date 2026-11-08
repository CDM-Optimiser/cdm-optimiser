import {beforeEach, describe, expect, test, vi} from 'vitest';
import {userEvent} from 'vitest/browser';
import type {PatientsPage} from '../features/patients/api/patients-api.ts';
import {patient} from '../test/fixtures/patients.ts';
import {renderWithProviders} from '../test/render-with-providers.tsx';
import {PatientsListPageComponent} from './patients-list-page-component.tsx';

const mocks = vi.hoisted(() => ({
  fetchPatientsPage: vi.fn(),
  fetchPatientCounts: vi.fn(),
  updatePatientStatus: vi.fn(),
}));

vi.mock('../features/patients/api/patients-api.ts', () => mocks);

function pageOf(total: number, ids: number[]): PatientsPage {
  return {total, patients: ids.map((id) => patient(id))};
}

describe('PatientsListPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchPatientCounts.mockResolvedValue({
      total: 25,
      accepted: 5,
      refused: 5,
      pending: 15,
    });
  });

  test('shows loading, then the page from the server and the counts', async () => {
    let resolve!: (page: PatientsPage) => void;
    mocks.fetchPatientsPage.mockReturnValue(
      new Promise<PatientsPage>((r) => (resolve = r))
    );

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);

    await expect.element(screen.getByText('Loading patients…')).toBeVisible();
    expect(screen.getByText('No patients found').query()).toBeNull();

    resolve(pageOf(25, [1, 2, 3]));

    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();
    await expect.element(screen.getByText('Accepted (5)')).toBeVisible();
    expect(mocks.fetchPatientsPage).toHaveBeenCalledWith(
      {search: '', status: 'all', page: 1, pageSize: 10},
      expect.any(AbortSignal)
    );
  });

  test('says no patients were found only once the empty result is in', async () => {
    mocks.fetchPatientsPage.mockResolvedValue(pageOf(0, []));

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);

    await expect.element(screen.getByText('No patients found')).toBeVisible();
  });

  test('searches on the server after the user stops typing, from page 1', async () => {
    mocks.fetchPatientsPage.mockResolvedValue(pageOf(25, [1, 2, 3]));

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);
    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();

    await userEvent.fill(screen.getByRole('searchbox'), 'patient 3');

    await vi.waitFor(() =>
      expect(mocks.fetchPatientsPage).toHaveBeenLastCalledWith(
        {search: 'patient 3', status: 'all', page: 1, pageSize: 10},
        expect.any(AbortSignal)
      )
    );
  });

  test('both pagination bars change the page', async () => {
    mocks.fetchPatientsPage.mockResolvedValue(pageOf(25, [1, 2, 3]));

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);
    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();

    await screen.getByRole('button', {name: '2', exact: true}).last().click();

    await vi.waitFor(() =>
      expect(mocks.fetchPatientsPage).toHaveBeenLastCalledWith(
        expect.objectContaining({page: 2}),
        expect.any(AbortSignal)
      )
    );

    await screen.getByRole('button', {name: '3', exact: true}).first().click();

    await vi.waitFor(() =>
      expect(mocks.fetchPatientsPage).toHaveBeenLastCalledWith(
        expect.objectContaining({page: 3}),
        expect.any(AbortSignal)
      )
    );
  });

  test('moves to the last page when the list shrinks below the current one', async () => {
    mocks.fetchPatientsPage.mockImplementation(async ({page}) =>
      page === 3 ? pageOf(15, []) : pageOf(page === 1 ? 25 : 15, [page])
    );

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);
    await expect.element(screen.getByText('Test Patient 0001')).toBeVisible();

    await screen.getByRole('button', {name: '3', exact: true}).first().click();

    await expect.element(screen.getByText('Test Patient 0002')).toBeVisible();
    expect(mocks.fetchPatientsPage).toHaveBeenLastCalledWith(
      expect.objectContaining({page: 2}),
      expect.any(AbortSignal)
    );
  });

  test('saving a patient closes their details and confirms it', async () => {
    mocks.fetchPatientsPage.mockResolvedValue(pageOf(3, [1, 2, 3]));
    mocks.updatePatientStatus.mockResolvedValue(
      patient(2, {status: 'accepted'})
    );

    const {screen} = await renderWithProviders(<PatientsListPageComponent />);

    await screen.getByRole('button', {name: 'Test Patient 0002'}).click();

    const dialog = screen.getByRole('dialog', {name: 'Patient Information'});
    await expect.element(dialog).toBeVisible();

    await dialog.getByRole('switch', {name: 'Accepted'}).click();
    await dialog.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(
        screen.getByText('Test Patient 0002 has been updated successfully.')
      )
      .toBeVisible();
    await expect.element(dialog).not.toBeInTheDocument();
    expect(mocks.updatePatientStatus).toHaveBeenCalledWith(
      {id: 2, status: 'accepted'},
      expect.anything()
    );
  });
});
