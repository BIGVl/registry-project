import './Table.css';
import Rooms from './Components/Rooms';
import Calendar from './Components/Calendar';

interface Props {
  rooms: number;
}

const Table = ({ rooms }: Props) => {
  return (
    <div className="table">
      <div className="rooms-container">
        <Rooms rows={rooms} />
      </div>
      <Calendar rows={rooms} />
    </div>
  );
};

export default Table;
