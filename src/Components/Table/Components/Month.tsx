import { useState } from 'react';
import '../Table.css';

interface PropTypes {
  rows: number;
  days: number;
  monthName: string;
  month: number;
  year: number;
  data: any;
}

const Month = ({ rows, days, monthName, month, year, data }: PropTypes) => {
  const daysArray: any[] = [];
  const cellsArray: any[] = [];
  const [monthNumber, setMonthNumber] = useState(month);

  if (monthNumber > 12 && monthNumber <= 23) setMonthNumber(monthNumber - 11);
  if (monthNumber > 23) setMonthNumber(monthNumber - 23);

  //Fill in the days number in an array so it can be populated on the table
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  const WEEKDAYS: string[] = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'];
  const weekdayIndexes: number[] = [];

  //Loop through the days in our calendar and check what day of the week is each and assing the weekday to each one

  daysArray.map((day) => {
    let thisMonth = month;
    if (thisMonth > 12 && thisMonth <= 23) {
      thisMonth = thisMonth - 11;
    } else if (thisMonth > 23) {
      thisMonth = thisMonth - 23;
    }
    weekdayIndexes.push(new Date(year, thisMonth - 1, day).getDay());
  });

  for (let i = 0; i < rows; i++) {
    cellsArray.push(
      <tr key={i + 1}>
        {daysArray.map((d) => {
          let occupancyDisplay;
          if ((data as any)[i + 1] && (data as any)[i + 1][monthNumber]) {
            if (
              (data as any)[i + 1][monthNumber][d] &&
              (data as any)[i + 1][monthNumber][d].includes('enter') &&
              (data as any)[i + 1][monthNumber][d].includes('exit')
            ) {
              occupancyDisplay = (
                <div id="show-container">
                  <div id="exit-show"></div>
                  <div id="enter-show"></div>
                </div>
              );
            } else if ((data as any)[i + 1][monthNumber][d] && (data as any)[i + 1][monthNumber][d].slice(0, 5) === 'enter') {
              occupancyDisplay = (
                <div id="show-container-enter">
                  <div id="enter-show"></div>
                </div>
              );
            } else if ((data as any)[i + 1][monthNumber][d] && (data as any)[i + 1][monthNumber][d].slice(0, 4) === 'exit') {
              occupancyDisplay = (
                <div id="show-container">
                  <div id="exit-show"></div>
                </div>
              );
            } else if ((data as any)[i + 1][monthNumber][d] && (data as any)[i + 1][monthNumber][d].slice(0, 4) === 'full') {
              occupancyDisplay = (
                <div id="show-container">
                  <div id="full-show"></div>
                </div>
              );
            }
          }
          return <td key={i + 1 + '/' + d + '/' + monthNumber}>{occupancyDisplay}</td>;
        })}
      </tr>
    );
  }

  return (
    <table id="calendar">
      <caption>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</caption>
      <thead>
        <tr>
          {daysArray.map((m, i) => {
            return (
              <th id="days" key={m}>
                {m} {WEEKDAYS[weekdayIndexes[i]].slice(0, 3)}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {cellsArray.map((row) => {
          return row;
        })}
      </tbody>
    </table>
  );
};

export default Month;
