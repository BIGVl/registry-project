import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getCxNr = async (userID: string, location: string, setCustomerID: (value: number) => void) => {
  //If we save the customer first time we give it a new id incremental
  //I know that this might not be a good practice, but it should do it for now, if necessary it will be changed
  const responseNrCx = await getDoc(doc(db, `${location}${userID}`, 'numar-clienti'));
  const nrCxData = responseNrCx.data();
  const customerID = nrCxData ? nrCxData['numar-clienti'] + 1 : 1;
  setCustomerID(customerID);
};

export default getCxNr;
