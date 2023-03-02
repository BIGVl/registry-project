import { DocumentData } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../../Contexts';
import { FormData } from '../../../../globalInterfaces';
import deleteDates from '../../helpers/deleteDates';
import deleteEntry from '../../helpers/deleteEntry';
import getCustomerInfo from '../../helpers/getCustomerInfo';
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
  const [customerData, setCustomerData] = useState<FormData | DocumentData>();
  //Get data of the customer
  async function getData() {
    const responseData = await getCustomerInfo(location, userID, entryDetails.customerId);
    setCustomerData(responseData ?? customerData);
  }

  useEffect(() => {
    getData();
  }, []);

  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);

  const submit = async () => {
    console.log(customerData);
    await deleteEntry(`${location}${userId}`, `${entryDetails.customerId}`);
    await deleteDates(
      location,
      userId,
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
