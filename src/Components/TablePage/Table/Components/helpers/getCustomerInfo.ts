import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';

const getCustomerInfo = async (
  location: string,
  userId: string,
  year: number,
  month: number,
  customerId: number,
  setData: (value: DocumentData | undefined) => void
) => {
  const docRef = doc(db, `${location}${userId}`, `${year}`, `${month}`, `${customerId}`);
  console.log(`${location}${userId}`, `${year}`, `${month}`, `${customerId}`);
  try {
    const docSnap = await getDoc(docRef);
    const locationRef = await getDoc(doc(db, `locations${userId}`, `${location}`));
    if (docSnap && locationRef) {
      //All the properties in data are strings except : advance, balance, discount and total which are numbers
      const roomsOccupied = locationRef.data();
      setData(docSnap.data());
      if (roomsOccupied)
        setData((prev: DocumentData) => {
          return { ...prev, rooms: roomsOccupied.rooms };
        });
    }
  } catch (err) {
    console.error(err);
  }
};

export default getCustomerInfo;
