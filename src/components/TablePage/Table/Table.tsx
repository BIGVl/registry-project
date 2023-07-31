import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import './Table.scss';
import UpdateDetails from '../../shared/UpdateDetails/UpdateDetails';

interface PropTypes {
  rows: number;
  days: number;
  month: number;
  year: number;
  data: DocumentData;
}

const Table = ({ rows, days, month, year, data }: PropTypes) => {
  const daysArray: any[] = [];
  const cellsArray: any[] = [];
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [entryDetails, setEntryDetails] = useState({ year: year, month, customerId: 0 });
  //Fill in the days number in an array so it can be <p></p>opulated on the table
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  const WEEKDAYS: string[] = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'];
  const weekdayIndexes: number[] = [];
  //Loop through the days in our calendar and check what day of the week is each and assing the weekday to each one
  daysArray.forEach((day) => {
    weekdayIndexes.push(new Date(year, month - 1, day).getDay());
  });

  for (let room = 1; room <= rows; room++) {
    cellsArray.push(
      <tr key={room}>
        <th className="fixed">{room}</th>
        {daysArray.map((d) => {
          let occupancyDisplay;
          if (data[month] && data[month][room] && data[month][room][d]) {
            data[month][room];
            const customerId = parseInt(data[month][room][d].slice(data[month][room][d].indexOf('-') + 1));

            if (data[month][room][d].includes('enter') && data[month][room][d].includes('exit')) {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenDetails(true);
                  }}
                  className="show-container"
                >
                  <div className="exit-show"> </div>
                  <div className="enter-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 5) === 'enter') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenDetails(true);
                  }}
                  className="show-container-enter"
                >
                  <div className="enter-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 4) === 'exit') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenDetails(true);
                  }}
                  className="show-container"
                >
                  <div className="exit-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 4) === 'full') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenDetails(true);
                  }}
                  className="show-container"
                >
                  <div className="full-show"> {customerId} </div>
                </div>
              );
            }
          }
          return (
            <td key={room + '/' + d + '/' + month} className="data-cells">
              {occupancyDisplay}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th className="fixed"> Cam. </th>
            {daysArray.map((m, i) => {
              return (
                <th className="day-th" key={m}>
                  <div className="day ">
                    <div> {m} </div> <div> {WEEKDAYS[weekdayIndexes[i]].slice(0, 3)} </div>
                  </div>
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
      {openDetails && <UpdateDetails entryDetails={entryDetails} setOpenDetails={setOpenDetails} rooms={rows} />}
    </>
  );
};

export default Table;
