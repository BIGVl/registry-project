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
  console.log(rooms);
  rooms.forEach((room) => {
    monthsArray.forEach(async (month) => {
      console.log(`${location}${userID}${dateOfEntry.getFullYear()}`, `${month}`);
      const firstYearOfReservationRef = await getDoc(doc(db, `${location}${userID}${dateOfEntry.getFullYear()}`, `${month}`));
      const secondYearOfReservationRef =
        dateOfEntry.getFullYear() !== dateOfLeave.getFullYear()
          ? await getDoc(doc(db, `${location}${userID}${dateOfLeave.getFullYear()}`, `${month}`))
          : null;
      const roomReservationsFirstYear = firstYearOfReservationRef.data();
      const roomReservationsSecondYear = secondYearOfReservationRef !== null ? secondYearOfReservationRef.data() : null;
      console.log(roomReservationsFirstYear);
      if (roomReservationsFirstYear) {
        Object.keys(roomReservationsFirstYear[room]).forEach((day) => {
          console.log(day);
          roomReservationsFirstYear[room][day].includes(`${customerId}`) && delete roomReservationsFirstYear[room][day];
        });

        console.log(roomReservationsFirstYear);
      }
      if (roomReservationsSecondYear) {
        monthsArray.forEach((month) => {
          Object.keys(roomReservationsSecondYear[room]).forEach((day) => {
            console.log(day);

            roomReservationsSecondYear[room][day].includes(`${customerId}`) && delete roomReservationsSecondYear[room][day];
          });
        });
      }
      await updateDoc(doc(db, `${location}${userID}${dateOfEntry.getFullYear()}`, `${month}`), roomReservationsFirstYear);
      roomReservationsSecondYear &&
        (await updateDoc(doc(db, `${location}${userID}${dateOfLeave.getFullYear()}`, `${month}`), roomReservationsSecondYear));
    });
  });
};

export default deleteDates;
