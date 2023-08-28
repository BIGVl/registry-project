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
  console.log('Rooms:', rooms);
  let currentDate = new Date(entryDate);
  let docSnap = await getDoc(doc(db, `${location}${userID}${currentDate.getFullYear()}`, `${currentDate.getMonth() + 1}`));
  let data = docSnap.data();
  console.log('First data:', data);
  for (const room of rooms) {
    const dateOfLeave = new Date(leaveDate);
    let previousMonth = new Date(entryDate);
    currentDate = new Date(entryDate);

    while (currentDate <= dateOfLeave) {
      if (currentDate.getMonth() !== previousMonth.getMonth()) {
        await setDoc(doc(db, `${location}${userID}${previousMonth.getFullYear()}`, `${previousMonth.getMonth() + 1}`), data);
        docSnap = await getDoc(doc(db, `${location}${userID}${currentDate.getFullYear()}`, `${currentDate.getMonth() + 1}`));
        data = docSnap.data();
        previousMonth.setFullYear(currentDate.getFullYear());
        previousMonth.setMonth(currentDate.getMonth());
      }
      if (data) {
        const day: string = data[room][currentDate.getDate()];
        if (day && day.includes(`${customerId}`)) {
          if (day.includes(`/`)) {
            day.indexOf(`${customerId}`) < day.indexOf('/')
              ? (data[room][currentDate.getDate()] = day.slice(0, day.indexOf('/')))
              : (data[room][currentDate.getDate()] = day.slice(day.indexOf('/') + 1));
          } else {
            delete data[room][currentDate.getDate()];
          }
        }
        console.log(room, day);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    await setDoc(doc(db, `${location}${userID}${currentDate.getFullYear()}`, `${currentDate.getMonth() + 1}`), data);
    console.log(data);
  }
}
