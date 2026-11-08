import {Navigate, Outlet, useLocation} from 'react-router';
import {useAuth} from '../features/auth/use-auth.ts';
import {FooterComponent} from '../features/layout/footer-component.tsx';
import {HeaderComponent} from '../features/layout/header-component.tsx';
import {APP_VERSION} from '../lib/app-version.ts';

/**
 * The frame of every signed-in page. Waits for the stored session, sends
 * signed-out users to the login page (remembering where they were going),
 * and renders the header, the page and the footer.
 */
export function ProtectedLayout() {
  const {session, loading} = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />;
  }

  return (
    <>
      <HeaderComponent title="CDM Optimiser" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <Outlet />
      </main>
      <FooterComponent brand="CDM Optimiser" version={APP_VERSION} />
    </>
  );
}
