import {useEffect, useEffectEvent} from 'react';

/** Tailwind's breakpoints, as media queries. */
const MIN_WIDTH = {
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
} as const;

/**
 * Calls `close` if the window reaches `breakpoint` while a small-screen
 * drawer is open, since the wide layout then shows the same things. Pass the
 * breakpoint whose `hidden <breakpoint>:flex` shows the wide layout.
 */
export function useCloseOnWideScreen(
  isOpen: boolean,
  close: () => void,
  breakpoint: keyof typeof MIN_WIDTH
) {
  const onWideScreen = useEffectEvent(close);

  useEffect(() => {
    if (!isOpen) return;

    const wideScreen = window.matchMedia(MIN_WIDTH[breakpoint]);
    const closeOnWideScreen = () => {
      if (wideScreen.matches) onWideScreen();
    };

    wideScreen.addEventListener('change', closeOnWideScreen);

    return () => wideScreen.removeEventListener('change', closeOnWideScreen);
  }, [isOpen, breakpoint]);
}
