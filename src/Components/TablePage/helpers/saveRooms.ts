import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const saveRooms = async (
  rooms: number[],
  enterDate: string,
  leaveDate: string,
  location: string,
  userID: string,
  customerID: number
) => {
  type Years = {
    [year: string]: { [month: string]: number[] };
  };
  const avalableDates: Years = {};
  const currentDate = new Date(enterDate);
  const dates: any = {};
  const endDate = new Date(leaveDate);
  const roomsToSave = rooms.length;
  //Loop through all days between the enter day and the leave day and store them in an array to later be checked if they are available
  while (currentDate <= endDate) {
    /*This saves the dates  in a format like this dates = {2022:{11:[1,2,3], 12:[1,2,3,4]}}, in order to be later compared 
        with the db to check the availability of the rooms */
    if (dates[currentDate.getFullYear()]) {
      if (dates[currentDate.getFullYear()][currentDate.getMonth() + 1]) {
        dates[currentDate.getFullYear()][currentDate.getMonth() + 1] = [
          ...dates[currentDate.getFullYear()][currentDate.getMonth() + 1],
          currentDate.getDate()
        ];
      } else {
        dates[currentDate.getFullYear()][currentDate.getMonth() + 1] = [currentDate.getDate()];
      }
    } else {
      dates[currentDate.getFullYear()] = { [currentDate.getMonth() + 1]: [currentDate.getDate()] };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  //Loop through eachs day and save each one in the proper array based if it's found in the db as being occupied or not

  for (const year in dates) {
    if (!avalableDates[year]) avalableDates[year] = {};
    for (const month in dates[year]) {
      dates[year][month].forEach((date: number) => {
        avalableDates[year][month] ? avalableDates[year][month].push(date) : (avalableDates[year][month] = [date]);
      });
    }
  }

  const startDate = new Date(enterDate);
  startDate.setHours(0, 0, 0, 0);
  const endingDate = new Date(leaveDate);
  endingDate.setHours(0, 0, 0, 0);

  //In order to save the dates only after every room was checked to not be occupied on any date
  //we created this variable and removed one element at a time while looping through the rooms array
  for (const room of rooms) {
    for (const year in dates) {
      for (const month in avalableDates[year]) {
        const docRef = doc(db, `${location}${userID}${year}`, month);
        const response = await getDoc(docRef);
        const data = response.data();
        for (const day of avalableDates[year][month]) {
          const dateToCompareTo = new Date(Number(year), Number(month) - 1, Number(day));
          dateToCompareTo.setHours(0, 0, 0, 0);
          if (startDate.getTime() === dateToCompareTo.getTime()) {
            if (data && data[room] && data[room][day] && data[room][day].includes('exit')) {
              await setDoc(
                docRef,
                {
                  [room]: { [day]: `enter-${customerID}/${data[room][day]}` }
                },
                { merge: true }
              );
            } else {
              await setDoc(
                docRef,
                {
                  [room]: { [day]: `enter-${customerID}` }
                },
                { merge: true }
              );
            }
          } else if (endingDate.getTime() === dateToCompareTo.getTime()) {
            if (data && data[room] && data[room][day] && data[room][day].includes('enter')) {
              await setDoc(
                docRef,
                {
                  [room]: { [day]: `${data[room][day]}/exit-${customerID}` }
                },
                { merge: true }
              );
            } else {
              await setDoc(
                docRef,
                {
                  [room]: { [day]: `exit-${customerID}` }
                },
                { merge: true }
              );
            }
          } else {
            await setDoc(
              docRef,
              {
                [room]: { [day]: `full-${customerID}` }
              },
              { merge: true }
            );
          }
        }
        await setDoc(doc(db, `${location}${userID}`, 'numar-clienti'), {
          'numar-clienti': customerID
        });
      }
    }
  }
};

export default saveRooms;
