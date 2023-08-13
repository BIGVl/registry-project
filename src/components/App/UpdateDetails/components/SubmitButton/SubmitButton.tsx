import { DocumentData } from 'firebase/firestore';
import { FormData } from '../../../../../globalInterfaces';
import validateDetails from '../../../../../helpers/validateDetails';
import './SubmitButton.scss';

interface Props {
  customerData: FormData | DocumentData;
  setErrorMessage: (value: string) => void;
  setConfirmSubmit: (value: boolean) => void;
}

export default function SubmitButton({ customerData, setErrorMessage, setConfirmSubmit }: Props) {
  return (
    <button
      type="button"
      className="submit-update-button"
      onClick={() => {
        validateDetails(customerData, setErrorMessage, setConfirmSubmit);
      }}
    >
      Actualizeaza
    </button>
  );
}
