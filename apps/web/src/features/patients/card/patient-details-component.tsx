import type {Patient} from '../model/patient.ts';

const FIELDS: readonly {
  key: keyof Pick<Patient, 'dob' | 'address' | 'home_phone' | 'mobile_phone'>;
  label: string;
}[] = [
  {key: 'dob', label: 'D.O.B.'},
  {key: 'address', label: 'Address'},
  {key: 'home_phone', label: 'Home Phone'},
  {key: 'mobile_phone', label: 'Mobile Phone'},
];

/** The patient's name and contact details. */
export function PatientDetailsComponent({patient}: {patient: Patient}) {
  return (
    <dl className="grid grid-cols-2 gap-6">
      <div className="col-span-2 flex flex-col gap-2">
        <dt className="font-bold">Name</dt>
        <dd>{patient.name}</dd>
      </div>
      {FIELDS.map(({key, label}) => (
        <div key={key} className="flex flex-col gap-2">
          <dt className="font-bold">{label}</dt>
          <dd>{patient[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
