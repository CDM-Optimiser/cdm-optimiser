import {useEffect, useEffectEvent, useRef} from 'react';

/**
 * Calls `onDismiss` once, `autoDismissMs` after the component mounts (or the
 * delay changes). Attach `progressRef` to an element to shrink it to zero
 * over the same time; the browser animates it, so the component doesn't
 * re-render while waiting. A delay of 0 or less turns it off.
 */
export function useAutoDismiss<T extends HTMLElement = HTMLDivElement>(
  autoDismissMs: number,
  onDismiss?: () => void
) {
  const progressRef = useRef<T>(null);
  // Always calls the latest onDismiss without restarting the timer.
  const dismiss = useEffectEvent(() => onDismiss?.());

  useEffect(() => {
    if (autoDismissMs <= 0) return;

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const animation = reduceMotion
      ? undefined
      : progressRef.current?.animate(
          [{transform: 'scaleX(1)'}, {transform: 'scaleX(0)'}],
          {duration: autoDismissMs, easing: 'linear', fill: 'forwards'}
        );

    const timer = setTimeout(() => dismiss(), autoDismissMs);

    return () => {
      clearTimeout(timer);
      animation?.cancel();
    };
  }, [autoDismissMs]);

  return {progressRef};
}
