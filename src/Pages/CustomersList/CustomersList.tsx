import { useContext, useEffect, useState } from 'react';
import './CustomersList.scss';
import { LocationContext, UserIDContext } from '../../Contexts';
import { FormDataIded } from '../../globalInterfaces';
import CustomerCard from '../../components/CustomersList/CustomerCard/CustomerCard';
import SearchForm from '../../components/CustomersList/SearchForm/SearchForm';
import search from '../../helpers/search';

interface Props {
  rooms: number;
}

export default function CustomersList({ rooms }: Props) {
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const [customers, setCustomers] = useState<FormDataIded[]>([]);

  useEffect(() => {
    search(location, userId, '', setCustomers, 'desc');
  }, []);

  return (
    <div className="customer-list-container">
      <h1 className="title">{location}</h1>
      <SearchForm setCustomers={setCustomers} />
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
