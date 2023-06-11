import { OrderByDirection, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { FormDataIded } from '../globalInterfaces';

export default async function search(
  location: string,
  userId: string,
  searchName: string,
  setCustomers: (value: FormDataIded[]) => void,
  sort: OrderByDirection
) {
  const sanitizedSearchName: string = searchName ? searchName.replace(/\s/g, '') : '';
  const docArray: FormDataIded[] = [];
  const q = query(collection(db, `${location}${userId}`), orderBy('entryDate', sort), limit(20));
  const querySnap = await getDocs(q);
  setCustomers([]);
  querySnap.forEach((doc) => {
    const formData: FormDataIded = doc.data() as FormDataIded;
    formData.id = doc.id;
    const fieldValue = doc.data().name;
    const sanitizedFieldValue = fieldValue ? fieldValue.replace(/\s/g, '') : '';
    if (sanitizedFieldValue.includes(sanitizedSearchName)) docArray.push(formData);
  });
  setCustomers([...docArray]);
}
