import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
//Save new entry or update a existing one
const saveEntry = async (locationUserID: string, formData: DocumentData, customerID: number) => {
  if (customerID) {
    const docRef = doc(db, locationUserID, `${customerID}`);
    const data: DocumentData = formData;
    data.name = data.name.toLowerCase();
    await setDoc(docRef, data, { merge: true });
  }
};

export default saveEntry;
