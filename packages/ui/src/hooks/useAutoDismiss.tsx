import {useEffect, useState} from 'react';

export const useAutoDismiss = (
  autoDismissMs: number,
  onDismiss: () => void
) => {
  const [progressBar, setProgressBar] = useState(100);

  useEffect(() => {
    if (!autoDismissMs) return;

    const interval = 50;
    const decrement = (interval / autoDismissMs) * 100;

    const timer = setInterval(() => {
      setProgressBar((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setTimeout(onDismiss, 0);

          return 0;
        }

        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoDismissMs, onDismiss]);

  return {
    progressBar,
  };
};
