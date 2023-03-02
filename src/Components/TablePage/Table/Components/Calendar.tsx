import { useContext, useEffect, useState } from 'react';
import Month from './Month';
import '../../../../Pages/Table/TablePage.css';
import { ReactComponent as ArrowLeft } from '../../../../assets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../../../assets/arrow-right.svg';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface PropTypes {
  rows: number;
  openForm: boolean;
}

const Calendar = ({ rows, openForm }: PropTypes) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const location = useContext(LocationContext);
  const userID = useContext(UserIDContext);
  const [data, setData] = useState({});

  //Check what year is the displaying month in

  useEffect(() => {
    setData({});
    const unsubscribe = onSnapshot(
      doc(db, `${location}${userID}${currentDate.getFullYear()}`, `${currentDate.getMonth() + 1}`),
      (doc) => {
        setData((prev) => {
          return { ...prev, [doc.id]: doc.data() };
        });
      }
    );
    return () => unsubscribe();
  }, [userID, openForm, currentDate.getFullYear(), currentDate.getMonth()]);

  //Change the month presented to one back or on ahead based on what arrow it's clicked
  const lastMonth = () => {
    setCurrentDate((prev: any) => {
      return new Date(prev.setMonth(prev.getMonth() - 1));
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev: any) => {
      return new Date(prev.setMonth(prev.getMonth() + 1));
    });
  };

  return (
    <div className="calendar-container">
      <div id="arrow-left">
        <ArrowLeft onClick={lastMonth} />
      </div>
      <div id="arrow-right">
        <ArrowRight onClick={nextMonth} />
      </div>

      <Month
        year={currentDate.getFullYear()}
        month={currentDate.getMonth() + 1}
        rows={rows}
        days={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}
        monthName={currentDate.toLocaleDateString('ro-RO', { month: 'long' })}
        data={data}
      />
      <div id="year"> {currentDate.getFullYear()} </div>
    </div>
  );
};

export default Calendar;
