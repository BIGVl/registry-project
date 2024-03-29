import './TableContainer.scss';
import { useContext, useEffect, useState } from 'react';
import Table from '../Table/Table';
import { ReactComponent as ArrowLeft } from '../../../assets/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../../assets/arrow-right.svg';
import { LocationContext, UserIDContext } from '../../../Contexts';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface PropTypes {
  rows: number;
}

const TableContainer = ({ rows }: PropTypes) => {
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
  }, [userID, currentDate.getFullYear(), currentDate.getMonth()]);

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
    <>
      <div className="calendar-header">
        <div className="arrow-left">
          <ArrowLeft onClick={lastMonth} />
        </div>
        <div className="month-name">
          {currentDate.toLocaleDateString('ro-RO', { month: 'long' }).charAt(0).toUpperCase() +
            currentDate.toLocaleDateString('ro-RO', { month: 'long' }).slice(1)}
        </div>
        <div className="year"> {currentDate.getFullYear()} </div>
        <div className="arrow-right">
          <ArrowRight onClick={nextMonth} />
        </div>
      </div>

      <div className="table-container">
        <Table
          year={currentDate.getFullYear()}
          month={currentDate.getMonth() + 1}
          rows={rows}
          days={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}
          data={data}
        />
      </div>
    </>
  );
};

export default TableContainer;
