import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FormData } from '../../../interfaces';

const getCustomerInfo = async (
  location: string,
  userId: string,
  year: number,
  month: number,
  customerId: number,
  setCustomerData: (value: FormData | DocumentData) => void,
  setLocationData?: (value: DocumentData) => void,
  setInitialCustomerData?: (value: FormData | DocumentData) => void
) => {
  const docRef = doc(db, `${location}${userId}`, `${year}`, `${month}`, `${customerId}`);
  try {
    const docSnap = await getDoc(docRef);
    const locationRef = await getDoc(doc(db, `locations${userId}`, `${location}`));
    if (docSnap && locationRef) {
      //All the properties in data are strings except : advance, balance, discount and total which are numbers
      const data = docSnap.data();
      const locationData = locationRef.data();
      data && setCustomerData(data);
      data && setInitialCustomerData && setInitialCustomerData(data);
      locationData && setLocationData && setLocationData(locationData);
    }
  } catch (err) {
    console.error(err);
  }
};

export default getCustomerInfo;
