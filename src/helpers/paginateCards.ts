import { DocumentData, Query, collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase';

export default async function paginate(location: string, userId: string, lastDoc?: Query<DocumentData>) {
  const initialBatch = lastDoc ? lastDoc : query(collection(db, `${location}${userId}`), orderBy('entryDate'), limit(20));

  const documentSnap = await getDocs(initialBatch);

  documentSnap.docs.map((doc) => {
    console.log(doc);
  });

  const lastVisible = documentSnap.docs[documentSnap.docs.length - 1];

  const next = query(collection(db, `${location}${userId}`), orderBy('entryDate'), startAfter(lastVisible), limit(20));

  return next;
}
