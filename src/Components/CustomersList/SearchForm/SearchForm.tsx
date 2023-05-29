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
  const [searchValue, setSearchValue] = useState<string>('');
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const currentYear = new Date().getFullYear();

  async function search(e: FormEvent) {
    e.preventDefault();
    if (searchValue === '') getCustomersList(location, userId, currentYear, setCustomers);
    searchCxByName(location, userId, searchValue, setCustomers);
  }

  return (
    <form onSubmit={search} action="GET" className="search-container">
      <input
        onChange={(e) => {
          console.log(e.target.value);
          setSearchValue(e.target.value);
          if (e.target.value === '') return getCustomersList(location, userId, currentYear, setCustomers);
          else return searchCxByName(location, userId, e.target.value, setCustomers);
        }}
        aria-label="search input"
        placeholder="Cauta numele clientului"
        className="search"
        name="search"
        id="search"
      />
      <img className="search-icon" src={searchImg} alt="" />
    </form>
  );
};

export default SearchForm;
