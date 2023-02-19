import { DocumentData } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import getCustomerInfo from '../../helpers/getCustomerInfo';
import { ReactComponent as Cancel } from '../../../../assets/cancel.svg';
import './UpdateDetails.css';
import saveEntry from '../../helpers/saveEntry';
import validateDetails from '../../helpers/validateDetails';
import checknSaveRooms from '../../helpers/checknSaveRooms';
import { FormData } from '../../../../interfaces';
import deleteDates from '../../helpers/deleteDates';

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
  const [balanceState, setBalanceState] = useState<number>(0);
  const [errorMeesage, setErrorMessage] = useState<string>('');
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [sendSucceed, setSendSucceed] = useState<boolean>(false);
  const userID = useContext(UserIDContext);
  const location = useContext(LocationContext);
  //Get data of the customer
  useEffect(() => {
    getCustomerInfo(
      location,
      userID,
      entryDetails.year,
      entryDetails.month,
      entryDetails.customerId,
      setCustomerData,
      setLocationData,
      setInitialCustomerData
    );
    console.log(customerData);
  }, []);

  //Close the form when the update finishes successfully
  useEffect(() => {
    if (sendSucceed) {
      saveEntry(`${location}${userID}`, customerData, entryDetails.customerId);
      setOpenDetails(false);
      setSendSucceed(false);
    }
  }, [sendSucceed]);

  //Update the balance remaining every time one of these values change

  let { balance, total, discount, advance } = customerData;
  useEffect(() => {
    balance = Math.ceil(total - advance - (total * discount) / 100);

    setBalanceState(balance);
  }, [balance, total, discount, advance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const roomsArr = [];
  for (let i = 1; i <= locationData?.rooms; i++) {
    roomsArr.push();
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Information has changed');
    await deleteDates(
      location,
      userID,
      initialCustomerData.entryDate,
      initialCustomerData.leaveDate,
      initialCustomerData.rooms,
      entryDetails.customerId
    );

    await checknSaveRooms(
      customerData.rooms,
      customerData.entryDate,
      customerData.leaveDate,
      location,
      userID,
      setErrorMessage,
      setSendSucceed,
      entryDetails.customerId
    );
  };

  return (
    <div className="entry-details">
      <Cancel
        onClick={() => {
          setOpenDetails(false);
        }}
      />
      <h1> Detaliile clientului</h1>
      <p>Apasa pe informatiile pe care vrei sa le schimbi si la final apasa confirma</p>
      <form action="" noValidate onSubmit={submit}>
        <label>
          Nume:
          <input type="text" name="name" id="name" value={customerData?.name} onChange={handleChange} />
        </label>
        <label>
          Telefon:
          <input type="tel" name="phone" id="phone" value={customerData?.phone} onChange={handleChange} />
        </label>
        <div id="rooms">
          Camere:{' '}
          {customerData.rooms.map((room: string) => {
            return (
              <label key={`room${room}`} htmlFor={`rooms-${room}`}>
                {room}

                <input
                  onChange={handleCheck}
                  type="checkbox"
                  value={room}
                  name={`rooms`}
                  className={`room-${room}`}
                  defaultChecked
                />
              </label>
            );
          })}{' '}
        </div>
        <label>
          Data de intrare:
          <input type="date" name="entryDate" id="entryDate" value={customerData?.entryDate} onChange={handleChange} />
        </label>
        <label>
          Data de iesire:
          <input type="date" name="leaveDate" id="leaveDate" value={customerData?.leaveDate} onChange={handleChange} />
        </label>
        <label>
          Adulti:
          <input type="number" name="adults" id="adults" value={customerData?.adults} onChange={handleChange} />
        </label>
        <label>
          Copii:
          <input type="number" name="kids" id="kids" value={customerData?.kids} onChange={handleChange} />
        </label>
        <label>
          Total:
          <input type="number" name="total" id="total" value={customerData?.total} onChange={handleChange} />
        </label>
        <label>
          Avans:
          <input type="number" name="advance" id="advance" value={customerData?.advance} onChange={handleChange} />
        </label>
        <label>
          Reducere:
          <input type="number" name="discount" id="discount" value={customerData?.discount} onChange={handleChange} />
        </label>
        <p id="balance" className="balance">
          De plata:{balanceState}
        </p>
        <button
          type="button"
          className="submit-update-details"
          onClick={() => {
            validateDetails(customerData, setErrorMessage, setConfirmSubmit);
          }}
        >
          Confirma schimbarile
        </button>
        {confirmSubmit ? (
          <div className="confirm-submission-container">
            <div className="confirm-submission">
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
