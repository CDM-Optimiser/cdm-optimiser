import {useId, type InputHTMLAttributes, type ReactNode} from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Always required: it is the field's accessible name. */
  label: string;
  /** Keep the label for screen readers only (for example a search box). */
  hideLabel?: boolean;
  /** A decorative icon shown inside the field, on the left. */
  icon?: ReactNode;
}

// The border and the focus ring keep at least 3:1, and the placeholder
// 4.5:1, in both modes. The border is an outline, so the field sets the
// focus ring itself, matching the app's ring on every other control.
const INPUT =
  'w-full rounded-md bg-white px-3 py-2 shadow-md outline-1 outline-gray-500 transition duration-200 ease-in-out placeholder:text-gray-500 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-white/5 dark:text-white dark:outline-gray-500 dark:placeholder:text-gray-400 dark:focus-visible:outline-sky-400';

/** A labelled text input. Pass any `<input>` attribute (type, value, …). */
export function TextFieldComponent({
  label,
  hideLabel = false,
  icon,
  id,
  className,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}
    >
      <label
        htmlFor={inputId}
        className={hideLabel ? 'sr-only' : 'font-medium'}
      >
        {label}
      </label>
      <div className="grid">
        <input
          id={inputId}
          className={`col-start-1 row-start-1 ${INPUT} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        {icon && (
          <span className="pointer-events-none col-start-1 row-start-1 ml-3 self-center text-gray-500 dark:text-gray-400">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
