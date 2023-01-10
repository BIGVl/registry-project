import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { FormData } from '../ReservationForm';

const saveEntry = async (location: string, formData: FormData) => {
  const response = await getDoc(doc(db, location, 'numar-clienti'));
  const id = response.data();
  if (id) {
    const year = formData.entryDate.slice(0, 4).toLowerCase();
    let month = formData.entryDate.slice(5, 7);
    month.indexOf('0') === 0 ? (month = formData.entryDate.slice(6, 7)) : (month = formData.entryDate.slice(5, 7));
    const docRef = doc(db, location, year, month, `${id['numar-clienti']}`);
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
