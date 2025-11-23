import {useEffect, useState} from 'react';

export function useRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [state, setState] = useState<any>(window.history.state);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
      setState(window.history.state);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  function navigateTo(path: string, stateData?: any) {
    window.history.pushState(stateData, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return {
    pathname,
    state,
    navigateTo,
  };
}
