import type {ComponentType} from 'react';
import {useAutoDismiss} from '../hooks/useAutoDismiss.ts';
import {AlertCircleFilledIcon} from '../icons/alert-circle-filled.icon.tsx';
import {AlertTriangleFilledIcon} from '../icons/alert-triangle-filled.icon.tsx';
import {CircleCheckFilledIcon} from '../icons/circle-check-filled.icon.tsx';
import type {IconProps} from '../icons/iconProps.ts';
import {InfoCircleFilledIcon} from '../icons/info-circle-filled.icon.tsx';
import {SquareXFilledIcon} from '../icons/square-x-filled.icon.tsx';
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
    container: 'bg-red-50 border-red-400',
    accent: 'text-red-400',
    text: 'text-red-800',
    bar: 'bg-red-400',
    icon: AlertCircleFilledIcon,
    role: 'alert',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-400',
    accent: 'text-yellow-400',
    text: 'text-yellow-700',
    bar: 'bg-yellow-400',
    icon: AlertTriangleFilledIcon,
    role: 'alert',
  },
  info: {
    container: 'bg-sky-50 border-sky-400',
    accent: 'text-sky-400',
    text: 'text-sky-800',
    bar: 'bg-sky-400',
    icon: InfoCircleFilledIcon,
    role: 'status',
  },
  success: {
    container: 'bg-green-50 border-green-400',
    accent: 'text-green-400',
    text: 'text-green-800',
    bar: 'bg-green-400',
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
