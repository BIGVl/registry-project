import { useContext, useEffect, useState } from 'react';
import months from '../../../../assets/months';
import Month from './Month';
import '../../../../Pages/Table/TablePage.css';
import { ReactComponent as ArrowLeft } from '../../../../assets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/arrow-right.svg';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface PropTypes {
  rows: number;
  openForm: boolean;
}

const Calendar = ({ rows, openForm }: PropTypes) => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  let currentYear = new Date().getFullYear();
  const location = useContext(LocationContext);
  const userID = useContext(UserIDContext);
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState({});

  //Check what year is the displaying month in

  useEffect(() => {
    setData({});
    if (month < 13) setYear(currentYear - 1);
    else if (month > 24) setYear(currentYear + 1);
    else {
      setYear(currentYear);
    }
    const q = query(collection(db, `${location}${userID}${year}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setData((prev) => {
          return { ...prev, [doc.id]: doc.data() };
        });
      });
    });
    return () => unsubscribe();
  }, [month, userID, openForm, year]);

  //Change the month presented to one back or on ahead based on what arrow it's clicked
  const lastMonth = () => {
    if (month === 1) return;
    setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 36) return;
    setMonth(month + 1);
  };

  return (
    <div className="calendar-container">
      <div id="arrow-left">
        <ArrowLeft onClick={lastMonth} />
      </div>
      <div id="arrow-right">
        <ArrowRight onClick={nextMonth} />
      </div>
      {Object.keys(months).map((m, i) => {
        const days = months[m as keyof typeof months];
        const monthName = m.replace(/[1-9]/g, '');
        if (i + 1 === month)
          return <Month year={year} month={month} key={i} rows={rows} days={days} monthName={monthName} data={data} />;
      })}
      <div id="year"> {year} </div>
    </div>
  );
};

export default Calendar;
