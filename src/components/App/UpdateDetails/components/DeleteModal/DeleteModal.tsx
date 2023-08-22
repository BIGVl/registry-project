import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../../Contexts';
import { FormData } from '../../../../../globalInterfaces';
import deleteDates from '../../../../../helpers/deleteDates';
import deleteEntry from '../../../../../helpers/deleteEntry';
import getCustomerInfo from '../../../../../helpers/getCustomerInfo';
import './DeleteModal.scss';

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
    await deleteEntry(`${location}${userID}`, `${entryDetails.customerId}`);
    await deleteDates(
      location,
      userIdString,
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
        <button onClick={submit} className="confirm">
          Sterge intrarea
        </button>
        <button onClick={() => setOpenDelete(false)} className="cancel">
          Inapoi
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
