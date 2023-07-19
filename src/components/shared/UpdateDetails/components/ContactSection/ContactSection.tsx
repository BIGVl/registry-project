import { ChangeEvent } from 'react';
import './ContactSection.scss';
import { EditSection } from '../../UpdateDetails';

interface Props {
  name: string;
  phone: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function ContactSection({ name, phone, onChange, editSection, setEditSection }: Props) {
  const editMode = editSection === 'contact';

  return editMode ? (
    <section
      className="update-contact-section"
      onClick={(e) => {
        if (e.target instanceof HTMLElement) {
          console.log(e.target.tagName);
          e.target.tagName !== 'INPUT' && setEditSection('');
        }
      }}
    >
      <label>
        Nume
        <input type="text" name="name" className="name" value={name} onChange={onChange} />
      </label>

      <label>
        Telefon
        <input type="number" name="phone" className="phone" value={phone} onChange={onChange} />
      </label>
    </section>
  ) : (
    <div className="display-contact" onClick={() => setEditSection('contact')}>
      <div className="name"> {name} </div>
      <div className="phone"> Tel: {phone} </div>
    </div>
  );
}
