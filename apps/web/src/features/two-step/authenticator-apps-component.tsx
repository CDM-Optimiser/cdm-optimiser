import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {isDemoAccount} from '../auth/is-demo-account.ts';
import {useAuth} from '../auth/use-auth.ts';
import {getTwoStepErrorMessage} from './get-two-step-error-message.ts';
import {SetUpAppComponent} from './set-up-app-component.tsx';
import {listAuthenticatorApps, removeAuthenticatorApp} from './two-step-api.ts';
import {AUTHENTICATOR_APPS_KEY} from './two-step-fields.ts';

const DATE = new Intl.DateTimeFormat('en-IE', {dateStyle: 'medium'});

/**
 * The Account page's two-step sign-in section: the user's authenticator
 * apps, a way to add another (for a lost phone) and to remove one. The
 * last app can't be removed: everyone needs one to sign in.
 */
export function AuthenticatorAppsComponent() {
  const {user} = useAuth();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const apps = useQuery({
    queryKey: AUTHENTICATOR_APPS_KEY,
    queryFn: listAuthenticatorApps,
    enabled: !isDemoAccount(user),
  });
  const refresh = () =>
    queryClient.invalidateQueries({queryKey: AUTHENTICATOR_APPS_KEY});
  const remove = useMutation({
    mutationFn: (factorId: string) => removeAuthenticatorApp(factorId),
    onSuccess: () => {
      setNotice('App removed. It no longer works for signing in.');
      void refresh();
    },
  });

  if (isDemoAccount(user)) {
    return (
      <AlertComponent
        type="info"
        title="Not used by the demo account"
        text="Everyone trying the app shares the demo account, so it signs in with its password only."
      />
    );
  }

  if (apps.isPending) return <p>Loading your apps…</p>;

  if (apps.isError) {
    return (
      <AlertComponent
        type="error"
        title="Couldn’t load your apps"
        text={getTwoStepErrorMessage(apps.error)}
      />
    );
  }

  const canRemove = apps.data.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <p>
        Each time you sign in, CDM Optimiser asks for a code from one of these
        authenticator apps.
      </p>
      <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
        {apps.data.map((app) => (
          <li
            key={app.id}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div className="flex min-w-0 flex-col">
              <span className="font-medium break-words">
                {app.friendly_name ?? 'Authenticator app'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Added {DATE.format(new Date(app.created_at))}
              </span>
            </div>
            {canRemove && (
              <ButtonComponent
                variant="secondary"
                disabled={remove.isPending}
                onClick={() => {
                  setNotice(null);
                  remove.mutate(app.id);
                }}
              >
                Remove
                <span className="sr-only">
                  {' '}
                  {app.friendly_name ?? 'authenticator app'}
                </span>
              </ButtonComponent>
            )}
          </li>
        ))}
      </ul>
      {!canRemove && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Add a second app, such as another phone or a password manager, in case
          you lose this one. To change apps, add the new one first.
        </p>
      )}
      {remove.isError && (
        <AlertComponent
          type="error"
          title="App not removed"
          text={getTwoStepErrorMessage(remove.error)}
        />
      )}
      {notice && (
        <AlertComponent
          type="success"
          title="Done"
          text={notice}
          onDismiss={() => setNotice(null)}
        />
      )}
      {isAdding ? (
        <SetUpAppComponent
          confirmLabel="Add app"
          onCancel={() => setIsAdding(false)}
          onDone={() => {
            setIsAdding(false);
            setNotice('App added. You can now sign in with its codes too.');
            void refresh();
          }}
        />
      ) : (
        <ButtonComponent
          variant="secondary"
          className="self-start"
          onClick={() => {
            setNotice(null);
            setIsAdding(true);
          }}
        >
          Add another app
        </ButtonComponent>
      )}
    </div>
  );
}
