import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
//Save new entry or update a existing one
const saveEntry = async (locationUserID: string, formData: DocumentData, customerID: number) => {
  if (customerID) {
    const docRef = doc(db, locationUserID, `${customerID}`);
    const data: DocumentData = {
      name: formData.name.toLowerCase(),
      entryDate: formData.entryDate,
      leaveDate: formData.leaveDate,
      phone: formData.phone,
      rooms: formData.rooms,
      adults: formData.adults,
      kids: formData.kids,
      total: formData.total,
      advance: formData.advance,
      discount: formData.discount,
      balance: formData.balance,
      prices: formData.prices
    };
    await setDoc(docRef, data, { merge: true });
  }
};

export default saveEntry;
