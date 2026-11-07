import {Navigate, Routes, Route} from 'react-router';
import {FooterComponent} from '@cdm-optimiser/ui/components/footer-component.tsx';
import {AuthProvider} from '../features/auth/auth-provider.tsx';
import {useAuth} from '../features/auth/use-auth.ts';
import {HeaderComponent} from '../features/layout/header-component.tsx';
import {PatientsProvider} from '../features/patients/api/patients-provider.tsx';
import {LoginPageComponent} from '../pages/login-page-component.tsx';
import {PatientsListPageComponent} from '../pages/patients-list-page-component.tsx';
import {PendingPatientsPageComponent} from '../pages/pending-patients-page-component.tsx';

function ProtectedRoutesWrapper() {
  const {session} = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <HeaderComponent title="CDM Optimiser" />
      <PatientsProvider>
        <Routes>
          <Route path="/" element={<PatientsListPageComponent />} />
          <Route
            path="pending-patients"
            element={<PendingPatientsPageComponent />}
          />
        </Routes>
      </PatientsProvider>
      <FooterComponent brand="CDM Optimiser" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPageComponent />} />
        <Route path="/*" element={<ProtectedRoutesWrapper />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
