import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FormData } from './ReservationForm';

const saveEntry = async (property: string, formData: FormData) => {
  const response = await getDoc(doc(db, property, 'numar-clienti'));
  const id = response.data();
  if (id) {
    const year = formData.entryDate.slice(0, 4);
    const month = formData.entryDate.slice(5, 7);
    const docRef = doc(db, property, year, month, `${id['numar-clienti']}`);
    const data: FormData = {
      name: formData.name,
      entryDate: formData.entryDate,
      leaveDate: formData.leaveDate,
      phone: formData.phone,
      rooms: formData.rooms,
      adults: formData.adults,
      kids: formData.kids,
      total: formData.total,
      advance: formData.advance,
      discount: formData.discount,
      balance: formData.balance
    };
    await setDoc(docRef, data);
  }
};

export default saveEntry;
