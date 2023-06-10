import { ChangeEvent } from 'react';
import './NrOfCustomer.scss';

interface Props {
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
}

const NrOfCustomers = ({ updateFormData }: Props) => {
  return (
    <fieldset className="adults-childs">
      <label id="adults-l" className="adults-l" htmlFor="adults">
        Adulti
        <input onChange={updateFormData} type="number" name="adults" id="adults" />
      </label>
      <label id="childs-l" className="childs-l" htmlFor="childs">
        Copii
        <input onChange={updateFormData} type="number" name="kids" id="childs" />
      </label>
    </fieldset>
  );
};

export default NrOfCustomers;
