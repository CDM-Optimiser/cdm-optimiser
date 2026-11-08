import {UserCircleIcon} from '@cdm-optimiser/ui/icons/user-circle-icon.tsx';
import {useAuth} from './use-auth.ts';

/**
 * The signed-in user: an avatar and their email. Only rendered on
 * signed-in pages, so a missing user shows nothing.
 */
export function CurrentUserComponent() {
  const {user} = useAuth();

  if (!user?.email) return null;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <UserCircleIcon
        width={32}
        height={32}
        className="shrink-0 text-gray-500 dark:text-gray-400"
      />
      <span className="truncate" title={user.email}>
        <span className="sr-only">Signed in as </span>
        {user.email}
      </span>
    </div>
  );
}
