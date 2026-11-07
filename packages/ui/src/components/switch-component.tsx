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

const TRACK_ON: Record<SwitchTone, string> = {
  positive: 'has-checked:bg-green-500',
  negative: 'has-checked:bg-red-500',
};

const KNOB_ON: Record<SwitchTone, string> = {
  positive: 'group-has-checked:ring-green-500',
  negative: 'group-has-checked:ring-red-500',
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
        className={`group relative inline-flex h-6 w-12 shrink-0 rounded-xl bg-gray-300 p-0.5 transition duration-200 ease-in-out has-focus-visible:outline-4 has-focus-visible:outline-offset-2 has-focus-visible:outline-sky-500 dark:bg-white/5 dark:ring dark:ring-gray-600 ${TRACK_ON[tone]}`}
      >
        <input
          type="checkbox"
          role="switch"
          className="absolute inset-0 cursor-pointer appearance-none rounded-xl"
          {...props}
        />
        <span
          className={`pointer-events-none relative inline-flex h-5 w-5 items-center justify-center rounded-xl bg-white ring-1 ring-gray-300 transition duration-200 ease-in-out group-has-checked:translate-x-6 dark:text-gray-900 ${KNOB_ON[tone]}`}
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
