import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const checknSaveRooms = async (
  rooms: number[],
  enterDate: string,
  leaveDate: string,
  location: string,
  userID: string,
  setErrorMsg: (value: string | ((prevState: string) => string)) => void,
  setSendSucceed: (value: boolean | ((prevState: boolean) => boolean)) => void,
  customerID: number
) => {
  type Years = {
    [year: string]: { [month: string]: number[] };
  };
  const avalableDates: Years = {};
  const unavalableDates: Years = {};
  const currentDate = new Date(enterDate);
  const dates: any = {};
  const endDate = new Date(leaveDate);
  const roomsToSave = rooms.length;
  let savedComplete = 0;
  let hasUnavailableDates: boolean = false;
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
  for (const room of rooms) {
    for (const year in dates) {
      if (!avalableDates[year]) avalableDates[year] = {};
      if (!unavalableDates[year]) unavalableDates[year] = {};
      for (const month in dates[year]) {
        const response = await getDoc(doc(db, `${location}${userID}${year}`, month));
        const data: DocumentData | undefined = response.data();

        dates[year][month].forEach((date: number) => {
          if (data && data[room] && data[room][date] && !data[room][date].includes(customerID)) {
            if (data[room][date].includes('full') || (data[room][date].includes('enter') && data[room][date].includes('exit'))) {
              unavalableDates[year][month] ? unavalableDates[year][month].push(date) : (unavalableDates[year][month] = [date]);
            }
          } else {
            avalableDates[year][month] ? avalableDates[year][month].push(date) : (avalableDates[year][month] = [date]);
          }
        });
      }
    }
  }
  console.log(unavalableDates);
  // check if any array in unavalableDates has dates
  for (const year in unavalableDates) {
    for (const month in unavalableDates[year]) {
      const dates = unavalableDates[year][month];
      if (Array.isArray(dates) && dates.length > 0) {
        hasUnavailableDates = true;
        break;
      }
    }
    if (hasUnavailableDates) {
      break;
    }
  }
  //In order to save the dates only after every room was checked to not be occupied on any date
  //we created this variable and removed one element at a time while looping through the rooms array
  for (const room of rooms) {
    for (const year in dates) {
      if (hasUnavailableDates) {
        Object.keys(unavalableDates[year]).forEach(async (month) => {
          await getDoc(doc(db, `${location}${userID}${year}`, month));
          return setErrorMsg(
            `Camera cu numarul ${room} este ocupata in perioada ${unavalableDates[year][month][0]}/${month}/${[year]} - ${
              unavalableDates[year][month][unavalableDates[year][month].length - 1]
            }/${month}/${year} .`
          );
        });
      } else {
        console.log('Start saving');
        setErrorMsg('');
        Object.keys(avalableDates[year]).map(async (month) => {
          const docRef = doc(db, `${location}${userID}${year}`, month);
          const response = await getDoc(docRef);
          const data = response.data();
          avalableDates[year][month].map(async (day: number) => {
            const startDate = new Date(enterDate);
            startDate.setHours(0, 0, 0, 0);
            const dateToCompareTo = new Date(Number(year), Number(month) - 1, day);
            dateToCompareTo.setHours(0, 0, 0, 0);
            const endingDate = new Date(leaveDate);
            endingDate.setHours(0, 0, 0, 0);
            if (startDate.getTime() === dateToCompareTo.getTime()) {
              if (data && data[room] && data[room][day] && data[room][day].slice(0, 4) === 'exit') {
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
              if (data && data[room] && data[room][day] && data[room][day].slice(0, 5) === 'enter') {
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
          });
          await setDoc(doc(db, `${location}${userID}`, 'numar-clienti'), {
            'numar-clienti': customerID
          });
          console.log('Inside');
        });
        savedComplete++;
        console.log(savedComplete, roomsToSave);
      }
    }
  }
  if (savedComplete >= roomsToSave) {
    setSendSucceed(true);
  }
};

export default checknSaveRooms;
