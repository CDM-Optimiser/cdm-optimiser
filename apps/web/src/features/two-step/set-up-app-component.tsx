import {useMutation} from '@tanstack/react-query';
import type {FormEvent} from 'react';
import {AlertComponent} from '@cdm-optimiser/ui/components/alert-component.tsx';
import {ButtonComponent} from '@cdm-optimiser/ui/components/button-component.tsx';
import {TextFieldComponent} from '@cdm-optimiser/ui/components/text-field-component.tsx';
import {getTwoStepErrorMessage} from './get-two-step-error-message.ts';
import {startAppSetup, verifyAppCode} from './two-step-api.ts';
import {CODE_FIELD} from './two-step-fields.ts';

interface SetUpAppProps {
  /** Pre-filled name; the first app gets one, later ones are named. */
  defaultName?: string;
  /** The final button's words. */
  confirmLabel: string;
  /** Called once the app is set up (the session is then `aal2`). */
  onDone?: () => void;
  /** Shows a Cancel button. */
  onCancel?: () => void;
}

/** Splits the key into groups of four, easier to type into an app. */
function groupKey(secret: string) {
  return secret.match(/.{1,4}/g)?.join(' ') ?? secret;
}

const fieldValue = (event: FormEvent<HTMLFormElement>, name: string) =>
  String(new FormData(event.currentTarget).get(name) ?? '');

/**
 * Adds an authenticator app: name it, scan the QR code (or type the key),
 * then confirm with the app's first code. Nothing is created until the
 * user asks for the QR code.
 */
export function SetUpAppComponent({
  defaultName = '',
  confirmLabel,
  onDone,
  onCancel,
}: SetUpAppProps) {
  const start = useMutation({
    mutationFn: (name: string) => startAppSetup(name),
  });
  const confirm = useMutation({
    mutationFn: ({factorId, code}: {factorId: string; code: string}) =>
      verifyAppCode(factorId, code),
    onSuccess: () => onDone?.(),
  });

  // Alone (at sign-in) the button fills the card, like the others there;
  // next to Cancel (on the Account page) both keep their own width.
  const buttonRow = onCancel ? 'flex flex-wrap gap-3' : 'flex flex-col';
  const cancelButton = onCancel && (
    <ButtonComponent variant="secondary" onClick={onCancel}>
      Cancel
    </ButtonComponent>
  );

  if (!start.data) {
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          start.mutate(fieldValue(event, 'name').trim());
        }}
      >
        <TextFieldComponent
          label="Name for this app"
          name="name"
          defaultValue={defaultName}
          hint="To tell your apps apart, for example “Work phone”."
          maxLength={60}
          required
        />
        <div className={buttonRow}>
          <ButtonComponent type="submit" disabled={start.isPending}>
            {start.isPending ? 'Preparing…' : 'Show the QR code'}
          </ButtonComponent>
          {cancelButton}
        </div>
        {start.isError && (
          <AlertComponent
            type="error"
            title="Couldn’t start the setup"
            text={getTwoStepErrorMessage(start.error)}
          />
        )}
      </form>
    );
  }

  const {factorId, qrCode, secret} = start.data;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        confirm.mutate({factorId, code: fieldValue(event, 'code')});
      }}
    >
      <p>In your authenticator app, add an account and scan this QR code.</p>
      {/* Codes are dark on light; keep a light frame in dark mode too. */}
      <img
        src={qrCode}
        alt="QR code to scan with your authenticator app"
        width={192}
        height={192}
        className="self-start rounded-md bg-white p-2"
      />
      <p>
        Can’t scan it? Enter this key in the app instead:{' '}
        <code className="font-mono break-words">{groupKey(secret)}</code>
      </p>
      <TextFieldComponent
        label="Code from your authenticator app"
        hint="The app shows a new 6-digit code every 30 seconds."
        {...CODE_FIELD}
      />
      <div className={buttonRow}>
        <ButtonComponent type="submit" disabled={confirm.isPending}>
          {confirm.isPending ? 'Checking…' : confirmLabel}
        </ButtonComponent>
        {cancelButton}
      </div>
      {confirm.isError && (
        <AlertComponent
          type="error"
          title="Code not accepted"
          text={getTwoStepErrorMessage(confirm.error)}
        />
      )}
    </form>
  );
}
