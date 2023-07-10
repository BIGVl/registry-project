import { ChangeEvent } from 'react';
import './DatesSection.scss';

interface Props {
  entryDate: string;
  leaveDate: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export default function DatesSection({ entryDate, leaveDate, onChange }: Props) {
  return (
    <section className="update-dates">
      <label>
        Data de intrare
        <input type="date" name="entryDate" className="entryDate" value={entryDate} onChange={onChange} />
      </label>
      <label>
        Data de iesire
        <input type="date" name="leaveDate" className="leaveDate" value={leaveDate} onChange={onChange} />
      </label>
    </section>
  );
}
