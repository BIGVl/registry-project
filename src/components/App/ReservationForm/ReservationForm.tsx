import './ReservationForm.scss';
import { ReactComponent as ArrowLeft } from '../../../assets/arrow-left.svg';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import saveRooms from '../../../helpers/saveRooms';
import saveEntry from '../../../helpers/saveEntry';
import getCxNr from '../../../helpers/getCxNr';
import validateDetails from '../../../helpers/validateDetails';
import checkRooms from '../../../helpers/checkRooms';
import { FormData } from '../../../globalInterfaces';
import daysBetweenDates from '../../../helpers/daysBetweenDates';
import DatesSection from './components/DatesSection/DatesSection';
import MoneySection from './components/MoneySection/MoneySection';
import ContactInfo from './components/ContactInfo/ContactInfo';
import NrOfCustomers from './components/NrOfCustomers/NrOfCustomer';
import Rooms from './components/Rooms/Rooms';

interface Props {
  setOpenForm: (value: boolean | ((prevState: boolean) => boolean)) => void;
  rooms: number;
}

const ReservationForm = ({ setOpenForm, rooms }: Props) => {
  const location = useContext(LocationContext);
  const userID = useContext(UserIDContext);
  const [formData, setFormData] = useState<FormData>({
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
  const [customerID, setCustomerID] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  //This state is used for the confirmation pop-up, after the client side validation, so the data will be send to the db
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const newBalance = Math.ceil(formData.total - formData.advance - (formData.total * formData.discount) / 100);

  //Used to loop through to create the numbers of rooms that the component will receive
  const roomsArray: number[] = [];

  for (let i = 1; i <= rooms; i++) {
    roomsArray.push(i);
  }

  //Create customerID
  useEffect(() => {
    getCxNr(userID, location, setCustomerID);
  }, []);

  //Besides updating the state, when price values are changed the total and the due balance will be updated accordingly
  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    //Calculate the new total and update the state variable with the new price for each room as well
    if (e.target.id.includes('priceRoom')) {
      const daysBetween = daysBetweenDates(formData.entryDate, formData.leaveDate);
      setFormData((prev: FormData) => {
        const newPrices = { ...prev.prices, [Number(e.target.getAttribute('data-id'))]: e.target.value };
        const newTotal = !isNaN(daysBetween)
          ? Object.values(newPrices).reduce((accumulator: number, current) => accumulator + Number(current) * daysBetween, 0)
          : 0;
        return { ...prev, prices: newPrices, total: newTotal };
      });
      //If the dates are changing update the dates in the state and also calculate the new total
    } else if (e.target.type === 'date') {
      const daysBetween =
        e.target.name === 'entryDate'
          ? daysBetweenDates(e.target.value, formData.leaveDate)
          : daysBetweenDates(formData.entryDate, e.target.value);

      setFormData((prev) => {
        const newPrices = { ...prev.prices };
        const newTotal = !isNaN(daysBetween)
          ? Object.values(newPrices).reduce((accumulator: number, current) => accumulator + Number(current) * daysBetween, 0)
          : 0;

        return { ...prev, [e.target.name]: e.target.value, total: newTotal };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };

  //Add and remove the rooms in the state and also recalculate the total when the rooms are removed
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData((prev) => {
        return { ...prev, [e.target.name]: [...prev[e.target.name], Number(e.target.value)] };
      });
    } else {
      formData.rooms.forEach((room: number, i: number) => {
        if (room === Number(e.target.value)) {
          const rooms = formData.rooms;
          setFormData((prev) => {
            const newPrices = prev.prices;
            delete newPrices[room];
            rooms?.splice(i, 1);
            return { ...prev, [e.target.name]: rooms, prices: newPrices };
          });
        }
      });
      const daysBetween = daysBetweenDates(formData.entryDate, formData.leaveDate);
      setFormData((prev) => {
        const newTotal = !isNaN(daysBetween)
          ? Object.values(prev.prices).reduce((accumulator: number, current) => accumulator + Number(current) * daysBetween, 0)
          : 0;
        return { ...prev, total: newTotal };
      });
    }
  };
  //Check if the rooms are available on choosen dates and return an error if they are occupied or store the new entrance if they are not
  const submit = async (e: any) => {
    const userIdString = userID || '';
    setFormData((prev) => {
      return { ...prev, balance: newBalance };
    });
    e.preventDefault();
    setConfirmSubmit(false);
    const areRoomsFree = await checkRooms(
      formData.rooms,
      formData.entryDate,
      formData.leaveDate,
      location,
      userIdString,
      setErrorMsg,
      customerID
    );
    if (areRoomsFree) {
      await saveRooms(formData.rooms, formData.entryDate, formData.leaveDate, location, userIdString, customerID);
      await saveEntry(`${location}${userID}`, formData, customerID);
      setOpenForm(false);
    }
  };

  return (
    <div className="form-container">
      {errorMsg && (
        <div className="error-layout">
          <div className="error">
            <Cancel
              onClick={() => {
                setErrorMsg('');
              }}
            />
            {errorMsg}
          </div>
        </div>
      )}

      <form className="form-reservation" onSubmit={submit}>
        <div className="cancel-container">
          <ArrowLeft
            onClick={() => {
              setOpenForm(false);
            }}
            className="cancel"
          />
        </div>
        <DatesSection updateFormData={updateFormData} />
        <ContactInfo updateFormData={updateFormData} />
        <Rooms roomsArray={roomsArray} handleCheck={handleCheck} />
        <NrOfCustomers updateFormData={updateFormData} />
        <MoneySection rooms={formData.rooms} updateFormData={updateFormData} balance={newBalance} />
        <button
          type="button"
          id="submit"
          className="submit"
          onClick={() => {
            validateDetails(formData, setErrorMsg, setConfirmSubmit);
          }}
        >
          Confirm intrare
        </button>
        {confirmSubmit && (
          <div id="confirm-submission-container">
            <div id="confirm-submission">
              Intrarea va fi facuta pe numele {formData.name} . Confirmi ?
              <div id="confirm-buttons-container">
                <button type="submit" id="submit-confirm" className="submit-confirm">
                  Confirm
                </button>
                <button
                  id="exit-confirm"
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

export default ReservationForm;
