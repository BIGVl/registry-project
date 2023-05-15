import './SearchForm.scss';
import searchImg from '../../../assets/search.png';
import { FormEvent, useContext, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import { FormDataIded } from '../../../globalInterfaces';
import getCustomersList from '../../../helpers/getCustomersList';
import searchCxByName from '../../../helpers/searchCxByName';

interface Props {
  setCustomers: (value: FormDataIded[]) => void;
}

const SearchForm = ({ setCustomers }: Props) => {
  const [searchName, setSearchName] = useState<string>('');
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);

  async function search(e: FormEvent) {
    e.preventDefault();
    if (searchName === '') {
      getCustomersList(location, userId, 2023, setCustomers);
    } else {
      searchCxByName(location, userId, searchName, setCustomers);
    }
  }

  return (
    <form onSubmit={search} action="POST" className="search-container">
      <input onChange={(e) => setSearchName(e.target.value)} className="search" name="search" id="search" />
      <img className="search-icon" src={searchImg} alt="" />
    </form>
  );
};

export default SearchForm;
