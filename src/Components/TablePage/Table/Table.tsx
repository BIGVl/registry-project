import '../../../Pages/Table/TablePage.css';
import Rooms from './Components/Rooms';
import Calendar from './Components/Calendar';

interface Props {
  rooms: number;
  openForm: boolean;
}

const Table = ({ rooms, openForm }: Props) => {
  return (
    <div className="table">
      <div className="rooms-container">
        <Rooms rows={rooms} />
      </div>
      <Calendar openForm={openForm} rows={rooms} />
    </div>
  );
};

export default Table;
