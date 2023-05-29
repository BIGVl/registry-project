import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { FormDataIded } from '../globalInterfaces';

export default async function searchCxByName(
  location: string,
  userId: string,
  searchName: string,
  setCustomers: (value: FormDataIded[]) => void
) {
  const sanitizedSearchName: string = searchName ? searchName.replace(/\s/g, '') : '';
  const docArray: FormDataIded[] = [];
  const q = query(collection(db, `${location}${userId}`));
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
