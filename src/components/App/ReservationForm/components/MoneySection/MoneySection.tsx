import { ChangeEvent } from 'react';
import './MoneySection.scss';

interface Props {
  rooms: number[];
  updateFormData: (value: ChangeEvent<HTMLInputElement>) => void;
  balance: number;
}

const MoneySection = ({ rooms, updateFormData, balance }: Props) => {
  return (
    <fieldset className="money-field">
      <div className="price-on-room-container">
        Pret pe camera pe noapte
        {rooms
          .sort((a, b) => (a > b ? 1 : -1))
          .map((room) => {
            return (
              <label key={room} className="price-on-room-label">
                camera {room}
                <div className="value">
                  <input
                    data-id={room}
                    type="number"
                    id={'priceRoom'}
                    name="priceRoom"
                    className="price-on-room"
                    onChange={(e) => {
                      updateFormData(e);
                    }}
                  />
                  lei
                </div>
              </label>
            );
          })}
      </div>
      <label className="advance-label">
        Avans
        <input
          onChange={(e) => {
            updateFormData(e);
          }}
          type="number"
          name="advance"
          id="advance"
          className="advance"
        />
        lei
      </label>
      <label className="discount-label">
        Reducere
        <input
          onChange={(e) => {
            updateFormData(e);
          }}
          type="number"
          name="discount"
          id="reducere"
          className="reducere"
        />
        %
      </label>
      <div id="balance" className="balance">
        De platit : {balance} lei
      </div>
    </fieldset>
  );
};

export default MoneySection;
