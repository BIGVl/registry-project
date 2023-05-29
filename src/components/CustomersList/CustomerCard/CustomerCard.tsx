import './CustomerCard.scss';
import { FormDataIded } from '../../../globalInterfaces';
import { useState } from 'react';
import capitalizeName from '../../../helpers/capitalizeName';
import UpdateDetails from '../../shared/UpdateDetails';

interface Props {
  data: FormDataIded;
  rooms: number;
}

const CustomerCard = ({ data, rooms }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const entryDate: Date = new Date(data.entryDate);

  return (
    <>
      {!isExpanded ? (
        <li className="customer-card-li">
          <button className="customer-card" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="contact-details">
              <h3 className="cx-name"> {capitalizeName(data.name)} </h3>
              <div className="phone"> Tel: {data.phone} </div>
            </div>
            <div className="rooms-open-container">
              <div className="rooms">
                Camere:
                <ul>
                  {data &&
                    data.rooms.map((room, i) => {
                      const isLastRoom = i === data.rooms.length - 1;
                      return (
                        <li key={room} className="room">
                          {room}
                          {!isLastRoom && ','}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="date-container">
              <div className="entry-date">Data intrare : {new Date(data.entryDate).toLocaleDateString('ro-RO')}</div>
              <div className="leave-date">Data iesire : {new Date(data.leaveDate).toLocaleDateString('ro-RO')}</div>
            </div>
          </button>
        </li>
      ) : (
        <UpdateDetails
          entryDetails={{ year: entryDate.getFullYear(), month: entryDate.getMonth() + 1, customerId: Number(data.id) }}
          setOpenDetails={setIsExpanded}
          rooms={rooms}
        />
      )}
    </>
  );
};

export default CustomerCard;
