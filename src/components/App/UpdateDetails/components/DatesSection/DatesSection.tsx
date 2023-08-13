import { ChangeEvent } from 'react';
import './DatesSection.scss';
import { EditSection } from '../../UpdateDetails';
import ExitEditModeButton from '../ExitEditModeButton/ExitEditModeButton';

interface Props {
  entryDate: string;
  leaveDate: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function DatesSection({ entryDate, leaveDate, onChange, editSection, setEditSection }: Props) {
  const editMode = editSection === 'date';

  return editMode ? (
    <section className="update-dates">
      <div className="dates-input-section">
        <label>
          Data de intrare
          <input type="date" name="entryDate" className="entryDate" value={entryDate} onChange={onChange} />
        </label>
        <label>
          Data de iesire
          <input type="date" name="leaveDate" className="leaveDate" value={leaveDate} onChange={onChange} />
        </label>
      </div>
      <div className="close">
        <ExitEditModeButton setEditSection={setEditSection} />
      </div>
    </section>
  ) : (
    <button
      className="display-dates"
      onClick={() => {
        setEditSection('date');
      }}
    >
      <div className="entry-date">
        Intrare
        <div className="date">
          {new Date(entryDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: '2-digit' })}
        </div>
      </div>
      <div className="leave-date">
        Iesire
        <div className="date">
          {new Date(leaveDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: '2-digit' })}
        </div>
      </div>
    </button>
  );
}
