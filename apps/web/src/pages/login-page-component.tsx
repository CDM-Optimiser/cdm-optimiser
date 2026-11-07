import {Navigate, useLocation} from 'react-router';
import {CardComponent} from '@cdm-optimiser/ui/components/card-component.tsx';
import {getRedirectPath} from '../features/auth/get-redirect-path.ts';
import {LoginFormComponent} from '../features/auth/login-form-component.tsx';
import {useAuth} from '../features/auth/use-auth.ts';

export function LoginPageComponent() {
  const {session, loading} = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (session) {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center p-6">
      <CardComponent className="flex flex-col gap-6 p-8">
        <h1 className="text-center text-2xl font-bold">
          Login to CDM Optimiser
        </h1>
        <LoginFormComponent />
      </CardComponent>
    </main>
  );
}
