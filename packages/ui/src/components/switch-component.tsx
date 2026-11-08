import type {InputHTMLAttributes} from 'react';
import {CheckIcon} from '../icons/check-icon.tsx';
import {DotsIcon} from '../icons/dots-icon.tsx';
import {XIcon} from '../icons/x-icon.tsx';

export type SwitchTone = 'positive' | 'negative';

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role'
> {
  /** The visible label, which is also the switch's accessible name. */
  label: string;
  /** Colour and icon when on: green with a tick, or red with a cross. */
  tone?: SwitchTone;
}

// The track and the white knob keep at least 3:1 against each other and the
// surface around them, on or off, so the switch and its state are visible.
const TRACK_ON: Record<SwitchTone, string> = {
  positive: 'has-checked:bg-green-700 dark:has-checked:bg-green-700',
  negative: 'has-checked:bg-red-600 dark:has-checked:bg-red-600',
};

const KNOB_ON: Record<SwitchTone, string> = {
  positive: 'group-has-checked:ring-green-700',
  negative: 'group-has-checked:ring-red-600',
};

/**
 * An on/off switch: a native checkbox with `role="switch"`, so keyboard
 * (Space) and screen readers work without extra code. Controlled or
 * uncontrolled like any checkbox (`checked` + `onChange`, or `defaultChecked`).
 */
export function SwitchComponent({
  label,
  tone = 'positive',
  className,
  ...props
}: SwitchProps) {
  const OnIcon = tone === 'positive' ? CheckIcon : XIcon;

  return (
    <label
      className={['inline-flex cursor-pointer items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="font-medium select-none">{label}</span>
      <span
        className={`group relative inline-flex h-6 w-12 shrink-0 rounded-xl bg-gray-500 p-0.5 transition duration-200 ease-in-out dark:bg-white/5 dark:ring dark:ring-gray-500 ${TRACK_ON[tone]}`}
      >
        {/* Covers the track, so the app's focus ring goes around it. */}
        <input
          type="checkbox"
          role="switch"
          className="absolute inset-0 cursor-pointer appearance-none rounded-xl"
          {...props}
        />
        <span
          className={`pointer-events-none relative inline-flex h-5 w-5 items-center justify-center rounded-xl bg-white ring-1 ring-gray-500 transition duration-200 ease-in-out group-has-checked:translate-x-6 dark:text-gray-900 ${KNOB_ON[tone]}`}
        >
          <DotsIcon
            width={16}
            height={16}
            className="absolute group-has-checked:opacity-0"
          />
          <OnIcon
            width={16}
            height={16}
            className="absolute opacity-0 group-has-checked:opacity-100"
          />
        </span>
      </span>
    </label>
  );
}
