import {describe, expect, test, vi} from 'vitest';
import {patient} from '../../../test/fixtures/patients.ts';
import {renderWithProviders} from '../../../test/render-with-providers.tsx';
import {PatientCardComponent} from './patient-card-component.tsx';

vi.mock('../api/patients-api.ts', () => ({
  fetchPatientsPage: vi.fn(),
  fetchPatientCounts: vi.fn(),
  updatePatientStatus: vi.fn(),
}));

describe('PatientCardComponent', () => {
  test('shows the details, the conditions and the status form', async () => {
    const {screen} = await renderWithProviders(
      <PatientCardComponent patient={patient(7, {asthma: true, dm: false})} />
    );

    await expect.element(screen.getByText('Test Patient 0007')).toBeVisible();
    await expect
      .element(screen.getByRole('listitem').filter({hasText: 'Asthma'}))
      .toHaveTextContent('Asthma:Yes');
    await expect
      .element(screen.getByRole('listitem').filter({hasText: 'DM'}))
      .toHaveTextContent('DM:No');
    await expect
      .element(screen.getByRole('button', {name: 'Update patient'}))
      .toBeVisible();
  });
});
