import {Routes, Route} from 'react-router';
import {useAuth, AuthProvider} from './utils/authProvider.tsx';
import {PatientsProvider} from './api/patientsProvider.tsx';
import {FooterComponent} from './features/ui/footer.component.tsx';
import {HeaderComponent} from './features/ui/header.component.tsx';
import LoginPageComponent from './pages/login-page.component.tsx';
import {PendingPatientsPageComponent} from './pages/pending-patients-page.component.tsx';
import {PatientsListPageComponent} from './pages/patients-list-page.component.tsx';

function ProtectedPatientsRoutes() {
  const {session} = useAuth();

  if (!session) return <LoginPageComponent />;

  return (
    <PatientsProvider>
      <Routes>
        <Route path="/" element={<PatientsListPageComponent />} />
        <Route
          path="pending-patients"
          element={<PendingPatientsPageComponent />}
        />
      </Routes>
    </PatientsProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <HeaderComponent title="CDM Optimiser" />
      <ProtectedPatientsRoutes />
      <FooterComponent brand="CDM Optimiser" />
    </AuthProvider>
  );
}

export default App;
