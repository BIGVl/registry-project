import { DocumentData } from 'firebase/firestore';
import { ChangeEvent, MouseEvent } from 'react';
import { FormData } from '../../../../../globalInterfaces';
import daysBetweenDates from '../../../../../helpers/daysBetweenDates';
import './Rooms.scss';
import { EditSection } from '../../UpdateDetails';
import ExitEditModeButton from '../ExitEditModeButton/ExitEditModeButton';

interface Props {
  rooms: number;
  customersRooms: number[];
  setCustomerData: (value: FormData | DocumentData) => void;
  entryDate: string;
  leaveDate: string;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function ({ rooms, customersRooms, setCustomerData, entryDate, leaveDate, editSection, setEditSection }: Props) {
  const roomsArr = Array.from({ length: Number(rooms) || 0 }, (_, i) => i + 1);
  const editMode = editSection === 'room';
  //Add and remove the rooms in the state and also recalculate the total when the rooms are removed
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCustomerData((prev: FormData | DocumentData) => {
        return { ...prev, [e.target.name]: [...prev[e.target.name], Number(e.target.value)] };
      });
    } else {
      customersRooms.forEach((room: number, i: number) => {
        if (room === Number(e.target.value)) {
          console.log(room, e.target.value);
          const rooms = customersRooms;
          rooms?.splice(i, 1);
          console.log(rooms);
          console.log(customersRooms);
          setCustomerData((prev: FormData | DocumentData) => {
            const newPrices = prev.prices;
            delete newPrices[room];
            return { ...prev, [e.target.name]: rooms, prices: newPrices };
          });
        }
      });
      const daysBetween = daysBetweenDates(entryDate, leaveDate);
      setCustomerData((prev: FormData | DocumentData) => {
        const newTotal = !isNaN(daysBetween)
          ? Object.values(prev.prices).reduce((accumulator: number, current) => accumulator + Number(current) * daysBetween, 0)
          : 0;
        return { ...prev, total: newTotal };
      });
    }
  };

  function enterEditMode(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setEditSection('room');
  }
  return editMode ? (
    <div className="update-rooms-container">
      Camere
      <div className="rooms">
        {roomsArr.map((room: number) => {
          return (
            <label key={`room${room}`}>
              {room}
              <input
                onChange={handleCheck}
                type="checkbox"
                value={room}
                name={`rooms`}
                className={`room`}
                checked={customersRooms.includes(room)}
              />
            </label>
          );
        })}
      </div>
      <ExitEditModeButton setEditSection={setEditSection} />
    </div>
  ) : (
    <button onClick={enterEditMode} className="display-rooms-wrapper">
      <div className="display-rooms">
        Camere
        <div className="rooms-container">
          {customersRooms.map((room: number) => {
            return <div className="room">{room}</div>;
          })}
        </div>
      </div>
    </button>
  );
}
