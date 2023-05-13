import './SearchForm.scss';
import searchImg from '../../../assets/search.png';
import { useContext, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FormDataIded } from '../../../globalInterfaces';

interface Props {
  setCustomers: (value: FormDataIded[]) => void;
}

const SearchForm = ({ setCustomers }: Props) => {
  const [searchName, setSearchName] = useState<string>('');
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);

  async function searchCxByName() {
    const docArray: FormDataIded[] = [];
    const q = query(collection(db, `${location}${userId}`), where('name', '==', searchName));
    const querySnap = await getDocs(q);
    setCustomers([]);
    querySnap.forEach((doc) => {
      const formData: FormDataIded = doc.data() as FormDataIded;
      formData.id = doc.id;
      docArray.push(formData);
    });
    setCustomers([...docArray]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        searchCxByName();
      }}
      action="POST"
      className="search-container"
    >
      <input onChange={(e) => setSearchName(e.target.value)} className="search" name="search" id="search" />
      <img className="search-icon" src={searchImg} alt="" />
    </form>
  );
};

export default SearchForm;
