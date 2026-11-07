import {beforeEach, describe, expect, test, vi} from 'vitest';
import {patient} from '../../../test/fixtures/patients.ts';
import {renderWithProviders} from '../../../test/render-with-providers.tsx';
import {PatientCardComponent} from './patient-card-component.tsx';

const mocks = vi.hoisted(() => ({
  fetchPatientsPage: vi.fn(),
  fetchPatientCounts: vi.fn(),
  updatePatientStatus: vi.fn(),
}));

vi.mock('../api/patients-api.ts', () => mocks);

describe('PatientCardComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('accepted and refused are never both on', async () => {
    const {screen} = await renderWithProviders(
      <PatientCardComponent patient={patient(1)} />
    );
    const [accepted, refused] = [
      screen.getByRole('checkbox').first(),
      screen.getByRole('checkbox').last(),
    ];

    await accepted.click();
    await expect.element(accepted).toBeChecked();

    await refused.click();
    await expect.element(refused).toBeChecked();
    await expect.element(accepted).not.toBeChecked();
  });

  test('saves the chosen status and confirms it', async () => {
    mocks.updatePatientStatus.mockResolvedValue(
      patient(1, {status: 'refused'})
    );
    const onUpdated = vi.fn();

    const {screen} = await renderWithProviders(
      <PatientCardComponent patient={patient(1)} onUpdated={onUpdated} />
    );

    await screen.getByRole('checkbox').last().click();
    await screen.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(
        screen.getByText('Patient Test Patient 0001 updated successfully!')
      )
      .toBeVisible();
    expect(mocks.updatePatientStatus).toHaveBeenCalledWith(
      {id: 1, status: 'refused'},
      expect.anything()
    );
    expect(onUpdated).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, status: 'refused'})
    );
  });

  test('shows a failed save once', async () => {
    mocks.updatePatientStatus.mockRejectedValue(
      new Error('Patient not found.')
    );

    const {screen} = await renderWithProviders(
      <PatientCardComponent patient={patient(1)} />
    );

    await screen.getByRole('button', {name: 'Update patient'}).click();

    await expect
      .element(screen.getByRole('alert').getByText('Patient not found.'))
      .toBeVisible();
    expect(screen.getByRole('alert').elements()).toHaveLength(1);
  });
});
