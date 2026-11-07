import {useNavigate} from 'react-router';
import {useAuth} from '../../utils/hooks/useAuth.tsx';

export function LogoutButton() {
  const {logout, user} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate('/login');
  };

  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border-b-4 border-sky-500 border-b-sky-600 bg-sky-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:border-sky-800 hover:bg-sky-600 hover:text-white active:border-b-0 dark:border-b-sky-700 dark:bg-sky-500 dark:hover:border-sky-900 dark:hover:bg-sky-800"
    >
      Logout
    </button>
  );
}
