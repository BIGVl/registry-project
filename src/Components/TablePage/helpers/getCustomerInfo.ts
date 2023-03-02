import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const getCustomerInfo = async (location: string, userId: string, customerId: number) => {
  const docRef = doc(db, `${location}${userId}`, `${customerId}`);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap) {
      const data = docSnap.data();
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

export default getCustomerInfo;
