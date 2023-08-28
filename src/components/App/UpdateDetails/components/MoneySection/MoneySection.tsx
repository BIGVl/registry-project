import { ChangeEvent } from 'react';
import './MoneySection.scss';
import { EditSection } from '../../UpdateDetails';
import ExitEditModeButton from '../ExitEditModeButton/ExitEditModeButton';

interface Props {
  rooms: number[];
  prices: { [key: number]: any };
  advance: number;
  discount: number;
  balance: number;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  editSection: EditSection;
  setEditSection: (value: EditSection) => void;
}

export default function MoneySection({
  rooms,
  prices,
  advance,
  discount,
  balance,
  onChange,
  editSection,
  setEditSection
}: Props) {
  const editMode = editSection === 'money';

  return (
    <div className="update-money-container">
      {editMode ? (
        <section className="update-money">
          <div className="price-per-room">
            {rooms
              .sort((a: number, b: number) => (a > b ? 1 : -1))
              .map((room: number) => {
                const price = prices ? prices[room] : 0;

                return (
                  <label key={room} className="price-on-room-label">
                    camera {room}
                    <input
                      value={price}
                      data-id={room}
                      type="number"
                      min={0}
                      id={'priceRoom'}
                      name="priceRoom"
                      className="price-on-room"
                      onChange={(e) => {
                        onChange(e);
                      }}
                    />
                    <div className="lei"> lei </div>
                  </label>
                );
              })}
          </div>
          <label>
            Avans
            <input type="number" min={0} name="advance" className="advance" value={advance} onChange={onChange} />
          </label>
          <label>
            Reducere
            <input type="number" min={0} name="discount" className="discount" value={discount} onChange={onChange} />
          </label>
          <div className="balance">
            De plata <p className="sum-remaining"> {balance}</p>
          </div>
          <div className="close">
            <ExitEditModeButton setEditSection={setEditSection} />
          </div>
        </section>
      ) : (
        <button className="display-money" onClick={() => setEditSection('money')}>
          <div className="prices-container">
            {rooms.map((room) => {
              const price = prices[room] ? prices[room] : 0;
              return (
                <div id={room.toString()} className="price-of-room" key={room}>
                  <div className="room"> {room} </div> <div className="price"> {price} lei </div>
                </div>
              );
            })}
          </div>
          <div className="advance value-container">
            Avans <div className="value"> {advance ? advance : 0} lei </div>
          </div>
          <div className="discount value-container ">
            Discount <div className="value"> {discount} lei </div>
          </div>
          <div className="balance  value-container">
            De plata <div className="value"> {balance} lei</div>
          </div>
        </button>
      )}
    </div>
  );
}
