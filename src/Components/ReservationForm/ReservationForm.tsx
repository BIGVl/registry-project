import './ReservationForm.css';
import { ReactComponent as Cancel } from '../../assets/cancel.svg';
import { useContext, useEffect, useState } from 'react';
import PropertyContext from '../../Contexts/PopertyContext';
import checknSaveRooms from './checknSaveRooms';

interface Props {
  setOpenForm: (value: boolean | ((prevState: boolean) => boolean)) => void;
  rooms: number;
}

interface FormData {
  adults: string;
  avans: number;
  dateEnter: string;
  dateLeave: string;
  name: string;
  phone: string;
  reducere: number;
  camera: string[];
  total: number;
  balance: number;
}

const ReservationForm = ({ setOpenForm, rooms }: Props) => {
  const property = useContext(PropertyContext);
  const [formData, setFormData] = useState<FormData>({
    adults: '',
    dateEnter: '',
    dateLeave: '',
    name: '',
    phone: '',
    camera: [],
    total: 0,
    avans: 0,
    reducere: 0,
    balance: 0
  });

  const [balanceState, setBalanceState] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  //These state objects will be used to store the available and unavailable dates for the respective room, to be later saved to the db
  //if they are available and if not to be displayed in the error so the admin user knows what dates are occupied
  const [availables, setAvailables] = useState<any>({ 2022: {}, 2023: {}, 2024: {}, 2025: {}, 2026: {} });
  const [unavailables, setUnavailables] = useState<any>({ 2022: {}, 2023: {}, 2024: {}, 2025: {}, 2026: {} });

  //Used to loop through to create the numbers of rooms that the component will receive
  const roomsArray: number[] = [];

  for (let i = 1; i <= rooms; i++) {
    roomsArray.push(i);
  }
  let { balance, total, reducere, avans } = formData;
  useEffect(() => {
    balance = total - avans - (total * reducere) / 100;
    setBalanceState(balance);

    console.log(formData);
  }, [balance, total, reducere, avans]);

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
    } else if (formData.camera !== undefined) {
      formData.camera.map((room, i) => {
        if (room === e.target.value) {
          const rooms = formData.camera;
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
    if (formData.camera.length < 1) {
      return setErrorMsg('Nu ai selectat nici o camera.');
    } else if (formData.dateEnter >= formData.dateLeave) {
      return setErrorMsg('Data de intrare trebuie sa fie inaintea datei de iesire.');
    } else if (formData.dateEnter === '') {
      return setErrorMsg('Nu ai selectat o data de intrare.');
    } else if (formData.dateLeave === '') {
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

    await checknSaveRooms(
      formData.camera,
      formData.dateEnter,
      formData.dateLeave,
      setAvailables,
      setUnavailables,
      availables,
      unavailables,
      property,
      setErrorMsg,
      setOpenForm
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
          <label htmlFor="dateEnter">
            Data intrare :
            <input onChange={change} type="date" name="dateEnter" id="date-enter" />
          </label>
          <label htmlFor="dateLeave">
            Data iesire :
            <input onChange={change} type="date" name="dateLeave" id="date-leave" />
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
                <label key={`room${room}`} htmlFor={`camera-${room}`}>
                  {room}
                  <input onChange={handleCheck} type="checkbox" value={room} name={`camera`} id={`camera-${room}`} />
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
            <input onChange={change} type="number" name="childs" id="childs" />
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
          <label id="avans-l" htmlFor="avans">
            Avans :
            <input
              onChange={(e) => {
                change(e);
              }}
              type="number"
              name="avans"
              id="avans"
            />
            lei
          </label>
          <label htmlFor="reducere" id="reducere-l">
            Reducere :
            <input
              onChange={(e) => {
                change(e);
              }}
              type="number"
              name="reducere"
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
