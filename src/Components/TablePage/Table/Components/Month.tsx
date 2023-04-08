import { DocumentData } from 'firebase/firestore';
import { useState } from 'react';
import '../../../../Pages/Table/TablePage.scss';
import UpdateDetails from './UpdateDetails';
import DeleteModal from './DeleteModal';
import DetailsModal from './DetailsModal';

interface PropTypes {
  rows: number;
  days: number;
  month: number;
  year: number;
  data: DocumentData;
}

const Month = ({ rows, days, month, year, data }: PropTypes) => {
  const daysArray: any[] = [];
  const cellsArray: any[] = [];
  const [openUpdateDelete, setOpenUpdateDelete] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [entryDetails, setEntryDetails] = useState({ year: year, month, customerId: 0 });
  //Fill in the days number in an array so it can be populated on the table
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
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="exit-show"> </div>
                  <div id="enter-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 5) === 'enter') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container-enter"
                >
                  <div id="enter-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 4) === 'exit') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="exit-show"></div>
                </div>
              );
            } else if (data[month][room][d] && data[month][room][d].slice(0, 4) === 'full') {
              occupancyDisplay = (
                <div
                  onClick={() => {
                    setEntryDetails({ year, month, customerId });
                    setOpenUpdateDelete(!openUpdateDelete);
                  }}
                  id="show-container"
                >
                  <div id="full-show"> {customerId} </div>
                </div>
              );
            }
          }
          return <td key={room + '/' + d + '/' + month}>{occupancyDisplay}</td>;
        })}
      </tr>
    );
  }

  return (
    <>
      <table id="calendar">
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
        <DetailsModal setOpenDetails={setOpenDetails} setOpenUpdateDelete={setOpenUpdateDelete} setOpenDelete={setOpenDelete} />
      )}
      {openDelete && <DeleteModal entryDetails={entryDetails} setOpenDelete={setOpenDelete} />}
      {openDetails && <UpdateDetails entryDetails={entryDetails} setOpenDetails={setOpenDetails} rooms={rows} />}
    </>
  );
};

export default Month;
