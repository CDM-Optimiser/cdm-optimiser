import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import {useAuth} from '../utils/hooks/useAuth.tsx';
import {getErrorMessage} from '../utils/getErrorMessage.ts';
import {AlertComponent} from '../features/ui/alert.component.tsx';

export function LoginPageComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);

      navigate('/');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="align-center mx-auto flex h-dvh w-dvw max-w-md flex-col justify-center p-6">
      <div className="flex flex-col gap-4 rounded-md bg-white p-8 shadow-md dark:bg-white/5 dark:ring dark:ring-gray-600">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Login to CDM Optimiser
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
            required
            className="w-full rounded-md bg-white px-1 py-2 shadow-md outline-1 outline-offset-1 outline-gray-200 transition duration-200 ease-in-out focus:outline-4 focus:outline-offset-1 focus:outline-sky-500 dark:bg-white/5 dark:text-white dark:outline-gray-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            required
            className="w-full rounded-md bg-white px-1 py-2 shadow-md outline-1 outline-offset-1 outline-gray-200 transition duration-200 ease-in-out focus:outline-4 focus:outline-offset-1 focus:outline-sky-500 dark:bg-white/5 dark:text-white dark:outline-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-sky-500 p-2 text-white transition duration-300 ease-in-out hover:bg-sky-700"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && (
          <div className="mt-6">
            <AlertComponent type="error" title="Error" text={error} />
          </div>
        )}
      </div>
    </div>
  );
}
