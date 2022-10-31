import { useContext, useEffect, useState } from 'react';
import months from '../../../assets/months';
import Month from './Month';
import '../Table.css';
import { ReactComponent as ArrowLeft } from '../../../assets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../../assets/arrow-right.svg';
import PropertyContext from '../../../Contexts/PopertyContext';
import { collection, doc, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import { db } from '../../../firebase';

interface PropTypes {
  rows: number;
}

const Calendar = ({ rows }: PropTypes) => {
  const [month, setMonth] = useState<number>(parseInt(new Date().toLocaleDateString().slice(0, 2)) + 11);
  let currentYear = parseInt(new Date().toLocaleDateString().slice(5, 9));
  if (isNaN(currentYear)) {
    currentYear = parseInt(new Date().toLocaleDateString().slice(6, 10));
    if (isNaN(currentYear)) {
      currentYear = parseInt(new Date().toLocaleDateString().slice(4, 8));
    }
  }
  const property = useContext(PropertyContext);
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState({});

  useEffect(() => {
    const q = query(collection(db, `${property}${year}`));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let i = 0;
      querySnapshot.forEach((doc) => {
        setData((prev) => {
          return { ...prev, [doc.id]: doc.data() };
        });
      });
    });
  }, [year]);

  //Check what year is the displaying month in
  useEffect(() => {
    if (month < 12) setYear(currentYear - 1);
    else if (month > 23) setYear(currentYear + 1);
    else {
      setYear(currentYear);
    }
  }, [month, currentYear]);
  //Change the month presented to one back or on ahead based on what arrow it's clicked
  const lastMonth = () => {
    if (month === 0) return;
    setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 35) return;
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
        if (i === month)
          return <Month year={year} month={month} key={i} rows={rows} days={days} monthName={monthName} data={data} />;
      })}
      <div id="year"> {year} </div>
    </div>
  );
};

export default Calendar;
