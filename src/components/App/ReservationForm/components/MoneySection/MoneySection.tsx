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
        <div className="title"> Pret pe camera pe noapte </div>
        {rooms
          .sort((a, b) => (a > b ? 1 : -1))
          .map((room) => {
            return (
              <label key={room} className="price-on-room-label" htmlFor="priceRoom">
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
      <label className="advance-label" htmlFor="advance">
        Avans
        <div className="value">
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
        </div>
      </label>
      <label className="discount-label" htmlFor="discount">
        Reducere
        <div className="value">
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
        </div>
      </label>
      <div id="balance" className="balance">
        De platit {balance} lei
      </div>
    </fieldset>
  );
};

export default MoneySection;
