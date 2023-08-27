import { ChangeEvent } from 'react';
import './ContactInfo.scss';

interface Props {
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfo = ({ updateFormData }: Props) => {
  return (
    <fieldset className="contanct-info">
      <label className="name-label">
        Numele clientului
        <input onChange={updateFormData} type="text" name="name" id="name-cx" />
      </label>
      <label className="phone-label">
        Numar de telefon
        <input onChange={updateFormData} type="number" name="phone" id="phone-cx" maxLength={10} minLength={10} />
      </label>
    </fieldset>
  );
};

export default ContactInfo;
