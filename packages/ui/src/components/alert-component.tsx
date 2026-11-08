import type {ComponentType} from 'react';
import {useAutoDismiss} from '../hooks/use-auto-dismiss.ts';
import {AlertCircleFilledIcon} from '../icons/alert-circle-filled-icon.tsx';
import {AlertTriangleFilledIcon} from '../icons/alert-triangle-filled-icon.tsx';
import {CircleCheckFilledIcon} from '../icons/circle-check-filled-icon.tsx';
import type {IconProps} from '../icons/icon-props.ts';
import {InfoCircleFilledIcon} from '../icons/info-circle-filled-icon.tsx';
import {SquareXFilledIcon} from '../icons/square-x-filled-icon.tsx';
import type {AlertTypes} from '../types/alert.ts';

interface AlertProps {
  type?: AlertTypes;
  title: string;
  text: string;
  /** Dismiss automatically after this many milliseconds, with a progress bar. */
  autoDismissMs?: number | null;
  /** Shows a close button, and is called when the alert is dismissed. */
  onDismiss?: () => void;
}

// Each type uses three steps of one hue: a pale tint for the background,
// an accent for the border, icon, close button and progress bar (at least
// 3:1 on the tint), and a dark shade for the text (at least 4.5:1).
interface AlertStyle {
  container: string;
  accent: string;
  text: string;
  bar: string;
  icon: ComponentType<IconProps>;
  /**
   * `alert` interrupts screen readers; keep it for problems. `status` is
   * read politely, for information and confirmations.
   */
  role: 'alert' | 'status';
}

const STYLES: Record<AlertTypes, AlertStyle> = {
  error: {
    container: 'bg-red-50 border-red-600',
    accent: 'text-red-600',
    text: 'text-red-800',
    bar: 'bg-red-600',
    icon: AlertCircleFilledIcon,
    role: 'alert',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-700',
    accent: 'text-yellow-700',
    text: 'text-yellow-800',
    bar: 'bg-yellow-700',
    icon: AlertTriangleFilledIcon,
    role: 'alert',
  },
  info: {
    container: 'bg-sky-50 border-sky-700',
    accent: 'text-sky-700',
    text: 'text-sky-800',
    bar: 'bg-sky-700',
    icon: InfoCircleFilledIcon,
    role: 'status',
  },
  success: {
    container: 'bg-green-50 border-green-700',
    accent: 'text-green-700',
    text: 'text-green-800',
    bar: 'bg-green-700',
    icon: CircleCheckFilledIcon,
    role: 'status',
  },
};

export function AlertComponent({
  type = 'info',
  title,
  text,
  autoDismissMs,
  onDismiss,
}: AlertProps) {
  const delay = autoDismissMs && autoDismissMs > 0 ? autoDismissMs : 0;
  const {progressRef} = useAutoDismiss(delay, onDismiss);
  const style = STYLES[type];
  const Icon = style.icon;

  return (
    <div
      role={style.role}
      className={`rounded-xl border-l-4 p-4 shadow-md ${style.container}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex">
          <Icon className={`shrink-0 ${style.accent}`} />
          <div className="ml-3">
            <h3 className={`font-medium ${style.text}`}>{title}</h3>
            <p className={`mt-2 ${style.text}`}>{text}</p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className={`ml-auto shrink-0 cursor-pointer self-start pl-3 ${style.accent}`}
            >
              <SquareXFilledIcon />
              <span className="sr-only">Close alert</span>
            </button>
          )}
        </div>
        {delay > 0 && (
          <div
            ref={progressRef}
            aria-hidden="true"
            data-testid="alert-progress"
            className={`h-1 origin-left rounded-b-xl ${style.bar}`}
          />
        )}
      </div>
    </div>
  );
}
