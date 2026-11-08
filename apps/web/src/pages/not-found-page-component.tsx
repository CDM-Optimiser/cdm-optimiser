import {Link} from 'react-router';

export function NotFoundPageComponent() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="text-xl">The page you are looking for doesn’t exist.</p>
      <Link
        to="/"
        className="text-sky-700 underline transition duration-200 ease-in-out hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
      >
        Go to the patients list
      </Link>
    </div>
  );
}
