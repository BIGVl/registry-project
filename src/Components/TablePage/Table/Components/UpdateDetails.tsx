import { DocumentData } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import getCustomerInfo from '../../helpers/getCustomerInfo';
import { ReactComponent as Cancel } from '../../../../assets/cancel.svg';
import './UpdateDetails.scss';
import saveEntry from '../../helpers/saveEntry';
import validateDetails from '../../helpers/validateDetails';
import saveRooms from '../../helpers/saveRooms';
import { FormData } from '../../../../globalInterfaces';
import deleteDates from '../../helpers/deleteDates';
import checkRooms from '../../helpers/checkRooms';

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
  const [customerData, setCustomerData] = useState<FormData | DocumentData>({
    adults: '',
    entryDate: '',
    leaveDate: '',
    name: '',
    phone: '',
    rooms: [],
    total: 0,
    advance: 0,
    discount: 0,
    balance: 0,
    kids: ''
  });
  const [initialCustomerData, setInitialCustomerData] = useState<FormData | DocumentData>(customerData);
  const [locationData, setLocationData] = useState<DocumentData>();
  const [errorMeesage, setErrorMessage] = useState<string>('');
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [sendSucceed, setSendSucceed] = useState<boolean>(false);
  const userID = useContext(UserIDContext);
  const location = useContext(LocationContext);
  const roomsArr = Array.from({ length: Number(locationData?.rooms) || 0 }, (_, i) => i + 1);

  //Get data of the customer
  async function getData() {
    const responseData = await getCustomerInfo(location, userID, entryDetails.year, entryDetails.month, entryDetails.customerId);
    setInitialCustomerData(responseData?.data ?? initialCustomerData);
    setCustomerData(responseData?.data ?? customerData);
    setLocationData(responseData?.locationData ?? locationData);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.type);
    setCustomerData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      console.log(e.target.name, e.target);
      setCustomerData((prev: any) => {
        console.log(prev, e.target.name);
        return { ...prev, [e.target.name]: [...prev[e.target.name], Number(e.target.value)] };
      });
    } else if (customerData.rooms !== undefined) {
      customerData.rooms.forEach((room: number, i: number) => {
        if (room === Number(e.target.value)) {
          const rooms = customerData.rooms;
          rooms?.splice(i, 1);
          setCustomerData((prev) => {
            return { ...prev, [e.target.name]: rooms };
          });
        }
      });
    }
  };

  useEffect(() => {
    if (sendSucceed) {
      deleteDates(
        location,
        userID,
        initialCustomerData.entryDate,
        initialCustomerData.leaveDate,
        initialCustomerData.rooms,
        entryDetails.customerId
      );
      saveEntry(`${location}${userID}`, customerData, entryDetails.customerId);
      setOpenDetails(false);
      setSendSucceed(false);
    }
  }, [sendSucceed]);

  const submit = async (e: React.FormEvent) => {
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
    console.log(areRoomsFree);
    await saveRooms(
      customerData.rooms,
      customerData.entryDate,
      customerData.leaveDate,
      location,
      userID,
      setSendSucceed,
      entryDetails.customerId
    );
  };

  return (
    <div className="update-form-container">
      <Cancel
        onClick={() => {
          setOpenDetails(false);
        }}
      />
      <h1> Detaliile clientului</h1>
      <p>Apasa pe informatiile pe care vrei sa le schimbi si la final apasa confirma.</p>
      <form action="" className="update-form" noValidate onSubmit={submit}>
        <section className="contact-info">
          <label>
            Nume
            <input type="text" name="name" className="name" value={customerData.name} onChange={handleChange} />
          </label>
          <label>
            Telefon
            <input type="number" name="phone" className="phone" value={customerData.phone} onChange={handleChange} />
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
            <input type="date" name="entryDate" className="entryDate" value={customerData.entryDate} onChange={handleChange} />
          </label>
          <label>
            Data de iesire
            <input type="date" name="leaveDate" className="leaveDate" value={customerData.leaveDate} onChange={handleChange} />
          </label>
        </section>
        <section className="persons">
          <label>
            Adulti
            <input type="number" name="adults" className="adults" value={customerData.adults} onChange={handleChange} />
          </label>
          <label>
            Copii
            <input type="number" name="kids" className="kids" value={customerData.kids} onChange={handleChange} />
          </label>
        </section>
        <section className="money">
          <label>
            Total
            <input type="number" name="total" className="total" value={customerData.total} onChange={handleChange} />
          </label>
          <label>
            Avans
            <input type="number" name="advance" className="advance" value={customerData.advance} onChange={handleChange} />
          </label>
          <label>
            Reducere
            <input type="number" name="discount" className="discount" value={customerData.discount} onChange={handleChange} />
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
        {confirmSubmit ? (
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
        ) : (
          ''
        )}
        {errorMeesage && <div>{errorMeesage}</div>}
      </form>
    </div>
  );
};

export default UpdateDetails;
