// Presentational building blocks shared by the CDM Optimiser apps.
// Keep this package free of Supabase, routing and app state: components get
// everything they need through props.

export {AlertComponent} from './components/alert.component.tsx';
export {
  DropdownComponent,
  type DropdownItem,
} from './components/dropdown.component.tsx';
export {FooterComponent} from './components/footer.component.tsx';
export {ModalComponent} from './components/modal.component.tsx';
export {SVGComponent} from './components/svg.component.tsx';
export {useAutoDismiss} from './hooks/useAutoDismiss.tsx';
export type {AlertTypes} from './types/alert.ts';
