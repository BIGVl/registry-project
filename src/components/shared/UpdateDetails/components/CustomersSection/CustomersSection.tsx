import { ChangeEvent } from 'react';
import './CustomersSection.scss';
import { EditSection } from '../../UpdateDetails';

interface Props {
  adults: string;
  kids: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function CustomersSection({ adults, kids, onChange, editSection, setEditSection }: Props) {
  const editMode = editSection === 'customer';

  return editMode ? (
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
  ) : (
    <div className="display-persons">
      <div className="adults"> {adults} adulti</div>
      <div className="kids"> {kids} copii </div>
    </div>
  );
}
