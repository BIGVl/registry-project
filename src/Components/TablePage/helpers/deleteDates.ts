import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

//This deletes the entry from the calendar it does not affect the document of the customer
const deleteDates = async (
  location: string,
  userID: string,
  entryDate: string,
  leaveDate: string,
  rooms: string[],
  customerId: number
) => {
  const dateOfEntry = new Date(entryDate);
  const dateOfLeave = new Date(leaveDate);

  const startMonth = dateOfEntry.getMonth() + 1;
  const endMonth = dateOfLeave.getMonth() + 1;
  let currentMonth = startMonth;
  const monthsArray: number[] = [];
  while (currentMonth <= endMonth) {
    monthsArray.push(currentMonth);
    currentMonth++;
  }
  console.log(customerId);

  rooms.forEach(async (room) => {
    const firstYearOfReservationRef = await getDoc(doc(db, `${location}${userID}${dateOfEntry.getFullYear()}`, room));
    const secondYearOfReservationRef =
      dateOfEntry.getFullYear() !== dateOfLeave.getFullYear()
        ? await getDoc(doc(db, `${location}${userID}${dateOfLeave.getFullYear()}`, room))
        : null;
    const roomReservationsFirstYear = firstYearOfReservationRef.data();
    const roomReservationsSecondYear = secondYearOfReservationRef !== null ? secondYearOfReservationRef.data() : null;
    if (roomReservationsFirstYear) {
      monthsArray.forEach((month) => {
        Object.keys(roomReservationsFirstYear[month]).forEach((day) => {
          console.log(day);
          roomReservationsFirstYear[month][day].includes(`${customerId}`) && delete roomReservationsFirstYear[month][day];
        });
      });
      console.log(roomReservationsFirstYear);
    }
    if (roomReservationsSecondYear) {
      monthsArray.forEach((month) => {
        Object.keys(roomReservationsSecondYear[month]).forEach((day) => {
          console.log(day);

          roomReservationsSecondYear[month][day].includes(`${customerId}`) && delete roomReservationsSecondYear[month][day];
        });
      });
    }
    await updateDoc(doc(db, `${location}${userID}${dateOfEntry.getFullYear()}`, room), roomReservationsFirstYear);
    roomReservationsSecondYear &&
      (await updateDoc(doc(db, `${location}${userID}${dateOfLeave.getFullYear()}`, room), roomReservationsSecondYear));
  });
};

export default deleteDates;
