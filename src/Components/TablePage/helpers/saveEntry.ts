import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FormData } from '../../../interfaces';
//Save new entry or update a existing one
const saveEntry = async (locationUserID: string, formData: FormData | DocumentData, customerID: number) => {
  if (customerID) {
    const year = formData.entryDate.slice(0, 4).toLowerCase();
    let month = formData.entryDate.slice(5, 7);
    month.indexOf('0') === 0 ? (month = formData.entryDate.slice(6, 7)) : (month = formData.entryDate.slice(5, 7));
    const docRef = doc(db, locationUserID, year, month, `${customerID}`);
    const data: FormData = {
      name: formData.name,
      entryDate: formData.entryDate,
      leaveDate: formData.leaveDate,
      phone: formData.phone,
      rooms: formData.rooms,
      adults: formData.adults,
      kids: formData.kids,
      total: formData.total,
      advance: formData.advance,
      discount: formData.discount,
      balance: formData.balance
    };
    await setDoc(docRef, data, { merge: true });
  }
};

export default saveEntry;
