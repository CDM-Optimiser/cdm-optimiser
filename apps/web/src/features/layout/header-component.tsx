import {useState} from 'react';
import {Link} from 'react-router';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {ModalComponent} from '@cdm-optimiser/ui/components/modal-component.tsx';
import {MenuIcon} from '@cdm-optimiser/ui/icons/menu-icon.tsx';
import {AccountMenuComponent} from '../auth/account-menu-component.tsx';
import {useCloseOnWideScreen} from '../../hooks/use-close-on-wide-screen.ts';
import {ThemeMenuComponent} from '../theme/theme-menu-component.tsx';
import {BrandLogoComponent} from './brand-logo-component.tsx';
import {MainNavComponent} from './main-nav-component.tsx';

interface HeaderProps {
  /** The app's name: the logo's text alternative, linking to the list. */
  title: string;
}

/**
 * The top of every signed-in page (ProtectedLayout only renders it for a
 * signed-in user). The brand is a link, not a heading: each page has its own
 * `h1`.
 *
 * On wide screens the navigation, the theme menu and the account menu
 * (the signed-in email, opening Account and Logout) sit in the bar. On
 * small screens a menu button opens them in a drawer, the account last.
 */
export function HeaderComponent({title}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // `lg`, not `md`: the bar needs about 1000px to fit on one line, so
  // tablets in portrait (an iPad mini is 744–768px wide) get the menu too.
  useCloseOnWideScreen(isMenuOpen, closeMenu, 'lg');

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b-2 border-sky-700 px-6 py-4">
      <Link to="/" className="shrink-0">
        <BrandLogoComponent alt={title} className="h-10" />
      </Link>

      <div className="hidden flex-wrap items-center gap-x-8 gap-y-3 lg:flex">
        <MainNavComponent />
        <ThemeMenuComponent />
        <AccountMenuComponent align="end" className="max-w-xs" />
      </div>

      <ButtonComponent
        variant="secondary"
        className="px-3 lg:hidden"
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
        <div className="border-t border-gray-200 pt-6 dark:border-gray-600">
          <AccountMenuComponent className="w-full" onNavigate={closeMenu} />
        </div>
      </ModalComponent>
    </header>
  );
}
