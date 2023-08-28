import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../../Contexts';
import { EntryDetails, FormData } from '../../../../../globalInterfaces';
import deleteDates from '../../../../../helpers/deleteDates';
import deleteEntry from '../../../../../helpers/deleteEntry';
import getCustomerInfo from '../../../../../helpers/getCustomerInfo';
import './DeleteModal.scss';

interface Props {
  entryDetails: EntryDetails;
  deleteModalOpen: (value: boolean) => void;
  updateModalOpen: (value: boolean) => void;
}

const DeleteModal = ({ entryDetails, deleteModalOpen, updateModalOpen }: Props) => {
  const userID = useContext(UserIDContext);
  const location = useContext(LocationContext);
  const userIdString = userID ?? '';
  const [customerData, setCustomerData] = useState<FormData | DocumentData>();
  //Get data of the customer
  async function getData() {
    const responseData = await getCustomerInfo(location, userIdString, entryDetails.customerId);
    setCustomerData(responseData ?? customerData);
  }

  useEffect(() => {
    getData();
  }, []);

  const submit = async () => {
    if (customerData) {
      await deleteEntry(`${location}${userID}`, `${entryDetails.customerId}`);
      await deleteDates(
        location,
        userIdString,
        customerData.entryDate,
        customerData.leaveDate,
        customerData.rooms,
        entryDetails.customerId
      );
      deleteModalOpen(false);
      updateModalOpen(false);
    }
  };

  return (
    <div className="delete-modal-layout">
      <div className="delete-modal">
        <button onClick={submit} className="confirm">
          Sterge intrarea
        </button>
        <button onClick={() => deleteModalOpen(false)} className="cancel">
          Inapoi
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
