import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {ModalComponent} from '@cdm-optimiser/ui/components/modal-component.tsx';
import {MenuIcon} from '@cdm-optimiser/ui/icons/menu-icon.tsx';
import {CurrentUserComponent} from '../auth/current-user-component.tsx';
import {LogoutButton} from '../auth/logout-button.tsx';
import {ThemeMenuComponent} from '../theme/theme-menu-component.tsx';
import {MainNavComponent} from './main-nav-component.tsx';

/** Tailwind's `md` breakpoint: from here the menu fits in the bar. */
const WIDE_SCREEN = '(min-width: 48rem)';

interface HeaderProps {
  /** The app's name, linking to the patients list. */
  title: string;
}

/**
 * The top of every signed-in page (ProtectedLayout only renders it for a
 * signed-in user). The brand is a link, not a heading: each page has its own
 * `h1`.
 *
 * On wide screens the navigation, the theme menu and the account (the
 * signed-in user next to Logout) sit in the bar. On small screens a menu
 * button opens them in a drawer, the account last.
 */
export function HeaderComponent({title}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // A drawer left open while the window widens would cover a bar that now
  // shows the same links.
  useEffect(() => {
    if (!isMenuOpen) return;

    const wideScreen = window.matchMedia(WIDE_SCREEN);
    const closeOnWideScreen = () => {
      if (wideScreen.matches) setIsMenuOpen(false);
    };

    wideScreen.addEventListener('change', closeOnWideScreen);

    return () => wideScreen.removeEventListener('change', closeOnWideScreen);
  }, [isMenuOpen]);

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-700 px-6 py-4">
      <Link to="/" className="text-3xl">
        {title}
      </Link>

      <div className="hidden flex-wrap items-center gap-x-8 gap-y-3 md:flex">
        <MainNavComponent />
        <ThemeMenuComponent />
        <div className="flex items-center gap-3">
          <CurrentUserComponent />
          <LogoutButton />
        </div>
      </div>

      <ButtonComponent
        variant="secondary"
        className="px-3 md:hidden"
        aria-haspopup="dialog"
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </ButtonComponent>

      <ModalComponent
        isOpen={isMenuOpen}
        placement="end"
        title="Menu"
        onClose={closeMenu}
      >
        <MainNavComponent orientation="vertical" onNavigate={closeMenu} />
        <ThemeMenuComponent />
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-600">
          <CurrentUserComponent />
          <LogoutButton className="w-full" />
        </div>
      </ModalComponent>
    </header>
  );
}
