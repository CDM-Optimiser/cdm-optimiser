import { FooterComponent } from './features/ui/shared/footer/footer.component.tsx';
import { HeaderComponent } from './features/ui/shared/header/header.component.tsx';

function App() {
  return (
    <>
      <HeaderComponent title='CDM Optimiser' />
      <FooterComponent brand='CDM Optimiser' copyright='All rights reserved.' />
    </>
  );
}

export default App;
