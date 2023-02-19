import { useState } from 'react';
import ReservationForm from '../../Components/TablePage/ReservationForm/ReservationForm';
import Table from '../../Components/TablePage/Table/Table';
import './TablePage.css';

interface Props {
  rooms: number;
}

const TablePage = ({ rooms }: Props) => {
  const [openForm, setOpenForm] = useState<boolean>(false);

  return (
    <div id="table-page">
      <Table rooms={rooms} openForm={openForm} />
      {/* We pass openForm just to add it in the dependency array of the useEffect in calendar that makes requests for data, in order to avoid constant requests
    and also outdated calendar shown, we add it so everytime a new entry is made the useEffect will be run and data will pe up to date without the costly 
    infinitely query otherwise */}
      {openForm === true ? <ReservationForm rooms={rooms} setOpenForm={setOpenForm} /> : ''}
      <button
        id="add-reservation"
        onClick={() => {
          openForm ? setOpenForm(false) : setOpenForm(true);
          window.scrollTo(0, 0);
        }}
      >
        Intrare Noua
      </button>
    </div>
  );
};

export default TablePage;
