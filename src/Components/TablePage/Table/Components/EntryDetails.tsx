import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import getCustomerInfo from './helpers/getCustomerInfo';
import './EntryDate.css';

interface Props {
  entryDetails: {
    year: number;
    month: number;
    customerId: number;
  };
}

const EntryDetails = ({ entryDetails }: Props) => {
  const [data, setData] = useState<DocumentData>();
  const userID = useContext(UserIDContext);
  const location = useContext(LocationContext);
  useEffect(() => {
    getCustomerInfo(location, userID, entryDetails.year, entryDetails.month, entryDetails.customerId, setData);
  }, []);

  return (
    <div className="entry-details">
      <h1> Detaliile clientului</h1>
      <p>Apasa pe informatiile pe care vrei sa le schimbi si la final apasa confirma</p>
      <label htmlFor="name">
        Nume:
        <input type="text" name="name" id="name" />
      </label>
      <label htmlFor="phone">
        Telefon:
        <input type="tel" name="phone" id="phone" />
      </label>
      <label htmlFor="rooms">
        Camere: <input type="checkbox" name="" id="" className="switch" />
      </label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
      <label htmlFor=""></label>
    </div>
  );
};

export default EntryDetails;
