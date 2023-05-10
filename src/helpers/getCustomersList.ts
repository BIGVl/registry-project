import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FormDataIded } from '../globalInterfaces';

export default function getCustomersList(
  location: string,
  user: string,
  year: number,
  setState: (value: FormDataIded[]) => void
) {
  console.log(`${location}${user}`);

  const data: FormDataIded[] = [];
  const q = query(
    collection(db, `${location}${user}`),
    where('entryDate', '>=', `${year}-01-01`),
    where('entryDate', '<=', `${year}-12-31`)
  );
  const unsubscribe = onSnapshot(q, (querySnap) => {
    querySnap.forEach((doc) => {
      const formData: FormDataIded = doc.data() as FormDataIded;
      formData.id = doc.id;
      data.push(formData);
    });
    setState(data);
  });

  return unsubscribe;
}