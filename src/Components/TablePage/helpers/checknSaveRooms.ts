import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const checknSaveRooms = async (
  rooms: any,
  enterDate: string,
  leaveDate: string,
  location: string,
  userID: string,
  setErrorMsg: (value: string | ((prevState: string) => string)) => void,
  setSendSucceed: (value: boolean | ((prevState: boolean) => boolean)) => void,
  customerID: number
) => {
  const availables: any = { 2022: {}, 2023: {}, 2024: {}, 2025: {}, 2026: {} };
  const unavailables: any = { 2022: {}, 2023: {}, 2024: {}, 2025: {}, 2026: {} };
  const startDate = new Date(enterDate);
  const currentDate = new Date(enterDate);
  const dates: any = {};
  const endDate = new Date(leaveDate);

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

  //Check if the last date is in the dates object, we do this because of a weird behavior when we deal with a reservation that includes 31st of October
  //the endDate which represent the last day would not be in the dates object
  if (!dates[endDate.getFullYear()][endDate.getMonth() + 1]) {
    dates[endDate.getFullYear()][endDate.getMonth() + 1] = [endDate.getDate()];
  } else if (!dates[endDate.getFullYear()][endDate.getMonth() + 1][endDate.getDate()]) {
    dates[endDate.getFullYear()][endDate.getMonth() + 1] = [
      ...dates[endDate.getFullYear()][endDate.getMonth() + 1],
      endDate.getDate()
    ];
  }

  //Check for each room the availability on choosen dates with the db and then give the proper feedback
  rooms?.map(async (room: string) => {
    //Loop through eachs day and save each one in the proper array based if it's found in the db as being occupied or not
    Object.keys(dates).map(async (year) => {
      const response = await getDoc(doc(db, `${location}${year}`, room));
      let data: any = response.data();
      Object.keys(dates[year]).forEach((month) => {
        dates[year][month].forEach((date: number, i: number) => {
          if (
            (data && data[month] && data[month][date] !== undefined && data[month][date].slice(0, 4) === 'full') ||
            (data &&
              data[month] &&
              data[month][date] &&
              data[month][date].includes('enter') &&
              data[month][date].includes('exit')) ||
            (data &&
              data[month] &&
              data[startDate.getMonth() + 1][startDate.getDate()] &&
              data[startDate.getMonth() + 1][startDate.getDate()].slice(0, 5) === 'enter')
          ) {
            unavailables[year][month] ? unavailables[year][month].push(date) : (unavailables[year][month] = [date]);
          } else {
            availables[year][month] ? availables[year][month].push(date) : (availables[year][month] = [date]);
          }
        });
      });
    });

    //These will be used in order to compare the enter/exit booking dates with the db, we are not directly comparing the dates as the format
    //requires, for example in formdata september would look like 09 but in db will be 9 so we will parse them fro the proper format
    const enterYear = parseInt(enterDate.slice(0, 4));
    const enterMonth = parseInt(enterDate.slice(5, 7));
    const enterDay = parseInt(enterDate.slice(8, enterDate.length));

    const exitYear = parseInt(leaveDate.slice(0, 4));
    const exitMonth = parseInt(leaveDate.slice(5, 7));
    const exitDay = parseInt(leaveDate.slice(8, leaveDate.length));

    //Loop through each month in each year in the unavailables array to check if any dates choosen for the rooms are occupied
    Object.keys(unavailables).map(async (year) => {
      //We await on getDoc just so this will get to the end on the stack flow in order to run after the codeblock above so the arrays
      // will be modified by the above mentioned block by the time this block runs as this depends on those arrays to be updated with the db
      await getDoc(doc(db, `${location}${year}`, room));
      const isOccupied = Object.keys(unavailables).find((year) => {
        return Object.keys(unavailables[year]).length > 0;
      });

      if (isOccupied) {
        Object.keys(unavailables[year]).forEach((month) => {
          setErrorMsg(
            `Camera cu numarul ${room} este ocupata in perioada ${unavailables[year][month][0]}/${month}/${[year]} - ${
              unavailables[year][month][unavailables[year][month].length - 1]
            }/${month}/${year} .`
          );
        });
      } else {
        setErrorMsg('');
        Object.keys(availables[year]).map(async (month) => {
          const docRef = doc(db, `${location}${userID}${year}`, room);
          const response = await getDoc(docRef);
          const data = response.data();
          availables[year][month].map(async (day: number) => {
            if (`${enterYear}-${enterMonth}-${enterDay}` === `${year}-${month}-${day}`) {
              if (data && data[month] && data[month][day] && data[month][day].slice(0, 4) === 'exit') {
                await setDoc(
                  docRef,
                  {
                    [month]: { [day]: `enter-${customerID}/${data[month][day]}` }
                  },
                  { merge: true }
                );
              } else {
                await setDoc(
                  docRef,
                  {
                    [month]: { [day]: `enter-${customerID}` }
                  },
                  { merge: true }
                );
              }
            } else if (`${exitYear}-${exitMonth}-${exitDay}` === `${year}-${month}-${day}`) {
              if (data && data[month] && data[month][day] && data[month][day].slice(0, 5) === 'enter') {
                await setDoc(
                  docRef,
                  {
                    [month]: { [day]: `${data[month][day]}/exit-${customerID}` }
                  },
                  { merge: true }
                );
              } else {
                await setDoc(
                  docRef,
                  {
                    [month]: { [day]: `exit-${customerID}` }
                  },
                  { merge: true }
                );
              }
            } else {
              await setDoc(
                docRef,
                {
                  [month]: { [day]: `full-${customerID}` }
                },
                { merge: true }
              );
            }
          });
          await setDoc(doc(db, `${location}${userID}`, 'numar-clienti'), {
            'numar-clienti': customerID
          });
          setSendSucceed(true);
        });
      }
    });
  });
};

export default checknSaveRooms;
