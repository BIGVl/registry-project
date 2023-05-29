import '../../../Pages/Table/TablePage.scss';
import Rooms from './Components/Rooms';
import Calendar from './Components/Calendar';

interface Props {
  rooms: number;
  openForm: boolean;
}

const Table = ({ rooms, openForm }: Props) => {
  return (
    <div className="table-container">
      <Rooms rows={rooms} />
      <Calendar openForm={openForm} rows={rooms} />
    </div>
  );
};

export default Table;
