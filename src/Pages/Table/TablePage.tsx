import { useContext, useState } from 'react';
import ReservationForm from '../../components/App/ReservationForm/ReservationForm';
import './TablePage.scss';
import { LocationContext } from '../../Contexts';
import addImg from '../../assets/add.png';
import Rooms from '../../components/TablePage/Rooms';
import Calendar from '../../components/TablePage/Calendar';

interface Props {
  rooms: number;
}

const TablePage = ({ rooms }: Props) => {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const locationName = useContext(LocationContext);

  return (
    <div id="table-page">
      <h1 className="table-title">{locationName}</h1>
      {/* We pass openForm just to add it in the dependency array of the useEffect in calendar that makes requests for data, in order to avoid constant requests
    and also outdated calendar shown, we add it so everytime a new entry is made the useEffect will be run and data will pe up to date without the costly 
    infinitely query otherwise */}
      <div className="table-container">
        <Rooms rows={rooms} />
        <Calendar openForm={openForm} rows={rooms} />
      </div>
      {openForm === true ? <ReservationForm rooms={rooms} setOpenForm={setOpenForm} /> : ''}
      <button
        className="add-reservation"
        aria-label="Adauga intrare"
        onClick={() => {
          openForm ? setOpenForm(false) : setOpenForm(true);
          window.scrollTo(0, 0);
        }}
      >
        <img src={addImg} alt="" />
      </button>
    </div>
  );
};

export default TablePage;
