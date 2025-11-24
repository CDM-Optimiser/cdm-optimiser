import {FooterComponent} from './features/ui/footer.component.tsx';
import {HeaderComponent} from './features/ui/header.component.tsx';
import {PatientsCardPageComponent} from './pages/patients-cards-page.component.tsx';
import {PatientsListPageComponent} from './pages/patients-list-page.component.tsx';
import {Route} from './features/routes/route.component.tsx';

function App() {
  return (
    <>
      <HeaderComponent title="CDM Optimiser" />
      <Route path="/" Component={PatientsListPageComponent} />
      {/* <Route path="/patients-cards" Component={PatientsCardPageComponent} /> */}
      <FooterComponent brand="CDM Optimiser" />
    </>
  );
}

export default App;
