import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

//This deletes the entry from the calendar it does not affect the document of the customer
export default async function deleteDates(
  location: string,
  userID: string,
  entryDate: string,
  leaveDate: string,
  rooms: string[],
  customerId: number
) {
  console.log(customerId);
  const currentDate = new Date(entryDate);
  const docRef = doc(db, `${location}${userID}${currentDate.getFullYear()}`, `${currentDate.getMonth() + 1}`);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  for (const room of rooms) {
    if (data) {
      const roomData = data[room];
      for (const occupiedDay in roomData) {
        if (roomData[occupiedDay].includes(customerId.toString())) {
          console.log(roomData[occupiedDay]);
        }
      }
    }
  }
}
