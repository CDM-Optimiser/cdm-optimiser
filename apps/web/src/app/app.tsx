import {Outlet, Route, Routes} from 'react-router';
import {AuthProvider} from '../features/auth/auth-provider.tsx';
import {PatientsProvider} from '../features/patients/api/patients-provider.tsx';
import {LoginPageComponent} from '../pages/login-page-component.tsx';
import {NotFoundPageComponent} from '../pages/not-found-page-component.tsx';
import {PatientsListPageComponent} from '../pages/patients-list-page-component.tsx';
import {PendingPatientsPageComponent} from '../pages/pending-patients-page-component.tsx';
import {ProtectedLayout} from './protected-layout.tsx';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPageComponent />} />
        <Route element={<ProtectedLayout />}>
          {/* Patients are loaded only for the pages that show them. */}
          <Route
            element={
              <PatientsProvider>
                <Outlet />
              </PatientsProvider>
            }
          >
            <Route index element={<PatientsListPageComponent />} />
            <Route
              path="pending-patients"
              element={<PendingPatientsPageComponent />}
            />
          </Route>
          <Route path="*" element={<NotFoundPageComponent />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
