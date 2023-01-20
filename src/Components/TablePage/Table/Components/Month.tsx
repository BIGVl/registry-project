import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import '../Table.css';
import UpdateDetails from './UpdateDetails';
import { ReactComponent as Cancel } from '../../../../assets/cancel.svg';
import deleteDates from '../../helpers/deleteDates';
import DeleteModal from './DeleteModal';

interface PropTypes {
  rows: number;
  days: number;
  monthName: string;
  month: number;
  year: number;
  data: DocumentData;
}

const Month = ({ rows, days, monthName, month, year, data }: PropTypes) => {
  const daysArray: any[] = [];
  const cellsArray: any[] = [];
  const [monthNumber, setMonthNumber] = useState(month);
  const [openUpdateDelete, setOpenUpdateDelete] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [entryDetails, setEntryDetails] = useState({ year: year, month: month, customerId: 0 });
  if (monthNumber > 12 && monthNumber <= 24) setMonthNumber(monthNumber - 12);
  if (monthNumber > 24) setMonthNumber(monthNumber - 24);

  //Fill in the days number in an array so it can be populated on the table
  for (let i = 1; i <= days; i++) {
    daysArray.push(i);
  }

  const WEEKDAYS: string[] = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'];
  const weekdayIndexes: number[] = [];

  //Loop through the days in our calendar and check what day of the week is each and assing the weekday to each one
  daysArray.forEach((day) => {
    // let thisMonth = month;
    // if (thisMonth > 12 && thisMonth <= 24) {
    //   thisMonth = thisMonth - 12;
    // } else if (thisMonth > 24) {
    //   thisMonth = thisMonth - 24;
    // }
    weekdayIndexes.push(new Date(year, monthNumber - 1, day).getDay());
  });
  for (let i = 1; i <= rows; i++) {
    cellsArray.push(
      <tr key={i}>
        {daysArray.map((d) => {
          let occupancyDisplay;
          if (data[i] && data[i][monthNumber] && data[i][monthNumber][d]) {
            const customerId = parseInt(data[i][monthNumber][d].slice(data[i][monthNumber][d].indexOf('-') + 1));

            if (data[i][monthNumber][d].includes('enter') && data[i][monthNumber][d].includes('exit')) {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month: monthNumber, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="exit-show"> </div>
                  <div id="enter-show"></div>
                </div>
              );
            } else if (data[i][monthNumber][d] && data[i][monthNumber][d].slice(0, 5) === 'enter') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month: monthNumber, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container-enter"
                >
                  <div id="enter-show"></div>
                </div>
              );
            } else if (data[i][monthNumber][d] && data[i][monthNumber][d].slice(0, 4) === 'exit') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month: monthNumber, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="exit-show"></div>
                </div>
              );
            } else if (data[i][monthNumber][d] && data[i][monthNumber][d].slice(0, 4) === 'full') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month: monthNumber, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="full-show"> {customerId} </div>
                </div>
              );
            }
          }
          return <td key={i + '/' + d + '/' + monthNumber}>{occupancyDisplay}</td>;
        })}
      </tr>
    );
  }

  return (
    <>
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
      {openUpdateDelete && (
        <div className="bubble-update-delete">
          <Cancel
            onClick={() => {
              setOpenUpdateDelete(false);
            }}
          />
          <div className="buttons">
            <button
              className="open-update"
              onClick={() => {
                setOpenDetails(true);
                setOpenUpdateDelete(false);
              }}
            >
              Detalii
            </button>
            <button
              className="open-delete"
              onClick={() => {
                setOpenDelete(true);
                setOpenUpdateDelete(false);
              }}
            >
              Sterge
            </button>
          </div>
        </div>
      )}
      {openDelete && <DeleteModal entryDetails={entryDetails} setOpenDelete={setOpenDelete} />}
      {openDetails && <UpdateDetails entryDetails={entryDetails} setOpenDetails={setOpenDetails} />}
    </>
  );
};

export default Month;
