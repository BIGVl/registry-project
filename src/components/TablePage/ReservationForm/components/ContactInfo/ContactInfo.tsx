import { ChangeEvent } from 'react';
import './ContactInfo.scss';

interface Props {
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfo = ({ updateFormData }: Props) => {
  return (
    <fieldset className="contanct-info">
      <label htmlFor="name" className="name-label">
        Numele clientului
        <input onChange={updateFormData} type="text" name="name" id="name-cx" />
      </label>
      <label htmlFor="phone" className="phone-label">
        Numar de telefon
        <input onChange={updateFormData} type="number" name="phone" id="phone-cx" />
      </label>
    </fieldset>
  );
};

export default ContactInfo;
