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
  const currentDate = new Date(entryDate);
  const leaveMonth = new Date(leaveDate);
  const occupiedMonths = getOccupiedMonths(currentDate, leaveMonth);
  console.log(occupiedMonths);

  occupiedMonths.forEach((year) => {
    year.months.forEach(async (month) => {
      const docRef = doc(db, `${location}${userID}${year.year}`, `${month}`);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      for (const room of rooms) {
        if (data) {
          const roomData = data[room];
          for (const occupiedDay in roomData) {
            if (roomData[occupiedDay].includes(customerId.toString())) {
              delete roomData[occupiedDay];
            }
          }
          data[room] = roomData;
        }
      }
      console.log(data);
      await setDoc(docRef, data);
    });
  });
}

function getOccupiedMonths(startDate: Date, endDate: Date) {
  const occupiedMonths = [];

  // Calculate the start and end years
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  // Iterate through each year from start to end
  for (let year = startYear; year <= endYear; year++) {
    const startMonth = year === startYear ? startDate.getMonth() : 0;
    const endMonth = year === endYear ? endDate.getMonth() : 11;

    const yearMonths = [];
    for (let month = startMonth; month <= endMonth; month++) {
      yearMonths.push(month + 1);
    }

    occupiedMonths.push({ year, months: yearMonths });
  }

  return occupiedMonths;
}
