import { ChangeEvent } from 'react';
import './MoneySection.scss';

interface Props {
  rooms: number[];
  prices: { [key: number]: any };
  advance: number;
  discount: number;
  balance: number;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export default function MoneySection({ rooms, prices, advance, discount, balance, onChange }: Props) {
  return (
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
                  id={'priceRoom'}
                  name="priceRoom"
                  className="price-on-room"
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                lei
              </label>
            );
          })}
      </div>
      <label>
        Avans
        <input type="number" name="advance" className="advance" value={advance} onChange={onChange} />
      </label>
      <label>
        Reducere
        <input type="number" name="discount" className="discount" value={discount} onChange={onChange} />
      </label>
      <div className="balance">
        De plata <p className="sum-remaining"> {balance}</p>
      </div>
    </section>
  );
}
