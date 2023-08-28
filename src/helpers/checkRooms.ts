import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const checkRooms = async (
  rooms: number[],
  enterDate: string,
  leaveDate: string,
  location: string,
  userID: string,
  setErrorMsg: (value: string | ((prevState: string) => string)) => void,
  customerID: number
) => {
  type Years = {
    [year: string]: { [month: string]: number[] };
  };
  setErrorMsg('');
  const unavailableDates: Years = {};
  const currentDate = new Date(enterDate);
  const dates: any = {};
  const endDate = new Date(leaveDate);
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
      if (!unavailableDates[year]) unavailableDates[year] = {};
      for (const month in dates[year]) {
        const response = await getDoc(doc(db, `${location}${userID}${year}`, month));
        const data: DocumentData | undefined = response.data();

        dates[year][month].forEach((date: number) => {
          if (data && data[room] && data[room][date] && !data[room][date].includes(customerID)) {
            if (data[room][date].includes('full') || (data[room][date].includes('enter') && data[room][date].includes('exit'))) {
              unavailableDates[year][month] ? unavailableDates[year][month].push(date) : (unavailableDates[year][month] = [date]);
            }
            if (data[room][date].includes('enter') && data[room][date + 1].includes('exit')) {
              unavailableDates[year][month]
                ? unavailableDates[year][month].push(date, date + 1)
                : (unavailableDates[year][month] = [date, date + 1]);
            }
          }
        });
      }
    }
  }
  // check if any array in unavailableDates has dates
  for (const year in unavailableDates) {
    for (const month in unavailableDates[year]) {
      const unavailable = unavailableDates[year][month];
      if (Array.isArray(unavailable) && unavailable.length > 0) {
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
        for (const month in unavailableDates[year]) {
          await getDoc(doc(db, `${location}${userID}${year}`, month));
          return setErrorMsg(
            `Camera cu numarul ${room} este ocupata in perioada ${unavailableDates[year][month][0]}/${month}/${[year]} - ${
              unavailableDates[year][month][unavailableDates[year][month].length - 1]
            }/${month}/${year} .`
          );
        }
      }
    }
  }
  return !hasUnavailableDates;
};
export default checkRooms;
