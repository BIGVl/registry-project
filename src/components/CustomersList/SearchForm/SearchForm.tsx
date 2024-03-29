import './SearchForm.scss';
import searchImg from '../../../assets/search.png';
import { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';
import { LocationContext, UserIDContext } from '../../../Contexts';
import { FormDataIded } from '../../../globalInterfaces';
import search from '../../../helpers/search';
import { OrderByDirection } from 'firebase/firestore';
import { ReactComponent as Filter } from '../../../assets/filter.svg';
import { ReactComponent as Sort } from '../../../assets/sort.svg';
import FilterModal from './components/FilterModal/FilterModal';
import SortModal from './components/SortModal/SortModal';

interface Props {
  setCustomers: Dispatch<SetStateAction<FormDataIded[]>>;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SearchForm = ({ setCustomers, searchValue, setSearchValue }: Props) => {
  const [sort, setSort] = useState<OrderByDirection>('desc');
  // const [filter, setFilter] = useState({ entryDate: '', leaveDate: '' });
  const [openSort, setOpenSort] = useState(false);
  // const [openFilter, setOpenFilter] = useState(false);
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const userIdString = userId || '';
  const searchArgs = { location, userId: userIdString, searchValue, setCustomers };

  return (
    <form action="GET" className="search-container">
      <input
        onChange={(e) => {
          setSearchValue(e.target.value);
          search(location, userIdString, searchValue, setCustomers, sort);
        }}
        aria-label="search input"
        placeholder="Cauta numele clientului"
        className="search"
        name="search"
        id="search"
      />
      <img className="search-icon" src={searchImg} alt="" />
      <div className="filter-sort-container">
        {/* <Filter className="filter" onClick={() => setOpenFilter(!openFilter)} /> */}
        <Sort className="sort" onClick={() => setOpenSort(!openSort)} />
      </div>
      {/* {openFilter && <FilterModal />} */}
      {openSort && <SortModal sort={sort} setSort={setSort} setOpenSort={setOpenSort} searchArgs={searchArgs} />}
    </form>
  );
};

export default SearchForm;
