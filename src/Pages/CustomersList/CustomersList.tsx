import { useContext, useEffect, useState } from 'react';
import './CustomersList.scss';
import { LocationContext, UserIDContext } from '../../Contexts';
import { FormDataIded } from '../../globalInterfaces';
import CustomerCard from '../../components/CustomersList/CustomerCard/CustomerCard';
import SearchForm from '../../components/CustomersList/SearchForm/SearchForm';
import search from '../../helpers/search';
import { DocumentData, Query } from 'firebase/firestore';

interface Props {
  rooms: number;
}

export default function CustomersList({ rooms }: Props) {
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const [customers, setCustomers] = useState<FormDataIded[]>([]);
  const [lastDoc, setLastDoc] = useState<Query<DocumentData> | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    search(location, userId, '', setCustomers, 'desc');

    window.addEventListener('scroll', scroll);

    return () => window.removeEventListener('scroll', scroll);
  }, []);

  const scroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      const { next } = await search(location, userId, searchValue, setCustomers, 'desc', lastDoc);
      setLastDoc(next);
      setCustomers((prev) => {
        return [...prev];
      });
    }
  };

  return (
    <div className="customer-list-container">
      <h1 className="title">{location}</h1>
      <SearchForm setCustomers={setCustomers} searchValue={searchValue} setSearchValue={setSearchValue} />
      <section className="customers-list">
        <ul className="customer-cards-container">
          {customers.map((cx, i) => {
            return <CustomerCard key={i} data={cx} rooms={rooms} />;
          })}
        </ul>
      </section>
    </div>
  );
}
