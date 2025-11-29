import { Routes, Route } from "react-router";
import { PatientsProvider } from './utils/hooks/patientsContext.tsx';
import { FooterComponent } from './features/ui/footer.component.tsx';
import { HeaderComponent } from './features/ui/header.component.tsx';
import { PendingPatientsPageComponent } from './pages/pending-patients-page.component.tsx';
import { PatientsListPageComponent } from './pages/patients-list-page.component.tsx';

function App() {
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

export default App;
