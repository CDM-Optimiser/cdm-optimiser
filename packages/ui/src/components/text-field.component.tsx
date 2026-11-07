import {useId, type InputHTMLAttributes, type ReactNode} from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Always required: it is the field's accessible name. */
  label: string;
  /** Keep the label for screen readers only (for example a search box). */
  hideLabel?: boolean;
  /** A decorative icon shown inside the field, on the left. */
  icon?: ReactNode;
}

const INPUT =
  'w-full rounded-md bg-white px-3 py-2 shadow-md outline-1 outline-offset-1 outline-gray-200 transition duration-200 ease-in-out focus:outline-4 focus:outline-offset-1 focus:outline-sky-500 dark:bg-white/5 dark:text-white dark:outline-gray-600';

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
          <span className="pointer-events-none col-start-1 row-start-1 ml-3 self-center text-gray-400">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
