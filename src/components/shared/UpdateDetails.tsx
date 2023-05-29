import { DocumentData } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { LocationContext, UserIDContext } from '../../Contexts';
import getCustomerInfo from '../../helpers/getCustomerInfo';
import { ReactComponent as Cancel } from '../../../../assets/cancel.svg';
import './UpdateDetails.scss';
import saveEntry from '../../helpers/saveEntry';
import validateDetails from '../../helpers/validateDetails';
import saveRooms from '../../helpers/saveRooms';
import { FormData } from '../../globalInterfaces';
import deleteDates from '../../helpers/deleteDates';
import checkRooms from '../../helpers/checkRooms';
import daysBetweenDates from '../../helpers/daysBetweenDates';

interface Props {
  entryDetails: {
    year: number;
    month: number;
    customerId: number;
  };
  setOpenDetails: (value: boolean) => void;
  rooms: number;
}

const UpdateDetails = ({ entryDetails, setOpenDetails, rooms }: Props) => {
  const initialCustomerData = useRef<FormData | DocumentData>({
    adults: '',
    entryDate: '',
    leaveDate: '',
    name: '',
    phone: '',
    rooms: [],
    prices: {},
    total: 0,
    advance: 0,
    discount: 0,
    balance: 0,
    kids: ''
  });
  const [customerData, setCustomerData] = useState<FormData | DocumentData>({ ...initialCustomerData.current });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const userID = useContext(UserIDContext);
  const location = useContext(LocationContext);
  const roomsArr = Array.from({ length: Number(rooms) || 0 }, (_, i) => i + 1);

  //Get data of the customer
  async function getData() {
    const responseData = await getCustomerInfo(location, userID, entryDetails.customerId);
    initialCustomerData.current = { ...responseData };
    setCustomerData({ ...responseData } ?? customerData);
    return responseData;
  }

  useEffect(() => {
    getData();
  }, []);

  //Update the balance remaining every time one of these values change
  useEffect(() => {
    setCustomerData((prev) => {
      const { total, advance, discount } = prev;
      return {
        ...prev,
        balance: Math.ceil(total - advance - (total * discount) / 100)
      };
    });
  }, [customerData.total, customerData.advance, customerData.discount]);

  //Besides updating the state, the dates or the price values are changed the total and the due balance will be updated accordingly

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const daysBetween = daysBetweenDates(customerData.entryDate, customerData.leaveDate);

    if (e.target.id.includes('priceRoom')) {
      setCustomerData((prev: FormData) => {
        const newPrices = { ...prev.prices, [e.target.getAttribute('data-id') as string]: e.target.value };

        const newTotal = !isNaN(daysBetween)
          ? Object.values(newPrices).reduce((acc: number, curr) => acc + Number(curr) * daysBetween, 0)
          : 0;

        return { ...prev, prices: newPrices, total: newTotal };
      });
    } else if (e.target.type === 'date') {
      setCustomerData((prev) => {
        const newPrices = { ...prev.prices, [e.target.getAttribute('data-id') as string]: e.target.value };

        const newTotal = !isNaN(daysBetween)
          ? Object.values(newPrices).reduce((acc: number, curr) => acc + Number(curr) * daysBetween, 0)
          : 0;

        return { ...prev, [e.target.name]: e.target.value, total: newTotal };
      });
    } else {
      setCustomerData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCustomerData((prev: any) => {
        return { ...prev, [e.target.name]: [...prev[e.target.name], Number(e.target.value)] };
      });
    } else if (customerData.rooms !== undefined) {
      customerData.rooms.forEach((room: number, i: number) => {
        if (room === Number(e.target.value)) {
          const rooms = [...customerData.rooms];
          rooms?.splice(i, 1);
          setCustomerData((prev) => {
            return { ...prev, [e.target.name]: [...rooms] };
          });
        }
      });
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const areRoomsFree = await checkRooms(
      customerData.rooms,
      customerData.entryDate,
      customerData.leaveDate,
      location,
      userID,
      setErrorMessage,
      entryDetails.customerId
    );

    if (areRoomsFree) {
      await deleteDates(
        location,
        userID,
        initialCustomerData.current.entryDate,
        initialCustomerData.current.leaveDate,
        initialCustomerData.current.rooms,
        entryDetails.customerId
      );
      await saveRooms(
        customerData.rooms,
        customerData.entryDate,
        customerData.leaveDate,
        location,
        userID,
        entryDetails.customerId
      );
      await saveEntry(`${location}${userID}`, customerData, entryDetails.customerId);
      setOpenDetails(false);
    }
  };

  return (
    <div className="update-form-container">
      <Cancel
        className="close-form"
        onClick={() => {
          setOpenDetails(false);
        }}
      />
      <h1> Detaliile clientului</h1>
      <p>Apasa pe informatiile pe care vrei sa le schimbi si la final apasa confirma.</p>
      <form action="" className="update-form" noValidate onSubmit={submit}>
        {errorMessage && (
          <div className="error-layout">
            <div className="error">
              <Cancel
                onClick={() => {
                  setErrorMessage('');
                }}
              />

              {errorMessage}
            </div>
          </div>
        )}

        <section className="contact-info">
          <label>
            Nume
            <input type="text" name="name" className="name" value={customerData.name} onChange={change} />
          </label>
          <label>
            Telefon
            <input type="number" name="phone" className="phone" value={customerData.phone} onChange={change} />
          </label>
        </section>
        <div className="rooms-container">
          Camere
          <div className="rooms">
            {roomsArr.map((room: number) => {
              return (
                <label key={`room${room}`} htmlFor={`rooms-${room}`}>
                  {room}

                  <input
                    onChange={handleCheck}
                    type="checkbox"
                    value={room}
                    name={`rooms`}
                    className={`room`}
                    checked={customerData.rooms.includes(room)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <section className="dates">
          <label>
            Data de intrare
            <input type="date" name="entryDate" className="entryDate" value={customerData.entryDate} onChange={change} />
          </label>
          <label>
            Data de iesire
            <input type="date" name="leaveDate" className="leaveDate" value={customerData.leaveDate} onChange={change} />
          </label>
        </section>
        <section className="persons">
          <label>
            Adulti
            <input type="number" name="adults" className="adults" value={customerData.adults} onChange={change} />
          </label>
          <label>
            Copii
            <input type="number" name="kids" className="kids" value={customerData.kids} onChange={change} />
          </label>
        </section>
        <section className="money">
          <div className="price-per-room">
            {customerData.rooms
              .sort((a: number, b: number) => (a > b ? 1 : -1))
              .map((room: number) => {
                return (
                  <label key={room} htmlFor={'priceRoom'} className="price-on-room-label">
                    camera {room} :
                    <input
                      data-id={room}
                      type="number"
                      id={'priceRoom'}
                      name="priceRoom"
                      className="price-on-room"
                      onChange={(e) => {
                        change(e);
                      }}
                    />
                    lei
                  </label>
                );
              })}
          </div>
          <label>
            Avans
            <input type="number" name="advance" className="advance" value={customerData.advance} onChange={change} />
          </label>
          <label>
            Reducere
            <input type="number" name="discount" className="discount" value={customerData.discount} onChange={change} />
          </label>
          <div className="balance">
            De plata <p className="sum-remaining"> {customerData.balance}</p>
          </div>
        </section>
        <button
          type="button"
          className="submit-update"
          onClick={() => {
            validateDetails(customerData, setErrorMessage, setConfirmSubmit);
          }}
        >
          Confirma schimbarile
        </button>
        {confirmSubmit && (
          <div className="confirm-submission-layout">
            <div className="confirm-submission-container">
              Confirma schimbarile facute pentru intrarea pe numele {customerData.name} .
              <div className="confirm-buttons-container">
                <button type="submit" className="submit-confirm">
                  Confirm
                </button>
                <button
                  className="exit-confirm"
                  onClick={() => {
                    setConfirmSubmit(false);
                  }}
                >
                  Inapoi
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateDetails;
