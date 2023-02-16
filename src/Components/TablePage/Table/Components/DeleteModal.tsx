import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import { FormData } from '../../../../interfaces';
import deleteDates from '../../helpers/deleteDates';
import deleteEntry from '../../helpers/deleteEntry';
import getCustomerInfo from '../../helpers/getCustomerInfo';
import './DeleteModal.css';

interface Props {
  entryDetails: {
    year: number;
    month: number;
    customerId: number;
  };
  setOpenDelete: (value: boolean) => void;
}

const DeleteModal = ({ entryDetails, setOpenDelete }: Props) => {
  const userID = useContext(UserIDContext);
  const [customerData, setCustomerData] = useState<FormData | DocumentData>();

  //Get data of the customer
  useEffect(() => {
    console.log(entryDetails);
    getCustomerInfo(location, userID, entryDetails.year, entryDetails.month, entryDetails.customerId, setCustomerData);
  }, []);

  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);

  const submit = async () => {
    await deleteEntry(`${location}${userId}`, `${entryDetails.year}`, `${entryDetails.month}`, `${entryDetails.customerId}`);
    await deleteDates(
      location,
      `${userId}`,
      customerData?.entryDate,
      customerData?.leaveDate,
      customerData?.rooms,
      entryDetails.customerId
    );
    setOpenDelete(false);
  };

  return (
    <div className="delete-modal-layout">
      <div className="delete-modal">
        <button onClick={submit} className="confirm-delete-entry">
          Sterge intrarea
        </button>
        <button onClick={() => setOpenDelete(false)} className="cancel-delete-entry">
          Inapoi
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
