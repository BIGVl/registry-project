import './ReservationForm.css';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import checknSaveRooms from './checknSaveRooms';
import saveEntry from './saveEntry';

interface Props {
  setOpenForm: (value: boolean | ((prevState: boolean) => boolean)) => void;
  rooms: number;
}

export interface FormData {
  adults: string;
  advance: number;
  entryDate: string;
  leaveDate: string;
  name: string;
  phone: string;
  discount: number;
  rooms: string[];
  total: number;
  balance: number;
  kids: string;
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

  const [balanceState, setBalanceState] = useState<number>(0);
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
  useEffect(() => {
    if (sendSucceed === true) {
      setOpenForm(false);
      saveEntry(`${Location}${userID}`, formData);
      setSendSucceed(false);
    }
  }, [sendSucceed]);

  //Update the balance remaining every time one of these values change
  let { balance, total, discount, advance } = formData;
  useEffect(() => {
    balance = total - advance - (total * discount) / 100;
    setBalanceState(balance);
  }, [balance, total, discount, advance]);

  const change = (e: any) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCheck = (e: any) => {
    if (e.target.checked) {
      setFormData((prev: any) => {
        return { ...prev, [e.target.name]: [...prev[e.target.name], e.target.value] };
      });
    } else if (formData.rooms !== undefined) {
      formData.rooms.forEach((room, i) => {
        if (room === e.target.value) {
          const rooms = formData.rooms;
          rooms?.splice(i, 1);
          setFormData((prev) => {
            return { ...prev, [e.target.name]: rooms };
          });
        }
      });
    }
  };

  //Check if the inputs are available and if yes prompt the user the confirmation pop up
  const confirm = () => {
    if (formData.rooms.length < 1) {
      return setErrorMsg('Nu ai selectat nici o camera.');
    } else if (formData.entryDate >= formData.leaveDate) {
      return setErrorMsg('Data de intrare trebuie sa fie inaintea datei de iesire.');
    } else if (formData.entryDate === '') {
      return setErrorMsg('Nu ai selectat o data de intrare.');
    } else if (formData.leaveDate === '') {
      return setErrorMsg('Nu ai selectat nici o data de iesire.');
    } else if (formData.name.length < 3) {
      return setErrorMsg('Numele trebuie sa aiba cel putin 4 litere.');
    } else if (formData.phone.length < 9) {
      return setErrorMsg('Numarul trebuie sa aiba cel putin 10 cifre.');
    } else if (formData.adults === '') {
      return setErrorMsg('E nevoie de cel putin un adult pentru rezervare.');
    }
    setErrorMsg('');
    setConfirmSubmit(true);
  };
  //Check if the rooms are available on choosen dates and return an error if they are occupied or store the new entrance if they are not
  const submit = async (e: any) => {
    e.preventDefault();
    setFormData((prev: FormData) => {
      return { ...prev, balance: balanceState };
    });
    setConfirmSubmit(false);

    let id = await checknSaveRooms(
      formData.rooms,
      formData.entryDate,
      formData.leaveDate,
      location,
      userID,
      setErrorMsg,
      setOpenForm,
      setSendSucceed
    );
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
          <p>Camera : </p>
          <fieldset id="rooms-l">
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
          <div id="balance">De platit : {balanceState} lei</div>
        </fieldset>

        <button type="button" id="submit" onClick={confirm}>
          Confirm intrare
        </button>

        {confirmSubmit ? (
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
        ) : (
          ''
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
