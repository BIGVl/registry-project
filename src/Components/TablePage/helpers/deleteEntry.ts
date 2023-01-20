import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

const deleteEntry = async (locationUserID: string, year: string, month: string, customerID: string) => {
  const docRef = doc(db, locationUserID, year, month, customerID);
  await deleteDoc(docRef);
};

export default deleteEntry;
