import {Route, Routes} from 'react-router';
import {AuthProvider} from '../features/auth/auth-provider.tsx';
import {AccountPageComponent} from '../pages/account-page-component.tsx';
import {LoginPageComponent} from '../pages/login-page-component.tsx';
import {NotFoundPageComponent} from '../pages/not-found-page-component.tsx';
import {PatientsListPageComponent} from '../pages/patients-list-page-component.tsx';
import {UpdateNoticeComponent} from '../features/updates/update-notice-component.tsx';
import {PendingPatientsPageComponent} from '../pages/pending-patients-page-component.tsx';
import {ProtectedLayout} from './protected-layout.tsx';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPageComponent />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<PatientsListPageComponent />} />
          <Route
            path="pending-patients"
            element={<PendingPatientsPageComponent />}
          />
          <Route path="account" element={<AccountPageComponent />} />
          <Route path="*" element={<NotFoundPageComponent />} />
        </Route>
      </Routes>
      <UpdateNoticeComponent />
    </AuthProvider>
  );
}
