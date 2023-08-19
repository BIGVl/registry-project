import { DocumentData } from 'firebase/firestore';
import { ChangeEvent, FormEvent, MouseEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import getCustomerInfo from '../../../helpers/getCustomerInfo';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';
import { ReactComponent as Back } from '../../../assets/arrow-left.svg';

import './UpdateDetails.scss';
import saveEntry from '../../../helpers/saveEntry';
import validateDetails from '../../../helpers/validateDetails';
import saveRooms from '../../../helpers/saveRooms';
import { FormData } from '../../../globalInterfaces';
import deleteDates from '../../../helpers/deleteDates';
import checkRooms from '../../../helpers/checkRooms';
import daysBetweenDates from '../../../helpers/daysBetweenDates';
//Children components
import ContactSection from './components/ContactSection/ContactSection';
import Rooms from './components/Rooms/Rooms';
import DatesSection from './components/DatesSection/DatesSection';
import CustomersSection from './components/CustomersSection/CustomersSection';
import MoneySection from './components/MoneySection/MoneySection';
import SubmitButton from './components/SubmitButton/SubmitButton';

interface Props {
  entryDetails: {
    year: number;
    month: number;
    customerId: number;
  };
  setOpenDetails: (value: boolean) => void;
  rooms: number;
}

export type EditSection = 'contact' | 'customer' | 'date' | 'money' | 'room' | '';

export default function UpdateDetails({ entryDetails, setOpenDetails, rooms }: Props) {
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
  //This state is used for the section on which the user has clicked in order
  //to change from read-only content into inputs
  const [editSection, setEditSection] = useState<EditSection>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const userID = useContext(UserIDContext);
  const userIdString = userID || '';
  const location = useContext(LocationContext);

  //Get data of the customer
  async function getData() {
    const responseData = await getCustomerInfo(location, userIdString, entryDetails.customerId);
    initialCustomerData.current = { ...responseData };
    setCustomerData({ ...responseData } ?? customerData);
    return responseData;
  }

  useEffect(() => {
    getData();
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  //Update the balance remaining every time one of these values change
  useMemo(() => {
    setCustomerData((prev) => {
      const { total, advance, discount } = prev;
      return {
        ...prev,
        balance: Math.ceil(total - advance - (total * discount) / 100)
      };
    });
  }, [customerData.total, customerData.advance, customerData.discount]);

  //Besides updating the state, the dates or the price,
  //values are changed the total and the due balance will be updated accordingly
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

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains('update-form-layout') || target.classList.contains('close-update-form')) {
      setIsMounted(false);
      setTimeout(() => {
        setOpenDetails(false);
      }, 400);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const areRoomsFree = await checkRooms(
      customerData.rooms,
      customerData.entryDate,
      customerData.leaveDate,
      location,
      userIdString,
      setErrorMessage,
      entryDetails.customerId
    );

    if (areRoomsFree) {
      await deleteDates(
        location,
        userIdString,
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
        userIdString,
        entryDetails.customerId
      );
      await saveEntry(`${location}${userID}`, customerData, entryDetails.customerId);
      setOpenDetails(false);
    }
  };

  return (
    <div className={`update-form-layout ${isMounted ? 'mounted' : 'unmounted'}`} onClick={closeModal}>
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

      <form action="" className={`update-form`} noValidate onSubmit={submit}>
        <Back
          className="close-update-form"
          onClick={() => {
            setIsMounted(false);
            setTimeout(() => {
              setOpenDetails(false);
            }, 400);
          }}
        />
        <ContactSection
          name={customerData.name}
          phone={customerData.phone}
          onChange={change}
          editSection={editSection}
          setEditSection={setEditSection}
        />
        <Rooms
          rooms={rooms}
          customersRooms={customerData.rooms}
          setCustomerData={setCustomerData}
          entryDate={customerData.entryDate}
          leaveDate={customerData.leaveDate}
          editSection={editSection}
          setEditSection={setEditSection}
        />
        <DatesSection
          entryDate={customerData.entryDate}
          leaveDate={customerData.leaveDate}
          onChange={change}
          editSection={editSection}
          setEditSection={setEditSection}
        />
        <CustomersSection
          adults={customerData.adults}
          kids={customerData.kids}
          onChange={change}
          editSection={editSection}
          setEditSection={setEditSection}
        />
        <MoneySection
          rooms={customerData.rooms}
          prices={customerData.prices}
          advance={customerData.advance}
          discount={customerData.discount}
          balance={customerData.balance}
          onChange={change}
          editSection={editSection}
          setEditSection={setEditSection}
        />
        <SubmitButton customerData={customerData} setErrorMessage={setErrorMessage} setConfirmSubmit={setConfirmSubmit} />
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
}
