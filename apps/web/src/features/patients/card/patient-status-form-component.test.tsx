import {beforeEach, describe, expect, test, vi} from 'vitest';
import {patient} from '../../../test/fixtures/patients.ts';
import {renderWithProviders} from '../../../test/render-with-providers.tsx';
import {PatientStatusFormComponent} from './patient-status-form-component.tsx';

const mocks = vi.hoisted(() => ({
  fetchPatientsPage: vi.fn(),
  fetchPatientCounts: vi.fn(),
  updatePatientStatus: vi.fn(),
}));

vi.mock('../api/patients-api.ts', () => mocks);

describe('PatientStatusFormComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('starts from the patient’s status', async () => {
    const {screen} = await renderWithProviders(
      <PatientStatusFormComponent patient={patient(1, {status: 'refused'})} />
    );

    await expect
      .element(screen.getByRole('switch', {name: 'Refused'}))
      .toBeChecked();
    await expect
      .element(screen.getByRole('switch', {name: 'Accepted'}))
      .not.toBeChecked();
  });

  test('accepted and refused are never both on', async () => {
    const {screen} = await renderWithProviders(
      <PatientStatusFormComponent patient={patient(1)} />
    );
    const accepted = screen.getByRole('switch', {name: 'Accepted'});
    const refused = screen.getByRole('switch', {name: 'Refused'});

    await accepted.click();
    await expect.element(accepted).toBeChecked();

    await refused.click();
    await expect.element(refused).toBeChecked();
    await expect.element(accepted).not.toBeChecked();

    await refused.click();
    await expect.element(refused).not.toBeChecked();
  });

  test('saves the chosen status and reports the saved patient', async () => {
    mocks.updatePatientStatus.mockResolvedValue(
      patient(1, {status: 'refused'})
    );
    const onUpdated = vi.fn();

    const {screen} = await renderWithProviders(
      <PatientStatusFormComponent patient={patient(1)} onUpdated={onUpdated} />
    );

    await screen.getByRole('switch', {name: 'Refused'}).click();
    await screen.getByRole('button', {name: 'Update patient'}).click();

    await vi.waitFor(() =>
      expect(onUpdated).toHaveBeenCalledWith(
        expect.objectContaining({id: 1, status: 'refused'})
      )
    );
    expect(mocks.updatePatientStatus).toHaveBeenCalledWith(
      {id: 1, status: 'refused'},
      expect.anything()
    );
  });

  test('shows a failed save once', async () => {
    mocks.updatePatientStatus.mockRejectedValue(
      new Error('Patient not found.')
    );
    const onUpdated = vi.fn();

    const {screen} = await renderWithProviders(
      <PatientStatusFormComponent patient={patient(1)} onUpdated={onUpdated} />
    );

    await screen.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(screen.getByRole('alert').getByText('Patient not found.'))
      .toBeVisible();
    expect(screen.getByRole('alert').elements()).toHaveLength(1);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
