import { ChangeEvent } from 'react';
import './DatesSection.scss';

interface Props {
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
}

const DatesSection = ({ updateFormData }: Props) => {
  return (
    <fieldset id="dates" className="dates">
      <label htmlFor="entryDate" className="entryDate">
        Data intrare
        <input onChange={updateFormData} lang="ro" type="date" name="entryDate" id="date-enter" />
      </label>
      <label htmlFor="leaveDate" className="leaveDate">
        Data iesire
        <input onChange={updateFormData} lang="ro" type="date" name="leaveDate" id="date-leave" />
      </label>
    </fieldset>
  );
};

export default DatesSection;
