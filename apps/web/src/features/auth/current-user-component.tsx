import {UserCircleIcon} from '@cdm-optimiser/ui/icons/user-circle-icon.tsx';
import {getUserDisplayName} from './get-user-display-name.ts';
import {useAuth} from './use-auth.ts';

/**
 * The signed-in user: an avatar and their name (or email). Only rendered
 * on signed-in pages, so a missing user shows nothing.
 */
export function CurrentUserComponent() {
  const {user} = useAuth();

  if (!user) return null;

  const name = getUserDisplayName(user);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <UserCircleIcon
        width={32}
        height={32}
        className="shrink-0 text-gray-500 dark:text-gray-400"
      />
      <span className="truncate" title={name}>
        <span className="sr-only">Signed in as </span>
        {name}
      </span>
    </div>
  );
}
