import { ChangeEvent } from 'react';
import './NrOfCustomer.scss';

interface Props {
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
}

const NrOfCustomers = ({ updateFormData }: Props) => {
  return (
    <fieldset className="adults-childs">
      <label id="adults-l" className="adults-l">
        Adulti
        <input onChange={updateFormData} type="number" name="adults" id="adults" min={0} />
      </label>
      <label id="childs-l" className="childs-l">
        Copii
        <input onChange={updateFormData} type="number" name="kids" id="childs" min={0} />
      </label>
    </fieldset>
  );
};

export default NrOfCustomers;
