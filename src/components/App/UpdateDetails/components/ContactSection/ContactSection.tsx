import './ContactSection.scss';
import { ChangeEvent } from 'react';
import { EditSection } from '../../UpdateDetails';
import ExitEditModeButton from '../ExitEditModeButton/ExitEditModeButton';

interface Props {
  name: string;
  phone: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function ContactSection({ name, phone, onChange, editSection, setEditSection }: Props) {
  const editMode = editSection === 'contact';
  const upperName = name
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
  const phoneNumberFormatted = `${phone.substring(0, 4)}-${phone.substring(4, 7)}-${phone.substring(7, 10)} `;

  return (
    <div className="update-contact-container">
      {editMode ? (
        <section className="update-contact">
          <div className="name-phone">
            <label>
              Nume
              <input type="text" name="name" className="name" value={upperName} onChange={onChange} />
            </label>

            <label>
              Telefon
              <input type="number" name="phone" className="phone" value={phone} onChange={onChange} />
            </label>
          </div>
          <div className="close">
            <ExitEditModeButton setEditSection={setEditSection} />
          </div>
        </section>
      ) : (
        <button className="display-contact" onClick={() => setEditSection('contact')}>
          <div className="name"> {upperName} </div>
          <div className="phone"> Telefon {phoneNumberFormatted} </div>
        </button>
      )}
    </div>
  );
}
