import {PatientsProvider} from './utils/hooks/patientsContext.tsx';
import {FooterComponent} from './features/ui/footer.component.tsx';
import {HeaderComponent} from './features/ui/header.component.tsx';
import {PendingPatientsPageComponent} from './pages/pending-patients-page.component.tsx';
import {PatientsListPageComponent} from './pages/patients-list-page.component.tsx';
import {Route} from './features/routes/route.component.tsx';

function App() {
  return (
    <PatientsProvider>
      <HeaderComponent title="CDM Optimiser" />
      <Route path="/" Component={PatientsListPageComponent} />
      <Route
        path="/pending-patients"
        Component={PendingPatientsPageComponent}
      />
      <FooterComponent brand="CDM Optimiser" />
    </PatientsProvider>
  );
}

export default App;
