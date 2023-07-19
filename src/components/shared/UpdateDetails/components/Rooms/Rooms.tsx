import { DocumentData } from 'firebase/firestore';
import { ChangeEvent } from 'react';
import { FormData } from '../../../../../globalInterfaces';
import daysBetweenDates from '../../../../../helpers/daysBetweenDates';
import './Rooms.scss';
import { EditSection } from '../../UpdateDetails';

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
          const rooms = customersRooms;
          setCustomerData((prev: FormData | DocumentData) => {
            const newPrices = prev.prices;
            delete newPrices[room];
            rooms?.splice(i, 1);
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
    </div>
  ) : (
    <button className="change-rooms-button">Schimba camerele</button>
  );
}
