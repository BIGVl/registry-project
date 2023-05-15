import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FormDataIded } from '../globalInterfaces';

export default async function searchCxByName(
  location: string,
  userId: string,
  searchName: string,
  setCustomers: (value: FormDataIded[]) => void
) {
  const docArray: FormDataIded[] = [];
  const q = query(collection(db, `${location}${userId}`), where('name', '==', searchName));
  const querySnap = await getDocs(q);
  setCustomers([]);
  querySnap.forEach((doc) => {
    const formData: FormDataIded = doc.data() as FormDataIded;
    formData.id = doc.id;
    docArray.push(formData);
  });
  setCustomers([...docArray]);
}
