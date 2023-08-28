import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const deleteEntry = async (locationUserID: string, customerID: string) => {
  const docRef = doc(db, locationUserID, customerID);
  await deleteDoc(docRef);
};

export default deleteEntry;
