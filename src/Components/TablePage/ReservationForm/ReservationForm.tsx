import './ReservationForm.css';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import saveRooms from '../helpers/saveRooms';
import saveEntry from '../helpers/saveEntry';
import getCxNr from '../helpers/getCxNr';
import validateDetails from '../helpers/validateDetails';
import { FormData } from '../../../globalInterfaces';
import checkRooms from '../helpers/checkRooms';

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
  //This state is used to check if the write of the data was successful and if yes to save data about the entry in a useEffect
  const [sendSucceed, setSendSucceed] = useState<boolean>(false);

  //Used to loop through to create the numbers of rooms that the component will receive
  const roomsArray: number[] = [];

  for (let i = 1; i <= rooms; i++) {
    roomsArray.push(i);
  }

  //Create customerID
  useEffect(() => {
    getCxNr(userID, location, setCustomerID);
  }, []);

  //Update the balance remaining every time one of these values change
  useEffect(() => {
    setFormData((prev) => {
      const { total, advance, discount } = prev;
      return {
        ...prev,
        balance: Math.ceil(total - advance - (total * discount) / 100)
      };
    });
  }, [formData.total, formData.advance, formData.discount]);

  const change = (e: any) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCheck = (e: any) => {
    if (e.target.checked) {
      setFormData((prev: any) => {
        return { ...prev, [e.target.name]: [...prev[e.target.name], Number(e.target.value)] };
      });
    } else {
      formData.rooms.forEach((room: number, i: number) => {
        if (room === Number(e.target.value)) {
          const rooms = formData.rooms;
          rooms?.splice(i, 1);
          setFormData((prev) => {
            return { ...prev, [e.target.name]: rooms };
          });
        }
      });
    }
  };

  //If submitting the entries with the dates for each room into the db is successful we then save the customer's details to the db as well

  useEffect(() => {
    if (sendSucceed === true) {
      saveEntry(`${location}${userID}`, formData, customerID);
      setOpenForm(false);
      setSendSucceed(false);
    }
  }, [sendSucceed]);

  //Check if the rooms are available on choosen dates and return an error if they are occupied or store the new entrance if they are not
  const submit = async (e: any) => {
    e.preventDefault();
    setConfirmSubmit(false);
    const areRoomsFree = await checkRooms(
      formData.rooms,
      formData.entryDate,
      formData.leaveDate,
      location,
      userID,
      setErrorMsg,
      customerID
    );
    console.log(areRoomsFree);
    if (areRoomsFree) {
      await saveRooms(formData.rooms, formData.entryDate, formData.leaveDate, location, userID, setSendSucceed, customerID);
    }
  };

  return (
    <div id="form-container">
      {errorMsg !== '' ? (
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
      ) : (
        ''
      )}

      <form id="form-reservation" onSubmit={submit}>
        <Cancel
          onClick={() => {
            setOpenForm(false);
          }}
          id="cancel"
        />

        <fieldset id="dates">
          <label htmlFor="entryDate">
            Data intrare :
            <input onChange={change} type="date" name="entryDate" id="date-enter" />
          </label>
          <label htmlFor="leaveDate">
            Data iesire :
            <input onChange={change} type="date" name="leaveDate" id="date-leave" />
          </label>
        </fieldset>

        <label htmlFor="name">
          Numele clientului :
          <input onChange={change} type="text" name="name" id="name-cx" />
        </label>
        <label htmlFor="phone">
          Numar de telefon :
          <input onChange={change} type="number" name="phone" id="phone-cx" />
        </label>
        <div className="rooms-container">
          <p>Camere : </p>
          <fieldset id="rooms-fieldset">
            {roomsArray.map((room) => {
              return (
                <label key={`room${room}`} htmlFor={`rooms-${room}`}>
                  {room}
                  <input onChange={handleCheck} type="checkbox" value={room} name={`rooms`} id={`rooms-${room}`} />
                </label>
              );
            })}
          </fieldset>
        </div>
        <fieldset id="adults-childs">
          <label id="adults-l" htmlFor="adults">
            Adulti :
            <input onChange={change} type="number" name="adults" id="adults" />
          </label>
          <label id="childs-l" htmlFor="childs">
            Copii :
            <input onChange={change} type="number" name="kids" id="childs" />
          </label>
        </fieldset>

        <fieldset id="money-field">
          <label htmlFor="total" id="total-l">
            Total:{' '}
            <input
              type="number"
              id="total"
              name="total"
              onChange={(e) => {
                change(e);
              }}
            />
            lei
          </label>
          <label id="advance-l" htmlFor="advance">
            Avans :
            <input
              onChange={(e) => {
                change(e);
              }}
              type="number"
              name="advance"
              id="advance"
            />
            lei
          </label>
          <label htmlFor="discount" id="discount-l">
            Reducere :
            <input
              onChange={(e) => {
                change(e);
              }}
              type="number"
              name="discount"
              id="reducere"
            />{' '}
            %
          </label>
          <div id="balance">De platit : {formData.balance} lei</div>
        </fieldset>

        <button
          type="button"
          id="submit"
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
                <button type="submit" id="submit-confirm">
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
