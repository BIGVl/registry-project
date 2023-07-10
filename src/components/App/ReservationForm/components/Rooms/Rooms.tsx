import { ChangeEvent } from 'react';
import './Rooms.scss';

interface Props {
  roomsArray: number[];
  handleCheck: (value: ChangeEvent<HTMLInputElement>) => void;
}

const Rooms = ({ roomsArray, handleCheck }: Props) => {
  return (
    <div className="rooms-container">
      <div className="rooms-title">Camere </div>

      <fieldset className="rooms-fieldset">
        {roomsArray.map((room) => {
          return (
            <label key={`room${room}`} className="rooms-label">
              {room}

              <input onChange={handleCheck} type="checkbox" value={room} name={`rooms`} id={`rooms-${room}`} />
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

export default Rooms;
