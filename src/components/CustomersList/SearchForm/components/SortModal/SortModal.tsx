import { OrderByDirection } from 'firebase/firestore';
import './SortModal.scss';
import { FormDataIded } from '../../../../../globalInterfaces';
import search from '../../../../../helpers/search';
import { MouseEvent } from 'react';

interface Props {
  sort: OrderByDirection;
  setSort: (value: OrderByDirection) => void;
  setOpenSort: (value: boolean) => void;
  searchArgs: { location: string; userId: string; searchValue: string; setCustomers: (value: FormDataIded[]) => void };
}

const SortModal = ({ setSort, setOpenSort, sort, searchArgs }: Props) => {
  const { location, userId, searchValue, setCustomers } = searchArgs;

  const handleClick = (e: MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLUListElement;
    const newSort = target.id as OrderByDirection;
    //@ts-ignore
    setSort(() => {
      search(location, userId, searchValue, setCustomers, newSort);
      return newSort;
    });

    setOpenSort(false);
  };

  return (
    <div className="sort-modal">
      <li className="sort-options">
        Sorteaza
        <ul className="desc" id="desc" onClick={handleClick}>
          Descrescator
        </ul>
        <ul className="asc" id="asc" onClick={handleClick}>
          Crescator
        </ul>
      </li>
    </div>
  );
};

export default SortModal;
