import { ChangeEvent } from 'react';
import './ContactSection.scss';

interface Props {
  name: string;
  phone: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactSection({ name, phone, onChange }: Props) {
  return (
    <section className="update-contact-section">
      <label>
        Nume
        <input type="text" name="name" className="name" value={name} onChange={onChange} />
      </label>

      <label>
        Telefon
        <input type="number" name="phone" className="phone" value={phone} onChange={onChange} />
      </label>
    </section>
  );
}
