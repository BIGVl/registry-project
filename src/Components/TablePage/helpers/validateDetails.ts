import { DocumentData } from 'firebase/firestore';
import { FormData } from '../../../globalInterfaces';

//Check if the inputs are available and if yes prompt the user the confirmation pop up
//It will take formData typed with FormData and check if the requirements are met, then set the error message if they are not else set the state that
//confirms that the data is valid
const validateDetails = (
  formData: FormData | DocumentData,
  setErrorMsg: (value: string) => void,
  setConfirmSubmit: (value: boolean) => void
) => {
  if (formData.rooms.length < 1) {
    return setErrorMsg('Nu ai selectat nici o camera.');
  } else if (formData.entryDate >= formData.leaveDate) {
    return setErrorMsg('Data de intrare trebuie sa fie inaintea datei de iesire.');
  } else if (formData.entryDate === '') {
    return setErrorMsg('Nu ai selectat o data de intrare.');
  } else if (formData.leaveDate === '') {
    return setErrorMsg('Nu ai selectat nici o data de iesire.');
  } else if (formData.name.length < 3) {
    return setErrorMsg('Numele trebuie sa aiba cel putin 4 litere.');
  } else if (formData.phone.length < 9) {
    return setErrorMsg('Numarul trebuie sa aiba cel putin 10 cifre.');
  } else if (formData.adults === '') {
    return setErrorMsg('E nevoie de cel putin un adult pentru rezervare.');
  }
  setErrorMsg('');
  setConfirmSubmit(true);
};

export default validateDetails;
