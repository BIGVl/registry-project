import { ChangeEvent } from 'react';
import './CustomersSection.scss';

interface Props {
  adults: string;
  kids: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomersSection({ adults, kids, onChange }: Props) {
  return (
    <section className="update-persons">
      <label>
        Adulti
        <input type="number" name="adults" className="adults" value={adults} onChange={onChange} />
      </label>
      <label>
        Copii
        <input type="number" name="kids" className="kids" value={kids} onChange={onChange} />
      </label>
    </section>
  );
}
