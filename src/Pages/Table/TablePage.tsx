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
      <Table rooms={rooms} />

      {openForm === true ? <ReservationForm rooms={rooms} setOpenForm={setOpenForm} /> : ''}
      <button
        id="add-reservation"
        onClick={() => {
          openForm ? setOpenForm(false) : setOpenForm(true);
        }}
      >
        Intrare Noua
      </button>
    </div>
  );
};

export default TablePage;
