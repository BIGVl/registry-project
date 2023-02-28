import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const getCustomerInfo = async (location: string, userId: string, year: number, month: number, customerId: number) => {
  const docRef = doc(db, `${location}${userId}`, `${year}`, `${month}`, `${customerId}`);
  console.log(`${location}${userId}`, `${year}`, `${month}`, `${customerId}`);
  try {
    const docSnap = await getDoc(docRef);
    const locationRef = await getDoc(doc(db, `locations${userId}`, `${location}`));
    if (docSnap && locationRef) {
      //All the properties in data are strings except : advance, balance, discount and total which are numbers
      const data = docSnap.data();
      const locationData = locationRef.data();
      return { data, locationData };
    }
  } catch (err) {
    console.error(err);
  }
};

export default getCustomerInfo;
