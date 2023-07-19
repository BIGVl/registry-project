import { ChangeEvent } from 'react';
import './DatesSection.scss';
import { EditSection } from '../../UpdateDetails';

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
      <label>
        Data de intrare
        <input type="date" name="entryDate" className="entryDate" value={entryDate} onChange={onChange} />
      </label>
      <label>
        Data de iesire
        <input type="date" name="leaveDate" className="leaveDate" value={leaveDate} onChange={onChange} />
      </label>
    </section>
  ) : (
    <div className="display-dates">
      <div className="entryDate"> Intrare {entryDate} </div>
      <div className="leaveDate"> Iesire {leaveDate} </div>
    </div>
  );
}
