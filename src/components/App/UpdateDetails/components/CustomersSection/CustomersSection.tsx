import { ChangeEvent } from 'react';
import './CustomersSection.scss';
import { EditSection } from '../../UpdateDetails';
import ExitEditModeButton from '../ExitEditModeButton/ExitEditModeButton';

interface Props {
  adults: string;
  kids: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function CustomersSection({ adults, kids, onChange, editSection, setEditSection }: Props) {
  const editMode = editSection === 'customer';

  return (
    <div className="update-persons-container">
      {editMode ? (
        <section className="update-persons">
          <label>
            Adulti
            <input type="number" name="adults" className="adults" value={adults} onChange={onChange} />
          </label>
          <label>
            Copii
            <input type="number" name="kids" className="kids" value={kids} onChange={onChange} />
          </label>
          <div className="close">
            <ExitEditModeButton setEditSection={setEditSection} />
          </div>
        </section>
      ) : (
        <div className="display-persons" onClick={() => setEditSection('customer')}>
          <div className="adults value-container ">
            Adulti <div className="value"> {adults} </div>
          </div>
          <div className="kids value-container ">
            Copii <div className="value"> {kids ? kids : '0'} </div>
          </div>
        </div>
      )}
    </div>
  );
}
