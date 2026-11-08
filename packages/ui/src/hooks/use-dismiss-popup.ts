import {useEffect, useEffectEvent, type RefObject} from 'react';

/**
 * Closes an open popup (a dropdown's list, a menu) when the user presses
 * Escape or presses anywhere outside `containerRef`. Escape also puts focus
 * back on `triggerRef`, so keyboard users keep their place.
 */
export function useDismissPopup(
  isOpen: boolean,
  onDismiss: () => void,
  containerRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>
) {
  const dismiss = useEffectEvent(onDismiss);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) dismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef, triggerRef]);
}
