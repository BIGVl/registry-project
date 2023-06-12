import { OrderByDirection } from 'firebase/firestore';
import './SortModal.scss';
import { FormDataIded } from '../../../../../globalInterfaces';
import search from '../../../../../helpers/search';
import { Dispatch, MouseEvent, SetStateAction } from 'react';

interface Props {
  sort: OrderByDirection;
  setSort: Dispatch<SetStateAction<OrderByDirection>>;
  setOpenSort: (value: boolean) => void;
  searchArgs: { location: string; userId: string; searchValue: string; setCustomers: Dispatch<SetStateAction<FormDataIded[]>> };
}

const SortModal = ({ setSort, setOpenSort, sort, searchArgs }: Props) => {
  const { location, userId, searchValue, setCustomers } = searchArgs;

  const handleClick = (e: MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLUListElement;
    const newSort = target.id as OrderByDirection;
    setSort(() => {
      search(location, userId, searchValue, setCustomers, newSort);
      return newSort;
    });

    setOpenSort(false);
  };

  return (
    <div className="sort-modal" aria-label="sort options container">
      Sorteaza
      <li className="sort-options" aria-label="sort options">
        <ul className="desc" id="desc" aria-label="descending" onClick={handleClick}>
          Descrescator
        </ul>
        <ul className="asc" id="asc" aria-label="descending" onClick={handleClick}>
          Crescator
        </ul>
      </li>
    </div>
  );
};

export default SortModal;
