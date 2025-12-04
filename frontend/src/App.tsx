import {Navigate, Routes, Route} from 'react-router';
import {PatientsProvider} from './api/patientsProvider.tsx';
import {useAuth} from './utils/hooks/useAuth.tsx';
import {AuthProvider} from './utils/authProvider.tsx';
import {LoginPageComponent} from './pages/login-page.component.tsx';
import {PendingPatientsPageComponent} from './pages/pending-patients-page.component.tsx';
import {PatientsListPageComponent} from './pages/patients-list-page.component.tsx';
import {FooterComponent} from './features/ui/footer.component.tsx';
import {HeaderComponent} from './features/ui/header.component.tsx';

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
