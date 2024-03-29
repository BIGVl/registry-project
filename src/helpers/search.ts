import {
  DocumentData,
  OrderByDirection,
  Query,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter
} from 'firebase/firestore';
import { db } from '../../firebase';
import { FormDataIded } from '../globalInterfaces';
import { Dispatch, SetStateAction } from 'react';

export default async function search(
  location: string,
  userId: string,
  searchName: string,
  setCustomers: Dispatch<SetStateAction<FormDataIded[]>>,
  sort: OrderByDirection,
  lastDoc?: Query<DocumentData>
) {
  const sanitizedSearchName: string = searchName ? searchName.replace(/\s/g, '') : '';
  const docArray: FormDataIded[] = [];

  const batchToFetch = lastDoc ? lastDoc : query(collection(db, `${location}${userId}`), orderBy('entryDate', sort), limit(20));
  const querySnap = await getDocs(batchToFetch);
  const lastVisible = querySnap.docs[querySnap.docs.length - 1];
  const next = query(
    collection(db, `${location}${userId}`),
    orderBy('entryDate', sort),
    startAfter(lastVisible ? lastVisible : ''),
    limit(20)
  );

  setCustomers([]);
  querySnap.forEach((doc) => {
    console.log(doc.data());
    const formData: FormDataIded = doc.data() as FormDataIded;
    formData.id = doc.id;
    const fieldValue = doc.data().name;
    const sanitizedFieldValue = fieldValue ? fieldValue.replace(/\s/g, '') : '';
    if (sanitizedFieldValue.includes(sanitizedSearchName)) docArray.push(formData);
  });
  setCustomers((prev: FormDataIded[]) => {
    return [...docArray];
  });

  return { next, docs: querySnap.docs };
}
